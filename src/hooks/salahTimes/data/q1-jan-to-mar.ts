
import { SalahTime } from '@/types';
import { createSalahTime } from '../utils';

/**
 * Prayer times for January (month 0)
 */
export const getJanuaryTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "05:43", "07:01", "12:09", "14:50", "17:16", "18:30"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "05:44", "07:00", "12:13", "14:56", "17:24", "18:37"
    );
  } else {
    return createSalahTime(
      dateObj,
      "05:42", "06:58", "12:15", "15:03", "17:32", "18:44"
    );
  }
};

/**
 * Prayer times for February (month 1)
 */
export const getFebruaryTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "05:37", "06:52", "12:16", "15:09", "17:40", "18:51"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "05:31", "06:45", "12:16", "15:15", "17:47", "18:57"
    );
  } else {
    return createSalahTime(
      dateObj,
      "05:22", "06:37", "12:14", "15:19", "17:53", "19:03"
    );
  }
};

/**
 * Prayer times for March (month 2)
 */
export const getMarchTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "05:13", "06:28", "12:12", "15:23", "17:57", "19:08"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "05:03", "06:18", "12:10", "15:26", "18:02", "19:13"
    );
  } else {
    return createSalahTime(
      dateObj,
      "04:52", "06:08", "12:07", "15:30", "18:07", "19:18"
    );
  }
};
