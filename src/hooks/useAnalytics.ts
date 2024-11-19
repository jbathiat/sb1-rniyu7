import { useAdminStore } from '../store/adminStore';

interface ShareMetrics {
  platform: string;
  timestamp: number;
}

interface QRMetrics {
  format: string;
  timestamp: number;
}

export const useAnalytics = () => {
  const settings = useAdminStore((state) => state.settings);

  const trackShare = (platform: string) => {
    if (!settings.sharing.analytics.enableTracking || !settings.sharing.analytics.trackSocialShares) {
      return;
    }

    const metrics: ShareMetrics = {
      platform,
      timestamp: Date.now()
    };

    // Store metrics in localStorage
    const shares = JSON.parse(localStorage.getItem('shareMetrics') || '[]');
    shares.push(metrics);
    localStorage.setItem('shareMetrics', JSON.stringify(shares));
  };

  const trackQRDownload = (format: string) => {
    if (!settings.sharing.analytics.enableTracking || !settings.sharing.analytics.trackQRScans) {
      return;
    }

    const metrics: QRMetrics = {
      format,
      timestamp: Date.now()
    };

    const downloads = JSON.parse(localStorage.getItem('qrMetrics') || '[]');
    downloads.push(metrics);
    localStorage.setItem('qrMetrics', JSON.stringify(downloads));
  };

  const getShareMetrics = () => {
    return JSON.parse(localStorage.getItem('shareMetrics') || '[]');
  };

  const getQRMetrics = () => {
    return JSON.parse(localStorage.getItem('qrMetrics') || '[]');
  };

  return {
    trackShare,
    trackQRDownload,
    getShareMetrics,
    getQRMetrics
  };
};