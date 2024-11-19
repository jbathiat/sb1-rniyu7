import React, { useState } from 'react';
import { Camera, RefreshCcw } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const CameraSettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useAdminStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');

  // Ensure camera settings exist with default values
  const defaultCameraSettings = {
    source: 'webcam',
    webcam: {
      deviceId: '',
      resolution: { width: 1280, height: 720 },
      facingMode: 'user'
    },
    dslr: {
      enabled: false,
      model: '',
      port: '',
      autoFocus: true,
      iso: 400,
      shutterSpeed: '1/125',
      aperture: 'f/5.6',
      capturePreview: true
    },
    picamera: {
      enabled: false,
      resolution: { width: 2592, height: 1944 },
      framerate: 30,
      exposure: 'auto',
      awb: 'auto',
      rotation: 0,
      hflip: false,
      vflip: false,
      brightness: 50,
      contrast: 0,
      saturation: 0,
      sharpness: 0
    }
  };

  // Merge default settings with actual settings
  const cameraSettings = {
    ...defaultCameraSettings,
    ...settings.camera,
    webcam: {
      ...defaultCameraSettings.webcam,
      ...settings.camera?.webcam
    },
    dslr: {
      ...defaultCameraSettings.dslr,
      ...settings.camera?.dslr
    },
    picamera: {
      ...defaultCameraSettings.picamera,
      ...settings.camera?.picamera
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    const [section, subsection, key] = field.split('.');
    
    if (subsection && key) {
      updateSettings({
        camera: {
          ...cameraSettings,
          [section]: {
            ...cameraSettings[section],
            [subsection]: {
              ...cameraSettings[section][subsection],
              [key]: value
            }
          }
        }
      });
    } else if (section) {
      updateSettings({
        camera: {
          ...cameraSettings,
          [section]: value
        }
      });
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Camera size={24} className="text-blue-500" />
        <h2 className="text-xl font-bold">Camera Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Camera Source Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Camera Source</label>
          <select
            value={cameraSettings.source}
            onChange={(e) => handleSettingChange('source', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="webcam">Webcam</option>
            <option value="dslr">DSLR Camera</option>
            <option value="picamera">Raspberry Pi Camera</option>
          </select>
        </div>

        {/* Pi Camera Settings */}
        {cameraSettings.source === 'picamera' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cameraSettings.picamera.enabled}
                onChange={(e) => handleSettingChange('picamera.enabled', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium">Enable Pi Camera</label>
            </div>

            {cameraSettings.picamera.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Resolution</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width</label>
                      <input
                        type="number"
                        value={cameraSettings.picamera.resolution.width}
                        onChange={(e) => handleSettingChange('picamera.resolution.width', parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                        min="640"
                        max="4056"
                        step="2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height</label>
                      <input
                        type="number"
                        value={cameraSettings.picamera.resolution.height}
                        onChange={(e) => handleSettingChange('picamera.resolution.height', parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                        min="480"
                        max="3040"
                        step="2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Framerate</label>
                  <input
                    type="number"
                    value={cameraSettings.picamera.framerate}
                    onChange={(e) => handleSettingChange('picamera.framerate', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Exposure Mode</label>
                  <select
                    value={cameraSettings.picamera.exposure}
                    onChange={(e) => handleSettingChange('picamera.exposure', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="auto">Auto</option>
                    <option value="night">Night</option>
                    <option value="backlight">Backlight</option>
                    <option value="spotlight">Spotlight</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">White Balance</label>
                  <select
                    value={cameraSettings.picamera.awb}
                    onChange={(e) => handleSettingChange('picamera.awb', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="auto">Auto</option>
                    <option value="sunlight">Sunlight</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="shade">Shade</option>
                    <option value="tungsten">Tungsten</option>
                    <option value="fluorescent">Fluorescent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rotation</label>
                  <select
                    value={cameraSettings.picamera.rotation}
                    onChange={(e) => handleSettingChange('picamera.rotation', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={0}>0°</option>
                    <option value={90}>90°</option>
                    <option value={180}>180°</option>
                    <option value={270}>270°</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cameraSettings.picamera.hflip}
                      onChange={(e) => handleSettingChange('picamera.hflip', e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-sm font-medium">Horizontal Flip</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cameraSettings.picamera.vflip}
                      onChange={(e) => handleSettingChange('picamera.vflip', e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-sm font-medium">Vertical Flip</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image Adjustments</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Brightness (0-100)</label>
                      <input
                        type="range"
                        value={cameraSettings.picamera.brightness}
                        onChange={(e) => handleSettingChange('picamera.brightness', parseInt(e.target.value))}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Contrast (-100 to 100)</label>
                      <input
                        type="range"
                        value={cameraSettings.picamera.contrast}
                        onChange={(e) => handleSettingChange('picamera.contrast', parseInt(e.target.value))}
                        className="w-full"
                        min="-100"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Saturation (-100 to 100)</label>
                      <input
                        type="range"
                        value={cameraSettings.picamera.saturation}
                        onChange={(e) => handleSettingChange('picamera.saturation', parseInt(e.target.value))}
                        className="w-full"
                        min="-100"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sharpness (-100 to 100)</label>
                      <input
                        type="range"
                        value={cameraSettings.picamera.sharpness}
                        onChange={(e) => handleSettingChange('picamera.sharpness', parseInt(e.target.value))}
                        className="w-full"
                        min="-100"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* DSLR Settings */}
        {cameraSettings.source === 'dslr' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cameraSettings.dslr.enabled}
                onChange={(e) => handleSettingChange('dslr.enabled', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium">Enable DSLR Camera</label>
            </div>

            {cameraSettings.dslr.enabled && (
              <>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || connectionStatus === 'connected'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      connectionStatus === 'connected'
                        ? 'bg-green-500 text-white'
                        : connectionStatus === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isConnecting ? (
                      <RefreshCcw className="animate-spin" size={20} />
                    ) : (
                      <Camera size={20} />
                    )}
                    {connectionStatus === 'connected'
                      ? 'Connected'
                      : connectionStatus === 'error'
                      ? 'Connection Failed'
                      : 'Connect Camera'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Camera Model</label>
                  <input
                    type="text"
                    value={cameraSettings.dslr.model}
                    onChange={(e) => handleSettingChange('dslr.model', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Canon EOS 5D Mark IV"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Port</label>
                  <input
                    type="text"
                    value={cameraSettings.dslr.port}
                    onChange={(e) => handleSettingChange('dslr.port', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="USB"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cameraSettings.dslr.autoFocus}
                    onChange={(e) => handleSettingChange('dslr.autoFocus', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Enable Auto Focus</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ISO</label>
                  <select
                    value={cameraSettings.dslr.iso}
                    onChange={(e) => handleSettingChange('dslr.iso', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={400}>400</option>
                    <option value={800}>800</option>
                    <option value={1600}>1600</option>
                    <option value={3200}>3200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shutter Speed</label>
                  <select
                    value={cameraSettings.dslr.shutterSpeed}
                    onChange={(e) => handleSettingChange('dslr.shutterSpeed', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="1/1000">1/1000</option>
                    <option value="1/500">1/500</option>
                    <option value="1/250">1/250</option>
                    <option value="1/125">1/125</option>
                    <option value="1/60">1/60</option>
                    <option value="1/30">1/30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Aperture</label>
                  <select
                    value={cameraSettings.dslr.aperture}
                    onChange={(e) => handleSettingChange('dslr.aperture', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="f/1.8">f/1.8</option>
                    <option value="f/2.8">f/2.8</option>
                    <option value="f/4">f/4</option>
                    <option value="f/5.6">f/5.6</option>
                    <option value="f/8">f/8</option>
                    <option value="f/11">f/11</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cameraSettings.dslr.capturePreview}
                    onChange={(e) => handleSettingChange('dslr.capturePreview', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Show Preview Before Capture</label>
                </div>
              </>
            )}
          </div>
        )}

        {/* Webcam Settings */}
        {cameraSettings.source === 'webcam' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Resolution</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    value={cameraSettings.webcam.resolution.width}
                    onChange={(e) => handleSettingChange('webcam.resolution.width', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="640"
                    max="1920"
                    step="2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    value={cameraSettings.webcam.resolution.height}
                    onChange={(e) => handleSettingChange('webcam.resolution.height', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="480"
                    max="1080"
                    step="2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Camera Facing</label>
              <select
                value={cameraSettings.webcam.facingMode}
                onChange={(e) => handleSettingChange('webcam.facingMode', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="user">Front Camera</option>
                <option value="environment">Back Camera</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraSettingsPanel;