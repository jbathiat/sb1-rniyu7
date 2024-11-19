import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnalyticsData {
  photosTaken: number;
  photosPrinted: number;
  photosEmailed: number;
  photosShared: number;
  filtersApplied: number;
  propsUsed: number;
  retakes: number;
  qrCodesScanned: number;
  history: {
    timestamp: number;
    type: 'capture' | 'print' | 'email' | 'share' | 'filter' | 'prop' | 'retake' | 'qr';
    details?: string;
  }[];
  dailyStats: {
    [date: string]: {
      photosTaken: number;
      photosPrinted: number;
      photosEmailed: number;
    };
  };
}

interface AnalyticsStore {
  data: AnalyticsData;
  trackEvent: (type: AnalyticsData['history'][0]['type'], details?: string) => void;
  resetStats: () => void;
}

const initialData: AnalyticsData = {
  photosTaken: 0,
  photosPrinted: 0,
  photosEmailed: 0,
  photosShared: 0,
  filtersApplied: 0,
  propsUsed: 0,
  retakes: 0,
  qrCodesScanned: 0,
  history: [],
  dailyStats: {}
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      data: initialData,
      trackEvent: (type, details) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const dailyStats = { ...state.data.dailyStats };
        
        if (!dailyStats[today]) {
          dailyStats[today] = {
            photosTaken: 0,
            photosPrinted: 0,
            photosEmailed: 0
          };
        }

        const newData = {
          ...state.data,
          photosTaken: type === 'capture' ? state.data.photosTaken + 1 : state.data.photosTaken,
          photosPrinted: type === 'print' ? state.data.photosPrinted + 1 : state.data.photosPrinted,
          photosEmailed: type === 'email' ? state.data.photosEmailed + 1 : state.data.photosEmailed,
          photosShared: type === 'share' ? state.data.photosShared + 1 : state.data.photosShared,
          filtersApplied: type === 'filter' ? state.data.filtersApplied + 1 : state.data.filtersApplied,
          propsUsed: type === 'prop' ? state.data.propsUsed + 1 : state.data.propsUsed,
          retakes: type === 'retake' ? state.data.retakes + 1 : state.data.retakes,
          qrCodesScanned: type === 'qr' ? state.data.qrCodesScanned + 1 : state.data.qrCodesScanned,
          history: [
            {
              timestamp: Date.now(),
              type,
              details
            },
            ...state.data.history
          ],
          dailyStats: {
            ...dailyStats,
            [today]: {
              ...dailyStats[today],
              photosTaken: type === 'capture' ? dailyStats[today].photosTaken + 1 : dailyStats[today].photosTaken,
              photosPrinted: type === 'print' ? dailyStats[today].photosPrinted + 1 : dailyStats[today].photosPrinted,
              photosEmailed: type === 'email' ? dailyStats[today].photosEmailed + 1 : dailyStats[today].photosEmailed
            }
          }
        };

        return { data: newData };
      }),
      resetStats: () => set({ data: initialData })
    }),
    {
      name: 'analytics-store',
      version: 1
    }
  )
);