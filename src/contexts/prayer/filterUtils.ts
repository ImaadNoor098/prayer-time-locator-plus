
import { Mosque, FilterOption } from '@/types';
import { isPrayerActive, isPrayerPassed } from './timeUtils';

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
  
  switch (currentFilter) {
    case 'earliest':
      return [...filtered].sort((a, b) => {
        const timeA = a.prayerTimes[prayerKey];
        const timeB = b.prayerTimes[prayerKey];
        
        // Separate active, upcoming and passed prayers
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
        return timeA.localeCompare(timeB);
      });
      
    case 'latest':
      return [...filtered].sort((a, b) => {
        const timeA = a.prayerTimes[prayerKey];
        const timeB = b.prayerTimes[prayerKey];
        return timeB.localeCompare(timeA);
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
      return filtered;
  }
};
