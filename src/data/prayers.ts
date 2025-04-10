
import { PrayerTime } from '@/types';

export const prayerTimes: PrayerTime[] = [
  {
    id: 'fajr',
    name: 'Fajr',
    icon: '🌅',
    description: 'Dawn prayer before sunrise'
  },
  {
    id: 'dhuhr',
    name: 'Dhuhr',
    icon: '☀️',
    description: 'Midday prayer after noon'
  },
  {
    id: 'asr',
    name: 'Asr',
    icon: '🌤️',
    description: 'Afternoon prayer'
  },
  {
    id: 'maghrib',
    name: 'Maghrib',
    icon: '🌇',
    description: 'Sunset prayer'
  },
  {
    id: 'isha',
    name: 'Isha',
    icon: '🌙',
    description: 'Night prayer'
  },
  {
    id: 'jummah',
    name: 'Jummah',
    icon: '🕌',
    description: 'Friday congregational prayer'
  }
];
