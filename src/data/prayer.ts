/**
 * Prayer Times Data Structure by Year
 * Format: YYYY-MM-DD with prayer times in 24-hour format
 */

export interface DailyPrayerTimes {
  date: string; // YYYY-MM-DD format
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface YearlyPrayerTimes {
  year: number;
  location: string;
  timezone: string;
  data: DailyPrayerTimes[];
}

// Sample data for 2025 (you can edit these times as needed)
export const prayerTimesData: YearlyPrayerTimes[] = [
  {
    year: 2025,
    location: "Sambhal, Uttar Pradesh, India",
    timezone: "Asia/Kolkata",
    data: [
      // January 2025
      { date: "2025-01-01", fajr: "05:43", sunrise: "07:01", dhuhr: "12:09", asr: "14:50", maghrib: "17:16", isha: "18:30" },
      { date: "2025-01-02", fajr: "05:43", sunrise: "07:01", dhuhr: "12:10", asr: "14:51", maghrib: "17:17", isha: "18:31" },
      { date: "2025-01-03", fajr: "05:44", sunrise: "07:01", dhuhr: "12:10", asr: "14:51", maghrib: "17:17", isha: "18:31" },
      { date: "2025-01-04", fajr: "05:44", sunrise: "07:01", dhuhr: "12:11", asr: "14:52", maghrib: "17:18", isha: "18:32" },
      { date: "2025-01-05", fajr: "05:44", sunrise: "07:01", dhuhr: "12:11", asr: "14:52", maghrib: "17:19", isha: "18:33" },
      
      // February 2025
      { date: "2025-02-01", fajr: "05:37", sunrise: "06:52", dhuhr: "12:16", asr: "15:09", maghrib: "17:40", isha: "18:51" },
      { date: "2025-02-02", fajr: "05:36", sunrise: "06:51", dhuhr: "12:16", asr: "15:10", maghrib: "17:41", isha: "18:52" },
      { date: "2025-02-03", fajr: "05:36", sunrise: "06:51", dhuhr: "12:17", asr: "15:10", maghrib: "17:42", isha: "18:53" },
      
      // March 2025
      { date: "2025-03-01", fajr: "05:13", sunrise: "06:28", dhuhr: "12:12", asr: "15:23", maghrib: "17:57", isha: "19:08" },
      { date: "2025-03-02", fajr: "05:12", sunrise: "06:27", dhuhr: "12:12", asr: "15:24", maghrib: "17:58", isha: "19:09" },
      
      // Add more dates as needed...
    ]
  },
  {
    year: 2024,
    location: "Sambhal, Uttar Pradesh, India",
    timezone: "Asia/Kolkata",
    data: [
      // Sample data for 2024
      { date: "2024-12-31", fajr: "05:41", sunrise: "06:59", dhuhr: "12:05", asr: "14:44", maghrib: "17:08", isha: "18:23" },
      // Add more dates for 2024...
    ]
  }
];

/**
 * Get prayer times for a specific date
 */
export const getPrayerTimesForDate = (date: string): DailyPrayerTimes | null => {
  const year = new Date(date).getFullYear();
  const yearData = prayerTimesData.find(y => y.year === year);
  
  if (!yearData) return null;
  
  return yearData.data.find(d => d.date === date) || null;
};

/**
 * Get available years
 */
export const getAvailableYears = (): number[] => {
  return prayerTimesData.map(y => y.year).sort((a, b) => b - a);
};

/**
 * Get available dates for a specific year
 */
export const getAvailableDatesForYear = (year: number): string[] => {
  const yearData = prayerTimesData.find(y => y.year === year);
  return yearData ? yearData.data.map(d => d.date).sort() : [];
};

/**
 * Get location info for a year
 */
export const getLocationForYear = (year: number): { location: string; timezone: string } | null => {
  const yearData = prayerTimesData.find(y => y.year === year);
  return yearData ? { location: yearData.location, timezone: yearData.timezone } : null;
};