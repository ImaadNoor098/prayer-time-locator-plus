
import { format, addMinutes, parse } from 'date-fns';

// Format time from 24-hour to 12-hour format
export const formatTimeToAmPm = (time: string): string => {
  if (!time) return '';
  
  try {
    // Parse the time string to a date object
    const date = parse(time, 'HH:mm', new Date());
    // Format to 12-hour time with AM/PM
    return format(date, 'h:mm a');
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // Return original if parsing fails
  }
};

// Check if prayer is currently active (within 5 minutes of start time)
export const isPrayerActive = (time: string, currentTime: Date): boolean => {
  if (!time) return false;
  
  const [hours, minutes] = time.split(':').map(Number);
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0);
  
  // Prayer is active during the 5 minute period after it starts
  const activePeriodEnd = addMinutes(prayerDate, 5);
  
  return currentTime >= prayerDate && currentTime <= activePeriodEnd;
};

export const isPrayerPassed = (time: string, currentTime: Date): boolean => {
  if (!time) return false;
  
  const [hours, minutes] = time.split(':').map(Number);
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0);
  
  // Add 5 minutes grace period to the prayer time for the active status
  const activePeriodEnd = addMinutes(prayerDate, 5);
  
  // Prayer is considered passed only after the active period
  return activePeriodEnd < currentTime;
};
