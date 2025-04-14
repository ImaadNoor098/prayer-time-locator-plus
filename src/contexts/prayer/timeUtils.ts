
import { format, addMinutes, parse, differenceInMinutes } from 'date-fns';

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
  // For sunrise, make it active for 5 minutes
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

// Get the minutes left until a prayer time
export const getMinutesUntilPrayer = (time: string, currentTime: Date): number => {
  if (!time) return 0;
  
  const [hours, minutes] = time.split(':').map(Number);
  const prayerDate = new Date(currentTime);
  prayerDate.setHours(hours, minutes, 0);
  
  // If prayer time is in the past, it's 0 minutes left
  if (prayerDate < currentTime) {
    return 0;
  }
  
  return differenceInMinutes(prayerDate, currentTime);
};

// Get the remaining active time for a prayer (in minutes)
export const getRemainingActiveTime = (time: string, currentTime: Date): number => {
  if (!time) return 0;
  
  const [hours, minutes] = time.split(':').map(Number);
  const prayerDate = new Date(currentTime);
  prayerDate.setHours(hours, minutes, 0);
  
  // Active period ends 5 minutes after prayer time
  const activePeriodEnd = addMinutes(prayerDate, 5);
  
  // If active period has ended, return 0
  if (activePeriodEnd < currentTime) {
    return 0;
  }
  
  // If prayer hasn't started yet, return 0
  if (prayerDate > currentTime) {
    return 0;
  }
  
  return differenceInMinutes(activePeriodEnd, currentTime);
};
