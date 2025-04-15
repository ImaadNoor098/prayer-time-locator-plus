
import { SalahTime } from '@/types';

/**
 * Creates a SalahTime object for a specific date
 */
export const createSalahTime = (
  dateObj: Date,
  fajr: string,
  sunrise: string,
  dhuhr: string,
  asr: string,
  maghrib: string,
  isha: string
): SalahTime => {
  return {
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha,
    date: dateObj
  };
};
