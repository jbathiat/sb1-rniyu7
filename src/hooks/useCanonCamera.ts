import { useState, useEffect, useCallback } from 'react';
import { canonSDK } from '../services/canonSDK';
import { CanonCamera, CanonSettings, CanonEvent } from '../services/canonSDK/types';
import { getPlatformConfig } from '../services/canonSDK/platform';

export const useCanonCamera = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<CanonCamera | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CanonCamera[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const platformConfig = getPlatformConfig();
        const success = await canonSDK.initialize({
          ...platformConfig,
          logLevel: 'error'
        });
        setIsInitialized(success);
        if (success) {
          refreshCameraList();
        }
      } catch (error) {
        setError('Failed to initialize Canon SDK');
        console.error(error);
      }
    };

    if (!isInitialized) {
      initializeSDK();
    }

    return () => {
      if (isConnected) {
        canonSDK.disconnect();
      }
    };
  }, [isInitialized]);

  const refreshCameraList = useCallback(async () => {
    try {
      const cameras = await canonSDK.listCameras();
      setAvailableCameras(cameras);
      setError(null);
    } catch (error) {
      setError('Failed to list cameras');
      console.error(error);
    }
  }, []);

  const connectToCamera = useCallback(async (cameraId: string) => {
    try {
      const success = await canonSDK.connect(cameraId);
      setIsConnected(success);
      if (success) {
        setCurrentCamera(canonSDK.getCurrentCamera());
        setError(null);
      }
      return success;
    } catch (error) {
      setError('Failed to connect to camera');
      console.error(error);
      return false;
    }
  }, []);

  const disconnectCamera = useCallback(async () => {
    try {
      const success = await canonSDK.disconnect();
      if (success) {
        setIsConnected(false);
        setCurrentCamera(null);
        setError(null);
      }
      return success;
    } catch (error) {
      setError('Failed to disconnect camera');
      console.error(error);
      return false;
    }
  }, []);

  const captureImage = useCallback(async (settings?: Partial<CanonSettings>) => {
    try {
      const imageData = await canonSDK.captureImage(settings);
      setError(null);
      return imageData;
    } catch (error) {
      setError('Failed to capture image');
      console.error(error);
      return null;
    }
  }, []);

  const updateSettings = useCallback(async (settings: Partial<CanonSettings>) => {
    try {
      await canonSDK.updateSettings(settings);
      setError(null);
    } catch (error) {
      setError('Failed to update camera settings');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const handleEvent = (event: CanonEvent) => {
      switch (event.type) {
        case 'connect':
          refreshCameraList();
          break;
        case 'disconnect':
          refreshCameraList();
          if (event.data?.cameraId === currentCamera?.id) {
            setIsConnected(false);
            setCurrentCamera(null);
          }
          break;
        case 'error':
          setError(event.error?.message || 'Camera error occurred');
          break;
      }
    };

    canonSDK.addEventListener(handleEvent);
    return () => canonSDK.removeEventListener(handleEvent);
  }, [currentCamera, refreshCameraList]);

  return {
    isInitialized,
    isConnected,
    currentCamera,
    availableCameras,
    error,
    refreshCameraList,
    connectToCamera,
    disconnectCamera,
    captureImage,
    updateSettings
  };
};