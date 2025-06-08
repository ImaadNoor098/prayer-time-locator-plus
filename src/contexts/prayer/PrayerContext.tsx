
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';
import { prayerTimes } from '@/data/prayers';
import { mosques } from '@/data/mosques';
import { PrayerContextType } from './types';
import { formatTimeToAmPm, isPrayerActive, isPrayerPassed } from './timeUtils';
import { getFilteredMosques } from './filterUtils';
import { useFavorites } from './useFavorites';
import { useCurrentTime } from './useCurrentTime';
import { useLocationService } from './useLocationService';
import { useNotifications } from './useNotifications';
import { usePageScrollTracking } from './usePageScrollTracking';
import { useUnfavoriteDialog } from './useUnfavoriteDialog';

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayers] = useState<PrayerTime[]>(prayerTimes);
  const [mosqueList] = useState<Mosque[]>(mosques);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerTime | null>(() => {
    // Try to load selected prayer from localStorage
    const savedPrayer = localStorage.getItem('selected-prayer');
    if (savedPrayer) {
      try {
        const parsed = JSON.parse(savedPrayer);
        const foundPrayer = prayers.find(p => p.id === parsed.id);
        return foundPrayer || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  // Set default filter to 'earliest' for prayer-based filtering
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('earliest');
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', showFavorites: false });
  
  const currentTime = useCurrentTime();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { userLocation, locationError } = useLocationService();
  const { saveScrollPosition, getSavedScrollPosition, trackPageVisit } = usePageScrollTracking();
  const { unfavoriteDialogState, showUnfavoriteConfirmation, hideUnfavoriteConfirmation } = useUnfavoriteDialog();
  
  // Save selected prayer to localStorage
  useEffect(() => {
    if (selectedPrayer) {
      localStorage.setItem('selected-prayer', JSON.stringify(selectedPrayer));
    } else {
      localStorage.removeItem('selected-prayer');
    }
  }, [selectedPrayer]);
  
  // Initialize notifications (this doesn't return anything, just sets up the effect)
  useNotifications(prayers, mosqueList, favorites, isFavorite, currentTime);

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const setSelectedPrayerWrapper = (prayer: PrayerTime | null) => {
    setSelectedPrayer(prayer);
    if (!prayer) {
      localStorage.removeItem('selected-prayer');
    }
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
        userLocation,
        locationError,
        setSelectedPrayer: setSelectedPrayerWrapper,
        setCurrentFilter,
        setSearchParams: updateSearchParams,
        getFilteredMosques: getFilteredMosquesList,
        isPrayerPassed: isPrayerPassedWrapper,
        isPrayerActive: isPrayerActiveWrapper,
        toggleFavorite,
        isFavorite,
        formatTimeToAmPm,
        saveScrollPosition,
        getSavedScrollPosition,
        trackPageVisit,
        showUnfavoriteConfirmation,
        hideUnfavoriteConfirmation,
        unfavoriteDialogState
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
