import { create } from 'zustand';
import { Photo, PhotoFilters } from '../types';
import { createThumbnail } from '../utils/imageProcessor';

interface PhotoStore {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  updatePhotoFilters: (id: string, filters: PhotoFilters) => void;
}

const DEFAULT_FILTERS: PhotoFilters = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  sepia: 0,
  grayscale: 0,
  blur: 0
};

export const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  addPhoto: async (photo) => {
    try {
      // Generate thumbnail
      const thumbnailUrl = await createThumbnail(photo.url);
      
      set((state) => ({ 
        photos: [{
          ...photo,
          thumbnailUrl,
          filters: DEFAULT_FILTERS
        }, ...state.photos] 
      }));
    } catch (error) {
      console.error('Failed to create thumbnail:', error);
      // Fall back to using original image if thumbnail creation fails
      set((state) => ({ 
        photos: [{
          ...photo,
          filters: DEFAULT_FILTERS
        }, ...state.photos] 
      }));
    }
  },
  deletePhoto: (id) => set((state) => ({ 
    photos: state.photos.filter(photo => photo.id !== id) 
  })),
  updatePhotoFilters: (id, filters) => set((state) => ({
    photos: state.photos.map(photo => 
      photo.id === id ? { ...photo, filters } : photo
    )
  }))
}));