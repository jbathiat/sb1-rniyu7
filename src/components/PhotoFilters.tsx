import React from 'react';
import { Sliders, Sun, Contrast, Palette, Filter } from 'lucide-react';
import { PhotoFilters as PhotoFiltersType } from '../types';
import { filterPresets } from '../utils/filterPresets';

interface PhotoFiltersProps {
  filters: PhotoFiltersType;
  onChange: (filters: PhotoFiltersType) => void;
}

const PhotoFilters: React.FC<PhotoFiltersProps> = ({ filters, onChange }) => {
  const handleFilterChange = (key: keyof PhotoFiltersType, value: number) => {
    onChange({ ...filters, [key]: value, preset: undefined });
  };

  const handlePresetChange = (presetName: string) => {
    const preset = filterPresets.find(p => p.name === presetName);
    if (preset) {
      onChange({ ...preset.filters, preset: presetName });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Presets */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Filter size={20} />
          Presets
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {filterPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetChange(preset.name)}
              className={`p-2 rounded-lg text-center transition-colors ${
                filters.preset === preset.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl mb-1">{preset.icon}</span>
              <div className="text-sm">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Adjustments */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sliders size={20} />
          Adjustments
        </h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sun size={16} />
              Brightness
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={filters.brightness}
              onChange={(e) => handleFilterChange('brightness', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Contrast size={16} />
              Contrast
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={filters.contrast}
              onChange={(e) => handleFilterChange('contrast', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Palette size={16} />
              Saturation
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={filters.saturation}
              onChange={(e) => handleFilterChange('saturation', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Filter size={16} />
              Sepia
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filters.sepia}
              onChange={(e) => handleFilterChange('sepia', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Filter size={16} />
              Grayscale
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filters.grayscale}
              onChange={(e) => handleFilterChange('grayscale', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Filter size={16} />
              Blur
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.blur}
              onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoFilters;