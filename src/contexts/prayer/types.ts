
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';

export type MosqueData = Mosque;

export interface PrayerContextType {
  prayers: PrayerTime[];
  mosques: Mosque[];
  selectedPrayer: PrayerTime | null;
  currentFilter: FilterOption;
  currentTime: Date;
  searchParams: SearchParams;
  favorites: string[];
  userLocation: {latitude: number; longitude: number} | null;
  locationError: string | null;
  setSelectedPrayer: (prayer: PrayerTime | null) => void;
  setCurrentFilter: (filter: FilterOption) => void;
  setSearchParams: (params: Partial<SearchParams>) => void;
  getFilteredMosques: () => Mosque[];
  isPrayerPassed: (time: string) => boolean;
  isPrayerActive: (time: string) => boolean;
  toggleFavorite: (mosqueId: string) => void;
  isFavorite: (mosqueId: string) => boolean;
  formatTimeToAmPm: (time: string) => string;
  saveScrollPosition: (page: string, position: number) => void;
  getSavedScrollPosition: (page: string) => number;
  trackPageVisit: (page: string) => void;
  showUnfavoriteConfirmation: (mosque: Mosque) => void;
  hideUnfavoriteConfirmation: () => void;
  unfavoriteDialogState: {
    isOpen: boolean;
    mosque: Mosque | null;
  };
}
