
import { User, PasswordRequirement } from './auth';

export interface PrayerTime {
  id: string;  // Adding id property
  name: string;
  icon: string;
  time?: string; // Optional because some prayer times might not be available
  timeAMPM?: string; // Formatted in AM/PM
  description: string; // Adding description property
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;
  eidUlAdha: string;
  eidUlFitr: string;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: number;
  coordinates?: Coordinates;
  googleMapsLink?: string;
  prayerTimes: PrayerTimesData;
  images: string[];
  facilities: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface SalahTime {
  date: Date;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface SalahDay {
  date: string;
  day: string;
  month: string;
  year: string;
  hijri: {
    date: string;
    day: string;
    month: string;
    year: string;
  };
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

// Extending FilterOption to include latest and farthest
export type FilterOption = 'earliest' | 'nearest' | 'alphabetical' | 'latest' | 'farthest';

export interface SearchParams {
  query: string;
  showFavorites: boolean;
}

// Export auth types
export type { User, PasswordRequirement };
