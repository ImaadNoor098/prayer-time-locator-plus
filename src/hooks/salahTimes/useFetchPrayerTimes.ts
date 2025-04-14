
import { useState, useEffect } from 'react';
import { SalahTime } from '@/types';
import { getPrayerTimesForDate } from './prayerTimesData';

export const useFetchPrayerTimes = (selectedDate: Date) => {
  const [salahTimes, setSalahTimes] = useState<SalahTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSalahTimes = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get prayer times for the selected date
        const times = getPrayerTimesForDate(selectedDate);
        setSalahTimes(times);
      } catch (error) {
        console.error('Error fetching salah times:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalahTimes();
  }, [selectedDate]);

  return { salahTimes, loading };
};
