
import { Mosque } from '@/types';

// Mock mosque data
export const mosques: Mosque[] = [
  {
    id: 'm1',
    name: 'Masjid Pul Qazi',
    address: 'Sahukara, Bara Bazar, Bareilly',
    distance: Loading,
    // Coordinates used for distance calculation
    coordinates: {
      latitude: 28.366167,
      longitude: 79.407535
    },
    // Added direct Google Maps link
    googleMapsLink: 'https://maps.app.goo.gl/S6KCoKG7Jz4KFa7NA?g_st=aw',
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '14:15',
      asr: '18:00',
      maghrib: '19:30',
      isha: '21:15',
      jummah: '01:00'
    },
    images: [
      '/mosques/mosque1.png',  // These can be local images
      '/mosques/mosque1-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Madarsa', 'Ablution Area', 'Women\'s Section', 'Parking']
  },
  {
    id: 'm2',
    name: 'Islamic Center of Peace',
    address: '456 Faith Street, Harmony Heights',
    distance: 2.5,
    coordinates: {
      latitude: 28.376,
      longitude: 79.432
    },
    googleMapsLink: 'https://www.google.com/maps?q=28.376,79.432',
    prayerTimes: {
      fajr: '05:15',
      dhuhr: '13:00',
      asr: '16:30',
      maghrib: '19:45',
      isha: '21:15',
      jummah: '13:15'
    },
    images: [
      '/mosques/mosque2.jpg',
      '/mosques/mosque2-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Library', 'Conference Room', 'Educational Classes']
  },
  {
    id: 'm3',
    name: 'Masjid Al-Rahman',
    address: '789 Mercy Road, Blessing Hills',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://www.google.com/maps?q=28.368,79.427',
    prayerTimes: {
      fajr: '05:45',
      dhuhr: '13:30',
      asr: '17:00',
      maghrib: '19:15',
      isha: '20:45',
      jummah: '13:45'
    },
    images: [
      '/mosques/mosque3.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm4',
    name: 'Tawhid Mosque',
    address: '101 Unity Plaza, Faith Valley',
    distance: 3.7,
    coordinates: {
      latitude: 28.395,
      longitude: 79.445
    },
    googleMapsLink: 'https://www.google.com/maps?q=28.395,79.445',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '12:45',
      asr: '16:15',
      maghrib: '19:00',
      isha: '20:30',
      jummah: '13:00'
    },
    images: [
      '/mosques/mosque4.jpg',
      '/mosques/mosque4-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Islamic Shop', 'Funeral Services', 'Marriage Services']
  },
  {
    id: 'm5',
    name: 'Masjid Al-Taqwa',
    address: '202 Piety Lane, Devotion Square',
    distance: 1.9,
    coordinates: {
      latitude: 28.374,
      longitude: 79.422
    },
    googleMapsLink: 'https://www.google.com/maps?q=28.374,79.422',
    prayerTimes: {
      fajr: '05:20',
      dhuhr: '13:10',
      asr: '16:40',
      maghrib: '19:20',
      isha: '20:50',
      jummah: '13:20'
    },
    images: [
      '/mosques/mosque5.jpg',
      '/mosques/mosque5-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Food Bank', 'Madrasah', 'Multilingual Sermons']
  }
];
