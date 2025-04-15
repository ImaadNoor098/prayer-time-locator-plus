
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PrayerTime, Mosque, FilterOption, SearchParams } from '@/types';
import { prayerTimes } from '@/data/prayers';
import { mosques } from '@/data/mosques';
import { PrayerContextType } from './types';
import { formatTimeToAmPm, isPrayerActive, isPrayerPassed } from './timeUtils';
import { getFilteredMosques } from './filterUtils';
import { useFavorites } from './useFavorites';
import { useCurrentTime } from './useCurrentTime';
import { NotificationService } from '@/services/NotificationService';

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayers] = useState<PrayerTime[]>(prayerTimes);
  const [mosqueList] = useState<Mosque[]>(mosques);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerTime | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('earliest');
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', showFavorites: false });
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pageScrollPositions, setPageScrollPositions] = useState<Record<string, number>>({});
  const [lastVisitedPages, setLastVisitedPages] = useState<string[]>([]);
  
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

  // Check for prayer times that need notifications (every minute)
  useEffect(() => {
    // Function to check if we need to send notifications
    const checkPrayerTimesForNotifications = () => {
      // Only check if we have favorite mosques
      if (favorites.length === 0) return;
      
      // Get all favorite mosques
      const favoriteMosques = mosqueList.filter(mosque => favorites.includes(mosque.id));
      
      // For each prayer type, check if it's active time
      prayers.forEach(prayer => {
        const prayerName = prayer.name.toLowerCase();
        
        // For each favorite mosque, check if prayer is active
        favoriteMosques.forEach(mosque => {
          const prayerTime = mosque.prayerTimes[prayerName];
          if (!prayerTime) return;
          
          const isActive = isPrayerActive(prayerTime, currentTime);
          
          // Should notify if: mosque is favorite, prayer is active, haven't notified yet
          if (isActive && isFavorite(mosque.id)) {
            if (NotificationService.shouldNotifyForPrayer(mosque.id, prayer.name, true, true)) {
              NotificationService.showPrayerTimeNotification(mosque, prayer);
            }
          }
        });
      });
    };
    
    // Check immediately on component mount
    checkPrayerTimesForNotifications();
    
    // Check every minute
    const interval = setInterval(checkPrayerTimesForNotifications, 60000);
    
    // Clear on unmount
    return () => clearInterval(interval);
  }, [currentTime, favorites, isFavorite, mosqueList, prayers]);

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

  // Save scroll position for a page
  const saveScrollPosition = (page: string, position: number) => {
    setPageScrollPositions(prev => ({
      ...prev,
      [page]: position
    }));
  };

  // Get saved scroll position for a page
  const getSavedScrollPosition = (page: string): number => {
    return pageScrollPositions[page] || 0;
  };

  // Track page visits for double-tap detection
  const trackPageVisit = (page: string) => {
    setLastVisitedPages(prev => {
      // If last visited page is the same as current, this is a double-tap
      if (prev.length > 0 && prev[prev.length - 1] === page) {
        // Clear scroll position for this page on double-tap
        setPageScrollPositions(positions => {
          const newPositions = { ...positions };
          delete newPositions[page];
          return newPositions;
        });
        // Return the array with the page removed (will be added back)
      }
      // Add current page to the end
      return [...prev, page].slice(-5); // Keep last 5 for memory efficiency
    });
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
        formatTimeToAmPm,
        saveScrollPosition,
        getSavedScrollPosition,
        trackPageVisit
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
