import { 
  CanonCamera, 
  CanonSettings, 
  CanonImageQuality,
  CanonLiveViewSettings,
  CanonEventCallback,
  CanonSDKConfig 
} from './types';

class CanonSDKService {
  private static instance: CanonSDKService;
  private initialized: boolean = false;
  private connected: boolean = false;
  private currentCamera: CanonCamera | null = null;
  private eventListeners: Set<CanonEventCallback> = new Set();
  private sdkModule: any = null;

  private constructor() {}

  static getInstance(): CanonSDKService {
    if (!CanonSDKService.instance) {
      CanonSDKService.instance = new CanonSDKService();
    }
    return CanonSDKService.instance;
  }

  async initialize(config: CanonSDKConfig): Promise<boolean> {
    if (this.initialized) return true;

    try {
      // Load the appropriate SDK based on platform
      const sdkPath = this.getSdkPath(config.platform);
      
      // Dynamic import of the native SDK module
      try {
        this.sdkModule = await import(sdkPath);
      } catch (error) {
        console.error('Failed to load Canon SDK:', error);
        return false;
      }

      // Initialize the SDK
      await this.sdkModule.initialize({
        logLevel: config.logLevel,
        eventCallback: this.handleSDKEvent.bind(this)
      });

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Canon SDK:', error);
      return false;
    }
  }

  private getSdkPath(platform: string): string {
    switch (platform) {
      case 'win32':
        return './win/EDSDK';
      case 'darwin':
        return './mac/EDSDK';
      case 'linux':
        return './linux/EDSDK';
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async listCameras(): Promise<CanonCamera[]> {
    if (!this.initialized) {
      throw new Error('SDK not initialized');
    }

    try {
      const cameras = await this.sdkModule.listCameras();
      return cameras.map((camera: any) => ({
        id: camera.id,
        model: camera.model,
        port: camera.port,
        connected: camera.connected
      }));
    } catch (error) {
      console.error('Failed to list cameras:', error);
      return [];
    }
  }

  async connect(cameraId: string): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('SDK not initialized');
    }

    try {
      const success = await this.sdkModule.connect(cameraId);
      if (success) {
        this.connected = true;
        const camera = await this.sdkModule.getCameraInfo(cameraId);
        this.currentCamera = {
          id: camera.id,
          model: camera.model,
          port: camera.port,
          connected: true
        };
      }
      return success;
    } catch (error) {
      console.error('Failed to connect to camera:', error);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    if (!this.connected) return true;

    try {
      await this.sdkModule.disconnect();
      this.connected = false;
      this.currentCamera = null;
      return true;
    } catch (error) {
      console.error('Failed to disconnect camera:', error);
      return false;
    }
  }

  async captureImage(settings?: Partial<CanonSettings>): Promise<string> {
    if (!this.connected) {
      throw new Error('Camera not connected');
    }

    try {
      // Apply settings if provided
      if (settings) {
        await this.updateSettings(settings);
      }

      // Capture image
      const imageData = await this.sdkModule.capture();
      
      // Convert to base64
      const base64Image = await this.convertToBase64(imageData);
      
      return base64Image;
    } catch (error) {
      console.error('Failed to capture image:', error);
      throw error;
    }
  }

  async startLiveView(settings: CanonLiveViewSettings): Promise<void> {
    if (!this.connected) {
      throw new Error('Camera not connected');
    }

    try {
      await this.sdkModule.startLiveView(settings);
    } catch (error) {
      console.error('Failed to start live view:', error);
      throw error;
    }
  }

  async stopLiveView(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.sdkModule.stopLiveView();
    } catch (error) {
      console.error('Failed to stop live view:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<CanonSettings>): Promise<void> {
    if (!this.connected) {
      throw new Error('Camera not connected');
    }

    try {
      await this.sdkModule.updateSettings(settings);
    } catch (error) {
      console.error('Failed to update camera settings:', error);
      throw error;
    }
  }

  async setImageQuality(quality: CanonImageQuality): Promise<void> {
    if (!this.connected) {
      throw new Error('Camera not connected');
    }

    try {
      await this.sdkModule.setImageQuality(quality);
    } catch (error) {
      console.error('Failed to set image quality:', error);
      throw error;
    }
  }

  addEventListener(callback: CanonEventCallback): void {
    this.eventListeners.add(callback);
  }

  removeEventListener(callback: CanonEventCallback): void {
    this.eventListeners.delete(callback);
  }

  private handleSDKEvent(event: any): void {
    const canonEvent = this.translateSDKEvent(event);
    this.eventListeners.forEach(listener => {
      try {
        listener(canonEvent);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  private translateSDKEvent(sdkEvent: any): CanonEvent {
    // Translate SDK-specific events to our standardized format
    return {
      type: sdkEvent.type,
      data: sdkEvent.data,
      error: sdkEvent.error
    };
  }

  private async convertToBase64(imageData: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const base64 = imageData.toString('base64');
        resolve(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        reject(error);
      }
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getCurrentCamera(): CanonCamera | null {
    return this.currentCamera;
  }
}

export const canonSDK = CanonSDKService.getInstance();