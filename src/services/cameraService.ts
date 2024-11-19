import { CameraSettings, DSLRSettings, PiCameraSettings } from '../types/camera';
import { canonSDK } from './canonService';
import { piCamera } from './piCameraService';

export const initializeCamera = async (settings: CameraSettings): Promise<void> => {
  switch (settings.source) {
    case 'dslr':
      if (settings.dslr.enabled) {
        await canonSDK.connect(settings.dslr.port);
        await canonSDK.updateSettings(settings.dslr);
      }
      break;
    case 'picamera':
      if (settings.picamera.enabled) {
        await piCamera.initialize(settings.picamera);
      }
      break;
  }
};

export const capturePhoto = async (settings: CameraSettings): Promise<string> => {
  switch (settings.source) {
    case 'dslr':
      if (settings.dslr.enabled) {
        return await canonSDK.captureImage();
      }
      break;
    case 'picamera':
      if (settings.picamera.enabled) {
        return await piCamera.captureImage();
      }
      break;
  }
  throw new Error('Invalid camera source or camera not enabled');
};</content>