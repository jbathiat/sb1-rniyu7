export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  timestamp: number;
  filters: PhotoFilters;
  props?: PhotoProp[];
  processed?: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PhotoProp {
  id: string;
  propId: string;
  url: string;
  position: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
}

export interface PhotoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
  blur: number;
  preset?: string;
}