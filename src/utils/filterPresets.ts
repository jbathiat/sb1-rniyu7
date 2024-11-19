import { FilterPreset } from '../types';

export const filterPresets: FilterPreset[] = [
  {
    name: 'Normal',
    icon: '🌟',
    filters: {
      brightness: 1,
      contrast: 1,
      saturation: 1,
      sepia: 0,
      grayscale: 0,
      blur: 0
    }
  },
  {
    name: 'Vintage',
    icon: '📷',
    filters: {
      brightness: 1.1,
      contrast: 0.9,
      saturation: 0.8,
      sepia: 0.3,
      grayscale: 0.1,
      blur: 0
    }
  },
  {
    name: 'B&W',
    icon: '⚫',
    filters: {
      brightness: 1,
      contrast: 1.2,
      saturation: 0,
      sepia: 0,
      grayscale: 1,
      blur: 0
    }
  },
  {
    name: 'Warm',
    icon: '🌅',
    filters: {
      brightness: 1.1,
      contrast: 1.1,
      saturation: 1.2,
      sepia: 0.2,
      grayscale: 0,
      blur: 0
    }
  },
  {
    name: 'Cool',
    icon: '❄️',
    filters: {
      brightness: 1,
      contrast: 1.1,
      saturation: 0.9,
      sepia: 0,
      grayscale: 0.1,
      blur: 0
    }
  },
  {
    name: 'Sharp',
    icon: '✨',
    filters: {
      brightness: 1.1,
      contrast: 1.3,
      saturation: 1.1,
      sepia: 0,
      grayscale: 0,
      blur: 0
    }
  },
  {
    name: 'Soft',
    icon: '🌸',
    filters: {
      brightness: 1.1,
      contrast: 0.9,
      saturation: 0.9,
      sepia: 0.1,
      grayscale: 0,
      blur: 1.5
    }
  },
  {
    name: 'Drama',
    icon: '🎭',
    filters: {
      brightness: 1.1,
      contrast: 1.4,
      saturation: 1.2,
      sepia: 0,
      grayscale: 0.1,
      blur: 0
    }
  }
];