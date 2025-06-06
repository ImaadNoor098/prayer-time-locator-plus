
import { Mosque } from '@/types';

// Mock mosque data
export const mosques: Mosque[] = [
  {
    id: 'm1',
    name: 'Masjid Pul Qazi',
    address: 'Sahukara, Bara Bazar, Bareilly',
    distance: 0.5, // Changed from Loading to a numeric value
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
      jummah: '13:00', // Updated time format to make it consistent with other mosques
      eidUlAdha: '09:00',
      eidUlFitr: '07:00'
    },
    images: [
      '/mosques/pulqazidemo.jpg',  // These can be local images
    ],
    facilities: ['Prayer Hall', 'Madarsa', 'Ablution Area', 'Women\'s Section', 'Parking']
  },
  {
    id: 'm2',
    name: 'Masjid Anar Wali',
    address: 'Sahukara, Bara Bazar, Bareilly',
    distance: 2.5,
    coordinates: {
      latitude: 28.376,
      longitude: 79.432
    },
    googleMapsLink: 'https://maps.app.goo.gl/tr5Q7c4WMgkw5Mg17',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '14:00',
      asr: '17:45',
      maghrib: '19:11',
      isha: '21:00',
      jummah: '12:35',
      eidUlAdha: '05:45',
      eidUlFitr: '05:45'
    },
    images: [
      '/mosques/mosque2.jpg',
      '/mosques/mosque2-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Library', 'Conference Room', 'Educational Classes']
  },
  {
    id: 'm3',
    name: 'Raza Masjid',
    address: 'Raza Colony, Near Mini Bypass, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/1seSgh5moaMCpj8y7',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '13:15',
      asr: '17:45',
      maghrib: '19:11',
      isha: '21:15',
      jummah: '13:05',
      eidUlAdha: '07:30',
      eidUlFitr: '07:30'
    },
    images: [
      '/mosques/mosque3.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm4',
    name: 'Razvi Masjid',
    address: 'Zakhira, Qila, Bareilly',
    distance: 0.5, // Changed from Loading to a numeric value
    // Coordinates used for distance calculation
    coordinates: {
      latitude: 28.366167,
      longitude: 79.407535
    },
    // Added direct Google Maps link
    googleMapsLink: 'https://maps.app.goo.gl/xsZFNgqqSqr8m3yR6?g_st=aw',
    prayerTimes: {
      fajr: '04:45',
      dhuhr: '14:00',
      asr: '17:45',
      maghrib: '19:06',
      isha: '21:00',
      jummah: '13:00',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    images: [
      '/mosques/razvi_masjid.jpg',  // These can be local images
    ],
    facilities: ['Prayer Hall', 'Madarsa', 'Ablution Area', 'Women\'s Section', 'Parking']
  },
];
