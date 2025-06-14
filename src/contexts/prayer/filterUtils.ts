
import { Mosque, FilterOption } from '@/types';
import { isPrayerActive, isPrayerPassed } from './timeUtils';

// Helper function to get Eid prayer status
const getEidPrayerStatus = (prayer: string, time: string, currentTime: Date) => {
  if (prayer === 'eidUlAdha') {
    // Eid ul-Adha is on 7th June 2025
    const eidDate = new Date('2025-06-07');
    const currentDate = new Date(currentTime);
    
    // If current date is before Eid date, don't mark as done
    if (currentDate < eidDate) {
      return { isPassed: false, isCurrentPrayer: false };
    }
    
    // If it's Eid date, use normal logic for prayer times
    if (currentDate.toDateString() === eidDate.toDateString()) {
      const [hours, minutes] = time.split(':').map(Number);
      const prayerDateTime = new Date(eidDate);
      prayerDateTime.setHours(hours, minutes, 0);
      
      const isActive = currentDate >= prayerDateTime && currentDate <= new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
      const hasPassed = currentDate > new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
      
      return { isPassed: hasPassed, isCurrentPrayer: isActive };
    }
    
    // If after Eid date, mark as passed
    return { isPassed: true, isCurrentPrayer: false };
  }
  
  if (prayer === 'eidUlFitr') {
    // Eid ul-Fitr salah for 2025 was done on 1st April 2025, so always mark as done
    return { isPassed: true, isCurrentPrayer: false };
  }
  
  // For regular prayers, use the standard time utils
  return { 
    isPassed: isPrayerPassed(time, currentTime), 
    isCurrentPrayer: isPrayerActive(time, currentTime) 
  };
};

export const getFilteredMosques = (
  mosques: Mosque[],
  selectedPrayerName: string | null,
  searchQuery: string,
  showFavorites: boolean,
  favorites: string[],
  currentFilter: FilterOption,
  currentTime: Date
): Mosque[] => {
  if (!selectedPrayerName) return [];
  
  // Map prayer names to their corresponding keys in mosque data
  const getPrayerKey = (prayerName: string): string => {
    const prayerKeyMap: Record<string, string> = {
      'Fajr': 'fajr',
      'Dhuhr': 'dhuhr', 
      'Asr': 'asr',
      'Maghrib': 'maghrib',
      'Isha': 'isha',
      'Jummah': 'jummah',
      'Eid ul-Adha': 'eidUlAdha',
      'Eid ul-Fitr': 'eidUlFitr'
    };
    
    return prayerKeyMap[prayerName] || prayerName.toLowerCase();
  };
  
  const prayerKey = getPrayerKey(selectedPrayerName);
  
  let filtered = mosques.filter(mosque => 
    mosque.prayerTimes[prayerKey] !== undefined
  );
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(mosque => 
      mosque.name.toLowerCase().includes(query) || 
      mosque.address.toLowerCase().includes(query)
    );
  }
  
  if (showFavorites) {
    filtered = filtered.filter(mosque => favorites.includes(mosque.id));
  }

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  switch (currentFilter) {
    case 'earliest':
      return [...filtered].sort((a, b) => {
        const timeA = a.prayerTimes[prayerKey];
        const timeB = b.prayerTimes[prayerKey];
        
        // For Eid prayers, use special status logic
        if (prayerKey === 'eidUlAdha' || prayerKey === 'eidUlFitr') {
          const statusA = getEidPrayerStatus(prayerKey, timeA, currentTime);
          const statusB = getEidPrayerStatus(prayerKey, timeB, currentTime);
          
          // Active prayers come first
          if (statusA.isCurrentPrayer && !statusB.isCurrentPrayer) return -1;
          if (!statusA.isCurrentPrayer && statusB.isCurrentPrayer) return 1;
          
          // Then upcoming prayers (not passed)
          if (!statusA.isPassed && statusB.isPassed) return -1;
          if (statusA.isPassed && !statusB.isPassed) return 1;
          
          // For prayers in the same status, sort by time
          return timeToMinutes(timeA) - timeToMinutes(timeB);
        }
        
        // For regular prayers, use existing logic
        const aActive = isPrayerActive(timeA, currentTime);
        const bActive = isPrayerActive(timeB, currentTime);
        const aPassed = isPrayerPassed(timeA, currentTime);
        const bPassed = isPrayerPassed(timeB, currentTime);
        
        // Active prayers come first
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        
        // Then upcoming prayers
        if (!aPassed && bPassed) return -1;
        if (aPassed && !bPassed) return 1;
        
        // For either both active, passed or upcoming, sort by time
        return timeToMinutes(timeA) - timeToMinutes(timeB);
      });
      
    case 'latest':
      return [...filtered].sort((a, b) => {
        const timeA = a.prayerTimes[prayerKey];
        const timeB = b.prayerTimes[prayerKey];
        
        // For Eid prayers, use special status logic but reverse order for latest
        if (prayerKey === 'eidUlAdha' || prayerKey === 'eidUlFitr') {
          const statusA = getEidPrayerStatus(prayerKey, timeA, currentTime);
          const statusB = getEidPrayerStatus(prayerKey, timeB, currentTime);
          
          // Active prayers come first
          if (statusA.isCurrentPrayer && !statusB.isCurrentPrayer) return -1;
          if (!statusA.isCurrentPrayer && statusB.isCurrentPrayer) return 1;
          
          // Then upcoming prayers (not passed)
          if (!statusA.isPassed && statusB.isPassed) return -1;
          if (statusA.isPassed && !statusB.isPassed) return 1;
          
          // For prayers in the same status, sort by time in descending order
          return timeToMinutes(timeB) - timeToMinutes(timeA);
        }
        
        // For regular prayers
        const aActive = isPrayerActive(timeA, currentTime);
        const bActive = isPrayerActive(timeB, currentTime);
        const aPassed = isPrayerPassed(timeA, currentTime);
        const bPassed = isPrayerPassed(timeB, currentTime);
        
        // Active prayers come first
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        
        // Then upcoming prayers
        if (!aPassed && bPassed) return -1;
        if (aPassed && !bPassed) return 1;
        
        // For either both active, passed or upcoming, sort by time in descending order
        return timeToMinutes(timeB) - timeToMinutes(timeA);
      });
      
    case 'nearest':
      return [...filtered].sort((a, b) => a.distance - b.distance);
      
    case 'farthest':
      return [...filtered].sort((a, b) => b.distance - a.distance);
      
    case 'alphabetical':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      
    case 'alphabetical-desc':
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      
    default:
      // Default to earliest (ascending time order)
      return [...filtered].sort((a, b) => {
        const timeA = a.prayerTimes[prayerKey];
        const timeB = b.prayerTimes[prayerKey];
        return timeToMinutes(timeA) - timeToMinutes(timeB);
      });
  }
};
