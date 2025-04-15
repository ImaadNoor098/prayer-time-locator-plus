
import { SalahTime } from '@/types';
import { createSalahTime } from '../utils';

/**
 * Prayer times for October (month 9)
 */
export const getOctoberTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:53", "06:11", "11:53", "15:00", "17:35", "18:49"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:58", "06:16", "11:50", "14:53", "17:24", "18:38"
    );
  } else {
    return createSalahTime(
      dateObj,
      "05:03", "06:21", "11:49", "14:47", "17:15", "18:29"
    );
  }
};

/**
 * Prayer times for November (month 10)
 */
export const getNovemberTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "05:09", "06:28", "11:48", "14:42", "17:07", "18:22"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "05:16", "06:35", "11:49", "14:38", "17:02", "18:17"
    );
  } else {
    return createSalahTime(
      dateObj,
      "05:23", "06:42", "11:51", "14:37", "16:59", "18:15"
    );
  }
};

/**
 * Prayer times for December (month 11)
 */
export const getDecemberTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "05:30", "06:49", "11:55", "14:37", "16:59", "18:15"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "05:36", "06:55", "12:00", "14:40", "17:03", "18:18"
    );
  } else {
    return createSalahTime(
      dateObj,
      "05:41", "06:59", "12:05", "14:44", "17:08", "18:23"
    );
  }
};
