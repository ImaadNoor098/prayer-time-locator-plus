
import { Mosque } from '@/types';

// Mock mosque data
export const mosques: Mosque[] = [
  {
    id: 'm1',
    name: 'Masjid Al-Noor',
    address: '123 Islamic Way, Muslim District',
    distance: 1.2,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '13:15',
      asr: '16:45',
      maghrib: '19:30',
      isha: '21:00',
      jummah: '13:30'
    }
  },
  {
    id: 'm2',
    name: 'Islamic Center of Peace',
    address: '456 Faith Street, Harmony Heights',
    distance: 2.5,
    coordinates: {
      latitude: 37.7831,
      longitude: -122.4039
    },
    prayerTimes: {
      fajr: '05:15',
      dhuhr: '13:00',
      asr: '16:30',
      maghrib: '19:45',
      isha: '21:15',
      jummah: '13:15'
    }
  },
  {
    id: 'm3',
    name: 'Masjid Al-Rahman',
    address: '789 Mercy Road, Blessing Hills',
    distance: 0.8,
    coordinates: {
      latitude: 37.7694,
      longitude: -122.4862
    },
    prayerTimes: {
      fajr: '05:45',
      dhuhr: '13:30',
      asr: '17:00',
      maghrib: '19:15',
      isha: '20:45',
      jummah: '13:45'
    }
  },
  {
    id: 'm4',
    name: 'Tawhid Mosque',
    address: '101 Unity Plaza, Faith Valley',
    distance: 3.7,
    coordinates: {
      latitude: 37.8044,
      longitude: -122.2711
    },
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '12:45',
      asr: '16:15',
      maghrib: '19:00',
      isha: '20:30',
      jummah: '13:00'
    }
  },
  {
    id: 'm5',
    name: 'Masjid Al-Taqwa',
    address: '202 Piety Lane, Devotion Square',
    distance: 1.9,
    coordinates: {
      latitude: 37.7857,
      longitude: -122.4057
    },
    prayerTimes: {
      fajr: '05:20',
      dhuhr: '13:10',
      asr: '16:40',
      maghrib: '19:20',
      isha: '20:50',
      jummah: '13:20'
    }
  }
];
