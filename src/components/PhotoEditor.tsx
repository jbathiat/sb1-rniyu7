import React, { useState, useRef } from 'react';
import { Sliders, Send, Printer, RotateCcw, X, Sticker } from 'lucide-react';
import { Photo, PhotoProp, PropItem } from '../types';
import { usePhotoStore } from '../store/photoStore';
import { useAdminStore } from '../store/adminStore';
import PhotoFilters from './PhotoFilters';
import PropSelector from './PropSelector';
import DraggableProp from './DraggableProp';
import { getFilterStyle } from '../utils/filters';

interface PhotoEditorProps {
  photo: Photo;
  onClose: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, onClose }) => {
  const updatePhotoFilters = usePhotoStore((state) => state.updatePhotoFilters);
  const [filters, setFilters] = useState(photo.filters);
  const [showPropSelector, setShowPropSelector] = useState(false);
  const [props, setProps] = useState<PhotoProp[]>(photo.props || []);
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = useAdminStore((state) => state.settings);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    updatePhotoFilters(photo.id, newFilters);
  };

  const handleAddProp = (prop: PropItem) => {
    const newProp: PhotoProp = {
      id: Date.now().toString(),
      propId: prop.id,
      url: prop.url,
      position: {
        x: 50,
        y: 50,
        scale: 1,
        rotation: 0
      }
    };
    setProps([...props, newProp]);
    setShowPropSelector(false);
  };

  const handlePropChange = (updatedProp: PhotoProp) => {
    setProps(props.map(p => p.id === updatedProp.id ? updatedProp : p));
  };

  const handlePropRemove = (propId: string) => {
    setProps(props.filter(p => p.id !== propId));
  };

  const handleSave = () => {
    // Save the photo with props
    // This would typically involve merging the props onto the base image
    // For now, we'll just store the prop data
    const updatedPhoto = {
      ...photo,
      props,
      filters
    };
    // Update in store
    console.log('Saving photo:', updatedPhoto);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] max-w-[1800px] p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Photo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left Side - Photo Preview */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="relative flex-1 min-h-0" ref={containerRef}>
              <img
                src={photo.url}
                alt="Captured photo"
                className="w-full h-full object-contain rounded-lg"
                style={getFilterStyle(filters)}
              />
              
              {/* Props Layer */}
              {props.map((prop) => (
                <DraggableProp
                  key={prop.id}
                  prop={prop}
                  containerRef={containerRef}
                  onChange={handlePropChange}
                  onRemove={() => handlePropRemove(prop.id)}
                />
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {settings.props?.enabled && (
                  <button
                    onClick={() => setShowPropSelector(!showPropSelector)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    <Sticker size={20} />
                    {showPropSelector ? 'Hide Props' : 'Add Props'}
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Send size={20} /> Save & Share
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <RotateCcw size={20} /> Cancel
                </button>
              </div>
            </div>

            {/* Props Selector */}
            {showPropSelector && (
              <div className="mt-4">
                <PropSelector onSelectProp={handleAddProp} />
              </div>
            )}
          </div>

          {/* Right Side - Filters Panel */}
          <div className="w-80 bg-gray-50 p-6 rounded-lg overflow-y-auto">
            <PhotoFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;