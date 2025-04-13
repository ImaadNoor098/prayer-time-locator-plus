
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const currentTime = useCurrentTime();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          let errorMessage = "Unable to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
          }
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

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
        userLocation,
        locationError,
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
