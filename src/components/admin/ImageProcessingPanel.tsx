import React, { useRef, useState } from 'react';
import { Image, Upload, Trash2, Eye } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { usePhotoStore } from '../../store/photoStore';
import { ImageOverlay } from '../../types';
import { processImage } from '../../utils/imageProcessor';

const ImageProcessingPanel: React.FC = () => {
  const { settings, updateSettings } = useAdminStore();
  const photos = usePhotoStore((state) => state.photos);
  const [selectedOverlay, setSelectedOverlay] = useState<ImageOverlay | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProcessed, setShowProcessed] = useState(true);
  const [showUnprocessed, setShowUnprocessed] = useState(true);

  // Ensure processing settings exist with default values
  const processingSettings = settings?.processing ?? {
    defaultDimensions: {
      width: 1200,
      height: 1800
    },
    overlays: [],
    preserveOriginal: true,
    autoProcess: false
  };

  const handleOverlayUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newOverlay: ImageOverlay = {
          id: Date.now().toString(),
          name: file.name,
          url: e.target?.result as string,
          enabled: true
        };
        
        updateSettings({
          processing: {
            ...processingSettings,
            overlays: [...(processingSettings.overlays || []), newOverlay]
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayDelete = (id: string) => {
    updateSettings({
      processing: {
        ...processingSettings,
        overlays: processingSettings.overlays.filter(overlay => overlay.id !== id)
      }
    });
  };

  const handleOverlayToggle = (id: string) => {
    updateSettings({
      processing: {
        ...processingSettings,
        overlays: processingSettings.overlays.map(overlay =>
          overlay.id === id ? { ...overlay, enabled: !overlay.enabled } : overlay
        )
      }
    });
  };

  const filteredPhotos = photos.filter(photo => 
    (showProcessed && photo.processed) || (showUnprocessed && !photo.processed)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Image size={24} className="text-purple-500" />
        <h2 className="text-xl font-bold">Image Processing</h2>
      </div>

      <div className="space-y-6">
        {/* Auto-processing Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={processingSettings.autoProcess}
            onChange={(e) => updateSettings({
              processing: {
                ...processingSettings,
                autoProcess: e.target.checked
              }
            })}
            className="rounded"
          />
          <label className="text-sm font-medium">Auto-process New Images</label>
        </div>

        {/* Preserve Original Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={processingSettings.preserveOriginal}
            onChange={(e) => updateSettings({
              processing: {
                ...processingSettings,
                preserveOriginal: e.target.checked
              }
            })}
            className="rounded"
          />
          <label className="text-sm font-medium">Preserve Original Images</label>
        </div>

        {/* Default Dimensions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Width (px)</label>
              <input
                type="number"
                value={processingSettings.defaultDimensions.width}
                onChange={(e) => updateSettings({
                  processing: {
                    ...processingSettings,
                    defaultDimensions: {
                      ...processingSettings.defaultDimensions,
                      width: parseInt(e.target.value)
                    }
                  }
                })}
                className="w-full p-2 border rounded"
                min="100"
                max="4000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height (px)</label>
              <input
                type="number"
                value={processingSettings.defaultDimensions.height}
                onChange={(e) => updateSettings({
                  processing: {
                    ...processingSettings,
                    defaultDimensions: {
                      ...processingSettings.defaultDimensions,
                      height: parseInt(e.target.value)
                    }
                  }
                })}
                className="w-full p-2 border rounded"
                min="100"
                max="4000"
              />
            </div>
          </div>
        </div>

        {/* Overlay Management */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Image Overlays</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <Upload size={20} />
                Upload Overlay
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleOverlayUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {processingSettings.overlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className={`relative border rounded-lg p-2 ${
                    overlay.enabled ? 'border-purple-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={overlay.url}
                    alt={overlay.name}
                    className="w-full h-32 object-contain"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => handleOverlayToggle(overlay.id)}
                      className={`p-1 rounded-full ${
                        overlay.enabled ? 'text-purple-500' : 'text-gray-400'
                      }`}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleOverlayDelete(overlay.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Management */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Gallery Management</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showProcessed}
                  onChange={(e) => setShowProcessed(e.target.checked)}
                  className="rounded"
                />
                Show Processed
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showUnprocessed}
                  onChange={(e) => setShowUnprocessed(e.target.checked)}
                  className="rounded"
                />
                Show Unprocessed
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden ${
                    photo.processed ? 'border-green-500' : 'border-gray-300'
                  } border-2`}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                    {photo.processed ? 'Processed' : 'Unprocessed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageProcessingPanel;