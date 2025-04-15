
import { SalahTime } from '@/types';
import { getJanuaryTimes, getFebruaryTimes, getMarchTimes } from './data/q1-jan-to-mar';
import { getAprilTimes, getMayTimes, getJuneTimes } from './data/q2-apr-to-jun';
import { getJulyTimes, getAugustTimes, getSeptemberTimes } from './data/q3-jul-to-sep';
import { getOctoberTimes, getNovemberTimes, getDecemberTimes } from './data/q4-oct-to-dec';
import { createSalahTime } from './utils';

/**
 * Main function to get prayer times for a specific date
 */
export const getPrayerTimesForDate = (dateObj: Date): SalahTime => {
  const month = dateObj.getMonth();
  
  switch (month) {
    case 0: // January
      return getJanuaryTimes(dateObj);
    case 1: // February
      return getFebruaryTimes(dateObj);
    case 2: // March
      return getMarchTimes(dateObj);
    case 3: // April
      return getAprilTimes(dateObj);
    case 4: // May
      return getMayTimes(dateObj);
    case 5: // June
      return getJuneTimes(dateObj);
    case 6: // July
      return getJulyTimes(dateObj);
    case 7: // August
      return getAugustTimes(dateObj);
    case 8: // September
      return getSeptemberTimes(dateObj);
    case 9: // October
      return getOctoberTimes(dateObj);
    case 10: // November
      return getNovemberTimes(dateObj);
    case 11: // December
      return getDecemberTimes(dateObj);
    default:
      // Default fallback
      return createSalahTime(
        dateObj,
        "05:15", "06:35", "12:08", "15:05", "17:40", "19:00"
      );
  }
};
