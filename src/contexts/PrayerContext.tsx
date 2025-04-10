
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';
import { prayerTimes } from '@/data/prayers';
import { mosques } from '@/data/mosques';

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
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayers] = useState<PrayerTime[]>(prayerTimes);
  const [mosqueList] = useState<Mosque[]>(mosques);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerTime | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('earliest');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', showFavorites: false });
  
  // Load favorites from localStorage on mount
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('mosque-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mosque-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if a prayer time has already passed
  const isPrayerPassed = (time: string): boolean => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0);
    
    return prayerDate < currentTime;
  };

  // Toggle a mosque as favorite
  const toggleFavorite = (mosqueId: string) => {
    setFavorites(prev => {
      if (prev.includes(mosqueId)) {
        return prev.filter(id => id !== mosqueId);
      } else {
        return [...prev, mosqueId];
      }
    });
  };

  // Check if a mosque is favorited
  const isFavorite = (mosqueId: string): boolean => {
    return favorites.includes(mosqueId);
  };

  // Update search parameters
  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  // Get filtered mosques based on current filter, selected prayer, and search
  const getFilteredMosques = (): Mosque[] => {
    if (!selectedPrayer) return [];
    
    const prayerName = selectedPrayer.name.toLowerCase();
    
    // Filter mosques that have the selected prayer time
    let filtered = mosqueList.filter(mosque => 
      mosque.prayerTimes[prayerName] !== undefined
    );
    
    // Apply search filter if query exists
    if (searchParams.query.trim()) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(mosque => 
        mosque.name.toLowerCase().includes(query) || 
        mosque.address.toLowerCase().includes(query)
      );
    }
    
    // Filter by favorites if showFavorites is true
    if (searchParams.showFavorites) {
      filtered = filtered.filter(mosque => favorites.includes(mosque.id));
    }
    
    // Sort based on the current filter
    switch (currentFilter) {
      case 'earliest':
        return [...filtered].sort((a, b) => {
          // Convert prayer times to Date objects for comparison
          const timeA = a.prayerTimes[prayerName];
          const timeB = b.prayerTimes[prayerName];
          
          // If both prayers have passed, keep their original order
          if (isPrayerPassed(timeA) && isPrayerPassed(timeB)) {
            return 0;
          }
          
          // If prayer A has passed but B hasn't, B comes first
          if (isPrayerPassed(timeA) && !isPrayerPassed(timeB)) {
            return 1;
          }
          
          // If prayer B has passed but A hasn't, A comes first
          if (!isPrayerPassed(timeA) && isPrayerPassed(timeB)) {
            return -1;
          }
          
          // Otherwise compare the times normally
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
        isFavorite
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
