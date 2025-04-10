
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
  coordinates: {
    latitude: number;
    longitude: number;
  };
  prayerTimes: {
    [key: string]: string; // prayer name -> time (HH:MM format)
  };
};

export type FilterOption = 
  | 'earliest'
  | 'latest'
  | 'nearest'
  | 'farthest';
