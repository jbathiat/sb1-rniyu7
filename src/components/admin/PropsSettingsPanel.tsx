import React, { useRef } from 'react';
import { Upload, Trash2, Sticker } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { PropItem } from '../../types';

const PropsSettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useAdminStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newProp: PropItem = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: e.target?.result as string,
          category: 'custom'
        };
        
        updateSettings({
          props: {
            ...settings.props,
            items: [...(settings.props?.items || []), newProp]
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProp = (id: string) => {
    updateSettings({
      props: {
        ...settings.props,
        items: settings.props?.items.filter(item => item.id !== id) || []
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Sticker size={24} className="text-pink-500" />
        <h2 className="text-xl font-bold">Virtual Props</h2>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Props */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.props?.enabled ?? false}
            onChange={(e) => updateSettings({
              props: {
                ...settings.props,
                enabled: e.target.checked
              }
            })}
            className="rounded"
          />
          <label className="text-sm font-medium">Enable Virtual Props</label>
        </div>

        {/* Props Upload */}
        {settings.props?.enabled && (
          <>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                <Upload size={20} />
                Upload New Prop
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supported format: PNG with transparent background
              </p>
            </div>

            {/* Props Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Props</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {settings.props?.items?.map((prop) => (
                  <div
                    key={prop.id}
                    className="relative border rounded-lg p-2 hover:border-pink-500"
                  >
                    <img
                      src={prop.url}
                      alt={prop.name}
                      className="w-full h-32 object-contain"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm truncate">{prop.name}</span>
                      <button
                        onClick={() => handleDeleteProp(prop.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropsSettingsPanel;