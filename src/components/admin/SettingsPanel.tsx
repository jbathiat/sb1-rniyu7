import React, { useState } from 'react';
import { Settings, Camera, Share2, Image, Sticker, BarChart } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import CameraSettingsPanel from './CameraSettingsPanel';
import ImageProcessingPanel from './ImageProcessingPanel';
import SharingSettingsPanel from './SharingSettingsPanel';
import PropsSettingsPanel from './PropsSettingsPanel';
import AnalyticsPanel from './AnalyticsPanel';

const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'uiux' | 'camera' | 'sharing' | 'processing' | 'props' | 'analytics'>('uiux');
  const { settings, updateSettings } = useAdminStore();

  // Ensure settings exist with default values
  const defaultSettings = {
    uiux: {
      overlayText: 'WebBooth',
      overlayTextColor: '#ffffff',
      overlayTextSize: 24,
      overlayPosition: 'bottom-right',
      showLivePreview: true,
      mirrorPreview: false,
      inactivityTimeout: {
        enabled: true,
        duration: 60
      },
      welcomeScreen: {
        heading: 'Welcome to WebBooth',
        subheading: 'Capture your perfect moment with our professional photo booth'
      }
    }
  };

  // Merge default settings with actual settings
  const currentSettings = {
    ...defaultSettings,
    ...settings,
    uiux: {
      ...defaultSettings.uiux,
      ...settings?.uiux,
      inactivityTimeout: {
        ...defaultSettings.uiux.inactivityTimeout,
        ...settings?.uiux?.inactivityTimeout
      },
      welcomeScreen: {
        ...defaultSettings.uiux.welcomeScreen,
        ...settings?.uiux?.welcomeScreen
      }
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    const [section, subsection, key] = field.split('.');
    
    if (subsection && key) {
      updateSettings({
        uiux: {
          ...currentSettings.uiux,
          [subsection]: {
            ...currentSettings.uiux[subsection],
            [key]: value
          }
        }
      });
    } else if (section) {
      updateSettings({
        uiux: {
          ...currentSettings.uiux,
          [section]: value
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-4 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('uiux')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'uiux'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <span>UI/UX</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'camera'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Camera size={20} />
            <span>Camera</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('sharing')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'sharing'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Share2 size={20} />
            <span>Sharing</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('processing')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'processing'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Image size={20} />
            <span>Processing</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('props')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'props'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sticker size={20} />
            <span>Props</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart size={20} />
            <span>Analytics</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'uiux' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={24} className="text-blue-500" />
            <h2 className="text-xl font-bold">UI/UX Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Welcome Screen Text */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Welcome Screen</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <input
                    type="text"
                    value={currentSettings.uiux.welcomeScreen.heading}
                    onChange={(e) => handleSettingChange('welcomeScreen.heading', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subheading</label>
                  <input
                    type="text"
                    value={currentSettings.uiux.welcomeScreen.subheading}
                    onChange={(e) => handleSettingChange('welcomeScreen.subheading', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Camera Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentSettings.uiux.showLivePreview}
                    onChange={(e) => handleSettingChange('showLivePreview', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Show Live Preview</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentSettings.uiux.mirrorPreview}
                    onChange={(e) => handleSettingChange('mirrorPreview', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Mirror Preview Horizontally</label>
                </div>
              </div>
            </div>

            {/* Inactivity Timeout */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inactivity Timeout</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentSettings.uiux.inactivityTimeout.enabled}
                    onChange={(e) => handleSettingChange('inactivityTimeout.enabled', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Enable Timeout</label>
                </div>
                {currentSettings.uiux.inactivityTimeout.enabled && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeout Duration (seconds)</label>
                    <input
                      type="number"
                      value={currentSettings.uiux.inactivityTimeout.duration}
                      onChange={(e) => handleSettingChange('inactivityTimeout.duration', parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      min="10"
                      max="300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Overlay Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Camera Overlay</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Overlay Text</label>
                  <input
                    type="text"
                    value={currentSettings.uiux.overlayText}
                    onChange={(e) => handleSettingChange('overlayText', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    value={currentSettings.uiux.overlayTextColor}
                    onChange={(e) => handleSettingChange('overlayTextColor', e.target.value)}
                    className="w-full p-2 border rounded h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Size (px)</label>
                  <input
                    type="number"
                    value={currentSettings.uiux.overlayTextSize}
                    onChange={(e) => handleSettingChange('overlayTextSize', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="12"
                    max="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <select
                    value={currentSettings.uiux.overlayPosition}
                    onChange={(e) => handleSettingChange('overlayPosition', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'camera' && <CameraSettingsPanel />}
      {activeTab === 'processing' && <ImageProcessingPanel />}
      {activeTab === 'sharing' && <SharingSettingsPanel />}
      {activeTab === 'props' && <PropsSettingsPanel />}
      {activeTab === 'analytics' && <AnalyticsPanel />}
    </div>
  );
};

export default SettingsPanel;