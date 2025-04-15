
import { SalahTime } from '@/types';
import { createSalahTime } from '../utils';

/**
 * Prayer times for July (month 6)
 */
export const getJulyTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:01", "05:29", "12:12", "15:44", "18:54", "20:17"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:07", "05:34", "12:13", "15:44", "18:51", "20:13"
    );
  } else {
    return createSalahTime(
      dateObj,
      "04:13", "05:39", "12:13", "15:42", "18:47", "20:08"
    );
  }
};

/**
 * Prayer times for August (month 7)
 */
export const getAugustTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:20", "05:44", "12:12", "15:39", "18:40", "20:00"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:27", "05:49", "12:10", "15:35", "18:31", "19:50"
    );
  } else {
    return createSalahTime(
      dateObj,
      "04:33", "05:54", "12:08", "15:30", "18:21", "19:38"
    );
  }
};

/**
 * Prayer times for September (month 8)
 */
export const getSeptemberTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:39", "05:59", "12:04", "15:23", "18:10", "19:26"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:44", "06:03", "12:00", "15:16", "17:58", "19:13"
    );
  } else {
    return createSalahTime(
      dateObj,
      "04:49", "06:07", "11:57", "15:08", "17:46", "19:00"
    );
  }
};
