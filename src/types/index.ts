import { Photo, PhotoFilters } from './photo';
import { AdminSettings, UIUXSettings, ImageProcessingSettings, PaymentSettings, SharingSettings, ImageOverlay } from './settings';

export * from './photo';
export * from './settings';

export interface FilterPreset {
  name: string;
  icon: string;
  filters: PhotoFilters;
}