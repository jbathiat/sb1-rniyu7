import React from 'react';
import { Share2, QrCode, BarChart } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useAnalytics } from '../../hooks/useAnalytics';

const SharingSettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useAdminStore();
  const { getShareMetrics, getQRMetrics } = useAnalytics();

  // Ensure settings.sharing exists with default values
  const defaultSharingSettings = {
    enableEmail: true,
    enablePrinting: true,
    enableSocialSharing: true,
    enableQRCode: true,
    emailjs: {
      serviceId: '',
      templateId: '',
      publicKey: '',
      defaultSubject: 'Your Photo from WebBooth'
    },
    emailTemplate: 'Here is your photo from WebBooth!',
    social: {
      defaultMessage: 'Check out my photo from WebBooth!',
      buttonStyle: 'round',
      buttonSize: 'medium',
      platforms: {
        facebook: true,
        twitter: true,
        linkedin: true,
        whatsapp: true
      }
    },
    qrCode: {
      size: 256,
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      includeMargin: true
    },
    analytics: {
      enableTracking: true,
      trackSocialShares: true,
      trackQRScans: true
    }
  };

  // Merge default settings with actual settings
  const sharingSettings = {
    ...defaultSharingSettings,
    ...settings?.sharing,
    social: {
      ...defaultSharingSettings.social,
      ...settings?.sharing?.social,
      platforms: {
        ...defaultSharingSettings.social.platforms,
        ...settings?.sharing?.social?.platforms
      }
    },
    qrCode: {
      ...defaultSharingSettings.qrCode,
      ...settings?.sharing?.qrCode
    },
    analytics: {
      ...defaultSharingSettings.analytics,
      ...settings?.sharing?.analytics
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    const [section, subsection, key] = field.split('.');
    
    if (subsection && key) {
      updateSettings({
        sharing: {
          ...sharingSettings,
          [section]: {
            ...sharingSettings[section],
            [subsection]: {
              ...sharingSettings[section][subsection],
              [key]: value
            }
          }
        }
      });
    } else if (section) {
      updateSettings({
        sharing: {
          ...sharingSettings,
          [section]: value
        }
      });
    }
  };

  const shareMetrics = getShareMetrics();
  const qrMetrics = getQRMetrics();

  return (
    <div className="space-y-8">
      {/* Social Sharing Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <Share2 size={24} className="text-blue-500" />
          <h2 className="text-xl font-bold">Social Sharing</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sharingSettings.enableSocialSharing}
              onChange={(e) => handleSettingChange('enableSocialSharing', e.target.checked)}
              className="rounded"
            />
            <label className="text-sm font-medium">Enable Social Sharing</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Share Message</label>
            <input
              type="text"
              value={sharingSettings.social.defaultMessage}
              onChange={(e) => handleSettingChange('social.defaultMessage', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Button Style</label>
            <select
              value={sharingSettings.social.buttonStyle}
              onChange={(e) => handleSettingChange('social.buttonStyle', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="round">Round</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Button Size</label>
            <select
              value={sharingSettings.social.buttonSize}
              onChange={(e) => handleSettingChange('social.buttonSize', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Enabled Platforms</label>
            <div className="space-y-2">
              {Object.entries(sharingSettings.social.platforms).map(([platform, enabled]) => (
                <div key={platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleSettingChange(`social.platforms.${platform}`, e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium capitalize">{platform}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <QrCode size={24} className="text-purple-500" />
          <h2 className="text-xl font-bold">QR Code Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sharingSettings.enableQRCode}
              onChange={(e) => handleSettingChange('enableQRCode', e.target.checked)}
              className="rounded"
            />
            <label className="text-sm font-medium">Enable QR Codes</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">QR Code Size</label>
            <input
              type="number"
              value={sharingSettings.qrCode.size}
              onChange={(e) => handleSettingChange('qrCode.size', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="128"
              max="512"
              step="32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Foreground Color</label>
            <input
              type="color"
              value={sharingSettings.qrCode.foregroundColor}
              onChange={(e) => handleSettingChange('qrCode.foregroundColor', e.target.value)}
              className="w-full p-2 border rounded h-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={sharingSettings.qrCode.backgroundColor}
              onChange={(e) => handleSettingChange('qrCode.backgroundColor', e.target.value)}
              className="w-full p-2 border rounded h-10"
            />
          </div>
        </div>
      </div>

      {/* Analytics Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <BarChart size={24} className="text-green-500" />
          <h2 className="text-xl font-bold">Analytics Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sharingSettings.analytics.enableTracking}
              onChange={(e) => handleSettingChange('analytics.enableTracking', e.target.checked)}
              className="rounded"
            />
            <label className="text-sm font-medium">Enable Analytics Tracking</label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sharingSettings.analytics.trackSocialShares}
                onChange={(e) => handleSettingChange('analytics.trackSocialShares', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium">Track Social Shares</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sharingSettings.analytics.trackQRScans}
                onChange={(e) => handleSettingChange('analytics.trackQRScans', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium">Track QR Code Downloads</label>
            </div>
          </div>

          {/* Analytics Overview */}
          {sharingSettings.analytics.enableTracking && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Analytics Overview</h3>
              
              {sharingSettings.analytics.trackSocialShares && (
                <div>
                  <h4 className="font-medium mb-2">Social Shares</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(
                        shareMetrics.reduce((acc: any, curr: any) => {
                          acc[curr.platform] = (acc[curr.platform] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([platform, count]) => (
                        <div key={platform} className="flex justify-between">
                          <span className="capitalize">{platform}:</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {sharingSettings.analytics.trackQRScans && (
                <div>
                  <h4 className="font-medium mb-2">QR Code Downloads</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(
                        qrMetrics.reduce((acc: any, curr: any) => {
                          acc[curr.format] = (acc[curr.format] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([format, count]) => (
                        <div key={format} className="flex justify-between">
                          <span className="uppercase">{format}:</span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharingSettingsPanel;