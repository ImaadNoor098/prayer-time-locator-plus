
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';
import { prayerTimes } from '@/data/prayers';
import { mosques } from '@/data/mosques';
import { format, addMinutes, parse } from 'date-fns';

interface PrayerContextType {
  prayers: PrayerTime[];
  mosques: Mosque[];
  selectedPrayer: PrayerTime | null;
  currentFilter: FilterOption;
  currentTime: Date;
  searchParams: SearchParams;
  favorites: string[]; // Array of mosque IDs
  setSelectedPrayer: (prayer: PrayerTime | null) => void;
  setCurrentFilter: (filter: FilterOption) => void;
  setSearchParams: (params: Partial<SearchParams>) => void;
  getFilteredMosques: () => Mosque[];
  isPrayerPassed: (time: string) => boolean;
  toggleFavorite: (mosqueId: string) => void;
  isFavorite: (mosqueId: string) => boolean;
  formatTimeToAmPm: (time: string) => string;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayers] = useState<PrayerTime[]>(prayerTimes);
  const [mosqueList] = useState<Mosque[]>(mosques);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerTime | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('earliest');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', showFavorites: false });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('mosque-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('mosque-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Format time from 24-hour to 12-hour format
  const formatTimeToAmPm = (time: string): string => {
    if (!time) return '';
    
    try {
      // Parse the time string to a date object
      const date = parse(time, 'HH:mm', new Date());
      // Format to 12-hour time with AM/PM
      return format(date, 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", error);
      return time; // Return original if parsing fails
    }
  };

  const isPrayerPassed = (time: string): boolean => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0);
    
    // Add 5 minutes grace period to the prayer time
    const graceEndTime = addMinutes(prayerDate, 5);
    
    // Prayer is considered passed only after the grace period
    return graceEndTime < currentTime;
  };

  const toggleFavorite = (mosqueId: string) => {
    setFavorites(prev => {
      if (prev.includes(mosqueId)) {
        return prev.filter(id => id !== mosqueId);
      } else {
        return [...prev, mosqueId];
      }
    });
  };

  const isFavorite = (mosqueId: string): boolean => {
    return favorites.includes(mosqueId);
  };

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const getFilteredMosques = (): Mosque[] => {
    if (!selectedPrayer) return [];
    
    const prayerName = selectedPrayer.name.toLowerCase();
    
    let filtered = mosqueList.filter(mosque => 
      mosque.prayerTimes[prayerName] !== undefined
    );
    
    if (searchParams.query.trim()) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(mosque => 
        mosque.name.toLowerCase().includes(query) || 
        mosque.address.toLowerCase().includes(query)
      );
    }
    
    if (searchParams.showFavorites) {
      filtered = filtered.filter(mosque => favorites.includes(mosque.id));
    }
    
    switch (currentFilter) {
      case 'earliest':
        return [...filtered].sort((a, b) => {
          const timeA = a.prayerTimes[prayerName];
          const timeB = b.prayerTimes[prayerName];
          
          // Separate passed and upcoming prayers
          const aPassed = isPrayerPassed(timeA);
          const bPassed = isPrayerPassed(timeB);
          
          // If one is passed and one isn't, prioritize upcoming prayers
          if (aPassed && !bPassed) return 1;
          if (!aPassed && bPassed) return -1;
          
          // For either both passed or both upcoming, sort by time
          return timeA.localeCompare(timeB);
        });
        
      case 'latest':
        return [...filtered].sort((a, b) => {
          const timeA = a.prayerTimes[prayerName];
          const timeB = b.prayerTimes[prayerName];
          return timeB.localeCompare(timeA);
        });
        
      case 'nearest':
        return [...filtered].sort((a, b) => a.distance - b.distance);
        
      case 'farthest':
        return [...filtered].sort((a, b) => b.distance - a.distance);
        
      default:
        return filtered;
    }
  };

  return (
    <PrayerContext.Provider
      value={{
        prayers,
        mosques: mosqueList,
        selectedPrayer,
        currentFilter,
        currentTime,
        searchParams,
        favorites,
        setSelectedPrayer,
        setCurrentFilter,
        setSearchParams: updateSearchParams,
        getFilteredMosques,
        isPrayerPassed,
        toggleFavorite,
        isFavorite,
        formatTimeToAmPm
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
};
