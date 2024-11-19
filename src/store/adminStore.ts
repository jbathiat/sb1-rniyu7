import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminSettings } from '../types';

interface AdminStore {
  isAuthenticated: boolean;
  settings: AdminSettings;
  login: (password: string) => boolean;
  logout: () => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
}

const DEFAULT_SETTINGS: AdminSettings = {
  uiux: {
    overlayText: 'WebBooth',
    overlayTextColor: '#ffffff',
    overlayTextSize: 24,
    overlayPosition: 'bottom-right',
    showLivePreview: true,
    mirrorPreview: false,
    inactivityTimeout: {
      enabled: true,
      duration: 60
    },
    welcomeScreen: {
      heading: 'Welcome to WebBooth',
      subheading: 'Capture your perfect moment with our professional photo booth'
    }
  },
  camera: {
    source: 'webcam',
    webcam: {
      deviceId: '',
      resolution: { width: 1280, height: 720 },
      facingMode: 'user'
    },
    dslr: {
      enabled: false,
      model: '',
      port: '',
      autoFocus: true,
      iso: 400,
      shutterSpeed: '1/125',
      aperture: 'f/5.6',
      capturePreview: true
    },
    picamera: {
      enabled: false,
      resolution: { width: 2592, height: 1944 },
      framerate: 30,
      exposure: 'auto',
      awb: 'auto',
      rotation: 0,
      hflip: false,
      vflip: false,
      brightness: 50,
      contrast: 0,
      saturation: 0,
      sharpness: 0
    }
  },
  props: {
    enabled: false,
    items: []
  },
  sharing: {
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
  },
  processing: {
    defaultDimensions: {
      width: 1200,
      height: 1800
    },
    overlays: [],
    preserveOriginal: true,
    autoProcess: false
  }
};

// Deep merge function for nested objects
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key]) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = { ...source[key] };
      }
    } else {
      result[key] = source[key];
    }
  });
  
  return result;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      settings: DEFAULT_SETTINGS,
      login: (password) => {
        if (password === 'admin') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: deepMerge(state.settings, newSettings)
        }))
    }),
    {
      name: 'admin-store',
      version: 1
    }
  )
);