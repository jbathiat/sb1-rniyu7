import { PhotoFilters } from '../types';

export const getFilterStyle = (filters: PhotoFilters): React.CSSProperties => {
  return {
    filter: [
      `brightness(${filters.brightness})`,
      `contrast(${filters.contrast})`,
      `saturate(${filters.saturation})`,
      `sepia(${filters.sepia})`,
      `grayscale(${filters.grayscale})`,
      `blur(${filters.blur}px)`
    ].join(' ')
  };
};