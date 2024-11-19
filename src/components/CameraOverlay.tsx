import React from 'react';
import { UIUXSettings } from '../types';

interface CameraOverlayProps {
  settings: UIUXSettings;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ settings }) => {
  const getPositionClasses = () => {
    switch (settings.overlayPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-10`}>
      {settings.overlayImage && (
        <img
          src={settings.overlayImage}
          alt="Overlay"
          className="max-w-[200px] h-auto mb-2"
        />
      )}
      {settings.overlayText && (
        <div
          className="text-center drop-shadow-lg"
          style={{
            color: settings.overlayTextColor,
            fontSize: `${settings.overlayTextSize}px`,
          }}
        >
          {settings.overlayText}
        </div>
      )}
    </div>
  );
};

export default CameraOverlay;