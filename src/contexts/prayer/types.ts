
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';

export interface PrayerContextType {
  prayers: PrayerTime[];
  mosques: Mosque[];
  selectedPrayer: PrayerTime | null;
  currentFilter: FilterOption;
  currentTime: Date;
  searchParams: SearchParams;
  favorites: string[]; // Array of mosque IDs
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
}

// Add MosqueData type for the refactored mosque components
export type MosqueData = Mosque;
