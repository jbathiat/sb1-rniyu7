import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, Image, Settings, Home, Printer, RotateCcw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { usePhotoStore } from '../store/photoStore';
import { useAdminStore } from '../store/adminStore';
import { lightController } from '../services/lightController';
import { processImageWithOverlays, createThumbnail } from '../utils/imageProcessor';
import CameraOverlay from './CameraOverlay';

interface PreviewPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
}

const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [previewPhoto, setPreviewPhoto] = useState<PreviewPhoto | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(20);
  const addPhoto = usePhotoStore((state) => state.addPhoto);
  const settings = useAdminStore((state) => state.settings);

  // Default camera settings if undefined
  const defaultCameraSettings = {
    source: 'webcam',
    webcam: {
      deviceId: '',
      resolution: { width: 1280, height: 720 },
      facingMode: 'user'
    }
  };

  // Use default settings if camera settings are undefined
  const cameraSettings = settings?.camera ?? defaultCameraSettings;

  // Preview timer effect
  useEffect(() => {
    if (previewPhoto && previewTimeLeft > 0) {
      const timer = setInterval(() => {
        setPreviewTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (previewTimeLeft === 0) {
      setPreviewPhoto(null);
    }
  }, [previewPhoto, previewTimeLeft]);

  const startCountdown = useCallback(() => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(5);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Capture after countdown
    setTimeout(async () => {
      await capturePhoto();
      setIsCapturing(false);
    }, 5000);
  }, [isCapturing]);

  const capturePhoto = useCallback(async () => {
    if (webcamRef.current) {
      try {
        await lightController.activateLights();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const id = Date.now().toString();
          
          // Check if there are any enabled overlays
          const hasOverlays = settings?.processing?.overlays && 
                            settings.processing.overlays.some(overlay => overlay.enabled);
          
          let processedImageSrc = imageSrc;
          
          if (hasOverlays) {
            try {
              processedImageSrc = await processImageWithOverlays(
                imageSrc,
                settings.processing.overlays
              );
            } catch (error) {
              console.error('Error processing image with overlays:', error);
            }
          }

          // Create thumbnail for preview
          const thumbnailUrl = await createThumbnail(processedImageSrc, 800, 1200);

          const photo = {
            id,
            url: processedImageSrc,
            timestamp: Date.now(),
            filters: {
              brightness: 1,
              contrast: 1,
              saturation: 1,
              sepia: 0,
              grayscale: 0,
              blur: 0
            },
            processed: hasOverlays
          };

          // Save original if preserveOriginal is enabled
          if (settings?.processing?.preserveOriginal && hasOverlays) {
            // Store original in unprocessed folder
            console.log('Saving original to unprocessed folder:', imageSrc);
          }

          addPhoto(photo);
          setPreviewPhoto({ id, url: processedImageSrc, thumbnailUrl });
          setPreviewTimeLeft(20);
        }
      } catch (error) {
        console.error('Error during photo capture:', error);
      } finally {
        await lightController.deactivateLights();
      }
    }
  }, [addPhoto, settings?.processing]);

  const handlePrint = () => {
    if (!previewPhoto) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Photo</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; padding: 0; }
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${previewPhoto.url}" alt="Print photo" />
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleRetake = () => {
    setPreviewPhoto(null);
    setPreviewTimeLeft(20);
    startCountdown();
  };

  const videoConstraints = {
    width: cameraSettings.webcam.resolution.width,
    height: cameraSettings.webcam.resolution.height,
    facingMode: cameraSettings.webcam.facingMode
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 flex items-center gap-2">
              <Home size={24} />
              <span>WebBooth</span>
            </Link>
            <div className="flex gap-6">
              <Link
                to="/gallery"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Image size={20} />
                <span>Gallery</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative h-screen flex items-center justify-center bg-black">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className={`w-full h-full object-contain ${settings?.uiux?.mirrorPreview ? 'scale-x-[-1]' : ''}`}
        />

        {settings?.uiux?.showLivePreview && <CameraOverlay settings={settings.uiux} />}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-9xl font-bold text-white animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Capture Button */}
        {!previewPhoto && (
          <button
            onClick={startCountdown}
            disabled={isCapturing}
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-white rounded-full text-xl font-semibold transition-colors flex items-center gap-2 ${
              isCapturing ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <CameraIcon size={24} />
            {isCapturing ? 'Taking Photo...' : 'Take Photo'}
          </button>
        )}

        {/* Preview Overlay */}
        {previewPhoto && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col">
            {/* Timer Bar */}
            <div className="w-full h-1 bg-gray-700">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${(previewTimeLeft / 20) * 100}%` }}
              />
            </div>
            
            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-xl w-full space-y-6">
                <img
                  src={previewPhoto.thumbnailUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                
                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Printer size={20} />
                    Print
                  </button>
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <RotateCcw size={20} />
                    Retake
                  </button>
                  <button
                    onClick={() => setPreviewPhoto(null)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;