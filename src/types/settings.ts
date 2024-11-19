export interface UIUXSettings {
  overlayText: string;
  overlayTextColor: string;
  overlayTextSize: number;
  overlayPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  showLivePreview: boolean;
  mirrorPreview: boolean;
  inactivityTimeout: {
    enabled: boolean;
    duration: number;
  };
  welcomeScreen: {
    heading: string;
    subheading: string;
  };
  overlayImage?: string;
}

export interface PaymentSettings {
  enablePayments: boolean;
  squareAccessToken: string;
  squareTerminalId: string;
  currency: string;
  pricePerPrint: number;
}

export interface SharingSettings {
  enableEmail: boolean;
  enablePrinting: boolean;
  enableSocialSharing: boolean;
  enableQRCode: boolean;
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
    defaultSubject: string;
  };
  emailTemplate: string;
  social: {
    defaultMessage: string;
    buttonStyle: 'round' | 'square';
    buttonSize: 'small' | 'medium' | 'large';
    platforms: {
      facebook: boolean;
      twitter: boolean;
      linkedin: boolean;
      whatsapp: boolean;
    };
  };
  qrCode: {
    size: number;
    foregroundColor: string;
    backgroundColor: string;
    includeMargin: boolean;
    logoUrl?: string;
  };
  analytics: {
    enableTracking: boolean;
    trackSocialShares: boolean;
    trackQRScans: boolean;
  };
  payment?: PaymentSettings;
}

export interface PropsSettings {
  enabled: boolean;
  items: PropItem[];
}

export interface PropItem {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface AdminSettings {
  uiux: UIUXSettings;
  camera: CameraSettings;
  props: PropsSettings;
  sharing: SharingSettings;
  processing: ImageProcessingSettings;
}