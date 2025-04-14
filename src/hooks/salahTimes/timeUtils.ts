
import { format, isToday, isSameDay, parse } from 'date-fns';

// Format time from 24-hour to 12-hour format
export const formatTimeToAmPm = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Check if a prayer time is currently active
export const isPrayerTime = (
  prayerTime: string, 
  currentTime: Date, 
  selectedDate: Date,
  nextPrayerTime: string | null,
  salahTimes: any
): boolean => {
  if (!prayerTime) return false;
  
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  // If not same day, it's not current prayer time
  if (!isSameDay(currentTime, selectedDate)) {
    return false;
  }
  
  // Get the prayer time
  const prayerDateTime = new Date(currentTime);
  prayerDateTime.setHours(hours, minutes, 0);
  
  // Get next prayer time
  let nextPrayerDateTime = null;
  if (nextPrayerTime) {
    const [nextHours, nextMinutes] = nextPrayerTime.split(':').map(Number);
    nextPrayerDateTime = new Date(currentTime);
    nextPrayerDateTime.setHours(nextHours, nextMinutes, 0);
  } else if (salahTimes) {
    // If next prayer time not provided, find it from salahTimes
    const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const currentPrayerIndex = prayers.findIndex(p => 
      salahTimes[p] === prayerTime
    );
    
    if (currentPrayerIndex < prayers.length - 1) {
      const nextPrayer = prayers[currentPrayerIndex + 1];
      const nextTimeStr = salahTimes[nextPrayer];
      if (nextTimeStr) {
        const [nextHours, nextMinutes] = nextTimeStr.split(':').map(Number);
        
        nextPrayerDateTime = new Date(currentTime);
        nextPrayerDateTime.setHours(nextHours, nextMinutes, 0);
      }
    } else {
      // If it's the last prayer, set next to end of day
      nextPrayerDateTime = new Date(currentTime);
      nextPrayerDateTime.setHours(23, 59, 59);
    }
  }
  
  // Current prayer time is active from its start until the next prayer time
  return currentTime >= prayerDateTime && (!nextPrayerDateTime || currentTime < nextPrayerDateTime);
};

// Check if a prayer time has passed
export const isPrayerPassed = (
  prayerTime: string, 
  currentTime: Date, 
  selectedDate: Date,
  isPrayerTimeActive: boolean
): boolean => {
  if (!prayerTime) return false;
  
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  // If selected date is in the future, no prayers have passed
  if (selectedDate > currentTime) return false;
  
  // If selected date is in the past, all prayers have passed
  if (selectedDate < currentTime && !isSameDay(selectedDate, currentTime)) {
    return true;
  }
  
  const prayerDateTime = new Date(currentTime);
  prayerDateTime.setHours(hours, minutes, 0);
  
  // Prayer has passed if current time is past the prayer time
  // AND it's not the current active prayer
  return currentTime > prayerDateTime && !isPrayerTimeActive;
};
