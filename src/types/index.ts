
export type PrayerTime = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type Mosque = {
  id: string;
  name: string;
  address: string;
  distance: number; // in kilometers
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  googleMapsLink?: string; // New field for direct Google Maps link
  prayerTimes: {
    [key: string]: string; // prayer name -> time (HH:MM format)
  };
  images?: string[]; // URLs to mosque images
  facilities?: string[]; // Available facilities
};

export type FilterOption = 
  | 'earliest'
  | 'latest'
  | 'nearest'
  | 'farthest';

export type SearchParams = {
  query: string;
  showFavorites: boolean;
};

export type SalahTime = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: Date;
};
