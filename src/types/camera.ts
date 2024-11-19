export interface CameraDevice {
  id: string;
  label: string;
  type: 'webcam' | 'dslr' | 'picamera';
}

export interface PiCameraSettings {
  enabled: boolean;
  resolution: {
    width: number;
    height: number;
  };
  framerate: number;
  exposure: 'auto' | 'night' | 'backlight' | 'spotlight' | 'sports';
  awb: 'auto' | 'sunlight' | 'cloudy' | 'shade' | 'tungsten' | 'fluorescent';
  rotation: 0 | 90 | 180 | 270;
  hflip: boolean;
  vflip: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

export interface DSLRSettings {
  enabled: boolean;
  model: string;
  port: string;
  autoFocus: boolean;
  iso: number;
  shutterSpeed: string;
  aperture: string;
  capturePreview: boolean;
}

export interface WebcamSettings {
  deviceId: string;
  resolution: {
    width: number;
    height: number;
  };
  facingMode: 'user' | 'environment';
}

export interface CameraSettings {
  source: 'webcam' | 'dslr' | 'picamera';
  picamera: PiCameraSettings;
  dslr: DSLRSettings;
  webcam: WebcamSettings;
}</content>