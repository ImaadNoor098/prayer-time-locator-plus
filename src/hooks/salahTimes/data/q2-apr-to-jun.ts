
import { SalahTime } from '@/types';
import { createSalahTime } from '../utils';

/**
 * Prayer times for April (month 3)
 */
export const getAprilTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:41", "05:57", "12:09", "15:36", "18:22", "19:38"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:31", "05:49", "12:07", "15:36", "18:26", "19:43"
    );
  } else {
    return createSalahTime(
      dateObj,
      "04:21", "05:41", "12:05", "15:35", "18:30", "19:49"
    );
  }
};

/**
 * Prayer times for May (month 4)
 */
export const getMayTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "04:12", "05:34", "12:04", "15:35", "18:34", "19:56"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "04:05", "05:29", "12:04", "15:36", "18:39", "20:02"
    );
  } else {
    return createSalahTime(
      dateObj,
      "03:58", "05:25", "12:04", "15:37", "18:44", "20:08"
    );
  }
};

/**
 * Prayer times for June (month 5)
 */
export const getJuneTimes = (dateObj: Date): SalahTime => {
  const day = dateObj.getDate();
  
  if (day <= 10) {
    return createSalahTime(
      dateObj,
      "03:55", "05:23", "12:06", "15:38", "18:49", "20:13"
    );
  } else if (day <= 20) {
    return createSalahTime(
      dateObj,
      "03:54", "05:23", "12:08", "15:41", "18:52", "20:17"
    );
  } else {
    return createSalahTime(
      dateObj,
      "03:57", "05:25", "12:10", "15:43", "18:54", "20:18"
    );
  }
};
