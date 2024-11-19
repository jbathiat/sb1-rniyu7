export interface CanonCamera {
  id: string;
  model: string;
  port: string;
  connected: boolean;
}

export interface CanonSettings {
  iso: number;
  shutterSpeed: string;
  aperture: string;
  autoFocus: boolean;
}

export interface CanonImageQuality {
  format: 'JPEG' | 'RAW' | 'RAW+JPEG';
  size: 'L' | 'M' | 'S';
  compression: 'Fine' | 'Normal';
}

export interface CanonLiveViewSettings {
  enabled: boolean;
  zoom: number;
  focusPoint: {
    x: number;
    y: number;
  };
}

export type CanonEventCallback = (event: CanonEvent) => void;

export interface CanonEvent {
  type: 'connect' | 'disconnect' | 'error' | 'capture' | 'settings' | 'storage';
  data?: any;
  error?: Error;
}

export interface CanonSDKConfig {
  platform: 'win32' | 'darwin' | 'linux';
  sdkPath: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}