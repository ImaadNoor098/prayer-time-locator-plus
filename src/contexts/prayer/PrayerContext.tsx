
import React, { createContext, useContext, useState } from 'react';
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';
import { prayerTimes } from '@/data/prayers';
import { mosques } from '@/data/mosques';
import { PrayerContextType } from './types';
import { formatTimeToAmPm, isPrayerActive, isPrayerPassed } from './timeUtils';
import { getFilteredMosques } from './filterUtils';
import { useFavorites } from './useFavorites';
import { useCurrentTime } from './useCurrentTime';

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayers] = useState<PrayerTime[]>(prayerTimes);
  const [mosqueList] = useState<Mosque[]>(mosques);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerTime | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('earliest');
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', showFavorites: false });
  
  const currentTime = useCurrentTime();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const getFilteredMosquesList = (): Mosque[] => {
    if (!selectedPrayer) return [];
    
    return getFilteredMosques(
      mosqueList,
      selectedPrayer.name,
      searchParams.query,
      searchParams.showFavorites,
      favorites,
      currentFilter,
      currentTime
    );
  };

  const isPrayerActiveWrapper = (time: string): boolean => {
    return isPrayerActive(time, currentTime);
  };

  const isPrayerPassedWrapper = (time: string): boolean => {
    return isPrayerPassed(time, currentTime);
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
        getFilteredMosques: getFilteredMosquesList,
        isPrayerPassed: isPrayerPassedWrapper,
        isPrayerActive: isPrayerActiveWrapper,
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
