
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
        // For now, we'll simulate with realistic prayer times from Muslim Pro for Bareilly
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate times based on the date for Bareilly
        const dateObj = new Date(formattedDate);
        const month = dateObj.getMonth();
        
        // Actual Bareilly prayer times from Muslim Pro
        // These are approximations and would vary slightly by date
        let times: SalahTime;
        
        // Different times based on month to simulate seasonal changes
        if (month >= 3 && month <= 8) {
          // Summer schedule (April to September)
          times = {
            fajr: "04:19",
            sunrise: "05:47",
            dhuhr: "12:13",
            asr: "15:39",
            maghrib: "18:39",
            isha: "20:02",
            date: selectedDate
          };
        } else {
          // Winter schedule (October to March)
          times = {
            fajr: "05:13",
            sunrise: "06:36",
            dhuhr: "12:08",
            asr: "15:03",
            maghrib: "17:40",
            isha: "19:03",
            date: selectedDate
          };
        }
        
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
    
    // Get the prayer time and the next prayer time
    const prayerDateTime = new Date(today);
    prayerDateTime.setHours(hours, minutes, 0);
    
    // Get next prayer time
    let nextPrayerTime = null;
    if (salahTimes) {
      const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const currentPrayerIndex = prayers.findIndex(p => 
        salahTimes[p as keyof SalahTime] === prayerTime
      );
      
      if (currentPrayerIndex < prayers.length - 1) {
        const nextPrayer = prayers[currentPrayerIndex + 1];
        const nextTimeStr = salahTimes[nextPrayer as keyof SalahTime] as string;
        const [nextHours, nextMinutes] = nextTimeStr.split(':').map(Number);
        
        nextPrayerTime = new Date(today);
        nextPrayerTime.setHours(nextHours, nextMinutes, 0);
      } else {
        // If it's the last prayer, set next to end of day
        nextPrayerTime = new Date(today);
        nextPrayerTime.setHours(23, 59, 59);
      }
    }
    
    // Current prayer time is active from its start until the next prayer time
    return now >= prayerDateTime && (!nextPrayerTime || now < nextPrayerTime);
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
    
    // Prayer has passed if current time is past the prayer time
    // AND it's not the current active prayer
    return now > prayerDateTime && !isPrayerTime(prayerTime);
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
