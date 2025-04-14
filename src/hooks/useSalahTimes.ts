
import { useCurrentTime } from './salahTimes/useCurrentTime';
import { useFetchPrayerTimes } from './salahTimes/useFetchPrayerTimes';
import { formatTimeToAmPm, isPrayerTime, isPrayerPassed } from './salahTimes/timeUtils';
import { SalahTime } from '@/types';

export const useSalahTimes = (selectedDate: Date) => {
  const currentTime = useCurrentTime();
  const { salahTimes, loading } = useFetchPrayerTimes(selectedDate);

  // Check if a prayer is currently active
  const isPrayerTimeWrapper = (prayerTime: string): boolean => {
    if (!salahTimes) return false;
    
    return isPrayerTime(
      prayerTime, 
      currentTime, 
      selectedDate, 
      null, 
      salahTimes
    );
  };

  // Check if a prayer has passed
  const isPrayerPassedWrapper = (prayerTime: string): boolean => {
    if (!salahTimes) return false;
    
    return isPrayerPassed(
      prayerTime, 
      currentTime, 
      selectedDate, 
      isPrayerTimeWrapper(prayerTime)
    );
  };

  return {
    salahTimes,
    loading,
    currentTime,
    formatTimeToAmPm,
    isPrayerTime: isPrayerTimeWrapper,
    isPrayerPassed: isPrayerPassedWrapper
  };
};

export default useSalahTimes;
