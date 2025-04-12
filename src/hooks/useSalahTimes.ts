
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SalahTime } from '@/types';

export const useSalahTimes = (selectedDate: Date) => {
  const [salahTimes, setSalahTimes] = useState<SalahTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch prayer times when date changes
  useEffect(() => {
    const fetchSalahTimes = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would be an API call to Muslims Pro
        // For now, we'll simulate with realistic prayer times based on date for Bareilly
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate times based on the date for Bareilly (simplified for demo)
        const dateObj = new Date(formattedDate);
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        
        // Bareilly prayer times (approximate)
        // Adjusted times slightly based on date to simulate real changes
        const minuteAdjustment = ((month * 30) + day) % 10;
        
        // Bareilly prayer times (approximate for Hanafi School)
        const baseHours = {
          fajr: 4,
          sunrise: 5, 
          dhuhr: 12,
          asr: 15,
          maghrib: 18,
          isha: 19
        };
        
        const times: SalahTime = {
          fajr: `0${baseHours.fajr}:${45 + minuteAdjustment}`,
          sunrise: `0${baseHours.sunrise}:${30 + minuteAdjustment}`,
          dhuhr: `${baseHours.dhuhr}:${15 + minuteAdjustment}`,
          asr: `${baseHours.asr}:${30 - minuteAdjustment}`,
          maghrib: `${baseHours.maghrib}:${20 - minuteAdjustment}`,
          isha: `${baseHours.isha}:4${0 + minuteAdjustment}`,
          date: selectedDate
        };
        
        setSalahTimes(times);
      } catch (error) {
        console.error('Error fetching salah times:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalahTimes();
  }, [selectedDate]);

  const formatTimeToAmPm = (time: string): string => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return time;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const isPrayerTime = (prayerTime: string): boolean => {
    if (!prayerTime) return false;
    
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const now = currentTime;
    const today = new Date(now);
    const selectedDay = selectedDate;
    
    // If not today, it's not current prayer time
    if (today.getDate() !== selectedDay.getDate() || 
        today.getMonth() !== selectedDay.getMonth() || 
        today.getFullYear() !== selectedDay.getFullYear()) {
      return false;
    }
    
    const prayerDateTime = new Date(today);
    prayerDateTime.setHours(hours, minutes, 0);
    
    const fiveMinutesAfter = new Date(prayerDateTime);
    fiveMinutesAfter.setMinutes(fiveMinutesAfter.getMinutes() + 5);
    
    return now >= prayerDateTime && now <= fiveMinutesAfter;
  };

  const isPrayerPassed = (prayerTime: string): boolean => {
    if (!prayerTime) return false;
    
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const now = currentTime;
    const today = new Date(now);
    const selectedDay = selectedDate;
    
    // If selected date is in the future, no prayers have passed
    if (selectedDay > today) return false;
    
    // If selected date is in the past, all prayers have passed
    if (selectedDay < today && 
        (selectedDay.getDate() !== today.getDate() || 
         selectedDay.getMonth() !== today.getMonth() || 
         selectedDay.getFullYear() !== today.getFullYear())) {
      return true;
    }
    
    const prayerDateTime = new Date(today);
    prayerDateTime.setHours(hours, minutes, 0);
    
    const fiveMinutesAfter = new Date(prayerDateTime);
    fiveMinutesAfter.setMinutes(fiveMinutesAfter.getMinutes() + 5);
    
    return now > fiveMinutesAfter;
  };

  return {
    salahTimes,
    loading,
    currentTime,
    formatTimeToAmPm,
    isPrayerTime,
    isPrayerPassed
  };
};

export default useSalahTimes;
