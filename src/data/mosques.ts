
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
      fajr: '04:45',
      dhuhr: '14:15',
      asr: '18:00',
      maghrib: '19:17',
      isha: '21:30',
      jummah: '13:00', // Updated time format to make it consistent with other mosques
      eidUlAdha: '09:00', // Changed to show actual time instead of "SALAH DONE" text
      eidUlFitr: '09:00' // Changed to show actual time instead of "SALAH DONE" text
    },
    lastUpdated: 'June 14, 2025',
    images: [
      '/mosques/pulqazi_masjid.jpg',  // These can be local images
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
      maghrib: '19:17',
      isha: '21:00',
      jummah: '12:35',
      eidUlAdha: '05:45',
      eidUlFitr: '05:45'
    },
    lastUpdated: 'June 10, 2025',
    images: [
      '/mosques/anar_wali_masjid.jpg',
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
      maghrib: '19:15',
      isha: '21:15',
      jummah: '13:05',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 12, 2025',
    images: [
      '/mosques/raza_masjid.jpg',
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
      maghrib: '19:16',
      isha: '21:15',
      jummah: '13:00',
      eidUlAdha: '7:30',
      eidUlFitr: '7:30'
    },
    lastUpdated: 'June 15, 2025',
    images: [
      '/mosques/razvi_masjid.jpg',  // These can be local images
    ],
    facilities: ['Prayer Hall', 'Madarsa', 'Ablution Area', 'Women\'s Section', 'Parking']
  },
  {
    id: 'm5',
    name: 'Syed Rasool Shah Baba Masjid',
    address: 'Bareilly Club, Civil Lines, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/nGYXitoc1sb9XgZo6?g_st=aw',
    prayerTimes: {
      fajr: '04:40',
      dhuhr: '13:45',
      asr: '17:45',
      maghrib: '19:15',
      isha: '21:00',
      jummah: '13:00',
      eidUlAdha: '08:00',
      eidUlFitr: '08:00'
    },
    lastUpdated: 'June 13, 2025',
    images: [
      '/mosques/syed_rasool_shah_baba_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm6',
    name: 'Mustufai Masjid, urf Begum Wali',
    address: 'Garhaiya, Phoota Darwaza, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/V8nvrgPptuonY1hq6?g_st=aw',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '13:30',
      asr: '17:30',
      maghrib: '19:16',
      isha: '21:00',
      jummah: '13:00',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 11, 2025',
    images: [
      '/mosques/mustufai_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm7',
    name: 'Abu Bakr Masjid',
    address: 'Phoolwalan, Zakhira, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/22K5bQCxsjtJX4qJ7?g_st=aw',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '13:30',
      asr: '17:30',
      maghrib: '19:15',
      isha: '21:00',
      jummah: '12:35',
      eidUlAdha: '06:30',
      eidUlFitr: '06:30'
    },
    lastUpdated: 'June 9, 2025',
    images: [
      '/mosques/abu_bakr_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm8',
    name: 'Domni Masjid',
    address: 'Phoolwalan, Zakhira, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/hQbME41D57QpmWri8?g_st=aw',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '14:00',
      asr: '17:45',
      maghrib: '19:17',
      isha: '21:15',
      jummah: '12:45',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 7, 2025',
    images: [
      '/mosques/domni_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm9',
    name: 'Noor Jahan Masjid',
    address: 'Phoolwalan, Zakhira, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/YdT1Yp9z1qFEGFCD9?g_st=aw',
    prayerTimes: {
      fajr: '04:45',
      dhuhr: '13:45',
      asr: '17:30',
      maghrib: '19:15',
      isha: '21:00',
      jummah: '13:15',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 14, 2025',
    images: [
      '/mosques/noor_jahan_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm10',
    name: 'Hashmi Masjid',
    address: 'Garhaiya, Bara Bazar, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/swApaq7gSp5T6iA37',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '13:30',
      asr: '17:30',
      maghrib: '19:15',
      isha: '21:00',
      jummah: '13:15',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 5, 2025',
    images: [
      '/mosques/hashmi_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm11',
    name: 'Madina Masjid',
    address: 'Sahukara, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/cpjGSELJpXyQt6Wb7?g_st=aw',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '13:30',
      asr: '17:20',
      maghrib: '19:16',
      isha: '21:00',
      jummah: '12:45',
      eidUlAdha: '05:45',
      eidUlFitr: '05:45'
    },
    lastUpdated: 'June 16, 2025',
    images: [
      '/mosques/madina_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm12',
    name: 'Rehani Masjid',
    address: 'Sahukara, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/RrCo2YVgBBm96EsXA?g_st=aw',
    prayerTimes: {
      fajr: '04:45',
      dhuhr: '14:00',
      asr: '17:30',
      maghrib: '19:17',
      isha: '21:00',
      jummah: '14:00',
      eidUlAdha: '08:00',
      eidUlFitr: '08:00'
    },
    lastUpdated: 'June 13, 2025',
    images: [
      '/mosques/rehani_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm13',
    name: 'Noori Masjid',
    address: 'Garhaiya, Phoota Darwaza, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/Nxn7aeffpGv8gYZC9?g_st=aw',
    prayerTimes: {
      fajr: '04:55',
      dhuhr: '14:00',
      asr: '17:30',
      maghrib: '19:16',
      isha: '21:00',
      jummah: '14:45',
      eidUlAdha: '09:00',
      eidUlFitr: '09:00'
    },
    lastUpdated: 'June 11, 2025',
    images: [
      '/mosques/noori_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm14',
    name: 'Shamsuddin Masjid',
    address: 'Phoota Darwaza, Sahukara, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/JLoBwTcdzmQqGJBC9?g_st=aw',
    prayerTimes: {
      fajr: '04:55',
      dhuhr: '13:30',
      asr: '17:45',
      maghrib: '19:17',
      isha: '21:00',
      jummah: '14:00',
      eidUlAdha: '07:30',
      eidUlFitr: '07:30'
    },
    lastUpdated: 'June 4, 2025',
    images: [
      '/mosques/shamsuddin_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm15',
    name: 'Thane Wali Masjid',
    address: 'Sahukara, Thana Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/UQwKWnfuoiCKoNqW7?g_st=aw',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '13:45',
      asr: '17:45',
      maghrib: '19:15',
      isha: '21:15',
      jummah: '13:15',
      eidUlAdha: '06:30',
      eidUlFitr: '06:30'
    },
    lastUpdated: 'July 16, 2025',
    images: [
      '/mosques/thane_wali_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm16',
    name: 'Hari Minar Masjid',
    address: 'Katghar, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/SV1VXg44fivkfxjDA',
    prayerTimes: {
      fajr: '04:45',
      dhuhr: '14:00',
      asr: '18:00',
      maghrib: '19:16',
      isha: '21:15',
      jummah: '13:14',
      eidUlAdha: '07:30',
      eidUlFitr: '07:30'
    },
    lastUpdated: 'June 3, 2025',
    images: [
      '/mosques/hari_minar_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
    {
    id: 'm17',
    name: 'Duliya Wali/Bi Masjid',
    address: 'Zakhira, Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/4jsSo8xPZSe6G1Zh7',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '14:00',
      asr: '17:45',
      maghrib: '19:16',
      isha: '21:15',
      jummah: '14:30',
      eidUlAdha: '05:40',
      eidUlFitr: '05:40'
    },
    lastUpdated: 'June 8, 2025',
    images: [
      '/mosques/duliya_wali_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
    {
    id: 'm18',
    name: 'JAMA Masjid',
    address: 'Qila, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/K1NrG4CRgzpX6ph7A',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '14:00',
      asr: '18:00',
      maghrib: '19:14',
      isha: '21:15',
      jummah: '13:30',
      eidUlAdha: '07:00',
      eidUlFitr: '07:00'
    },
    lastUpdated: 'June 14, 2025',
    images: [
      '/mosques/jama_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm19',
    name: 'Surme Wali Masjid (Hashmi Masjid)',
    address: 'Naala, Bara Bazar, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/jibnqEcH3aBnzV1e6',
    prayerTimes: {
      fajr: '04:50',
      dhuhr: '14:00',
      asr: '18:00',
      maghrib: '19:16',
      isha: '21:00',
      jummah: '14:00',
      eidUlAdha: '08:00',
      eidUlFitr: '08:00'
    },
    lastUpdated: 'June 18, 2025',
    images: [
      '/mosques/surme_wali_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm20',
    name: 'Chauki/Chowki Chauraha Masjid',
    address: 'Chauki Charaha, Butler Plaza, Bareilly',
    distance: 0.8,
    coordinates: {
      latitude: 28.368,
      longitude: 79.427
    },
    googleMapsLink: 'https://maps.app.goo.gl/jibnqEcH3aBnzV1e6',
    prayerTimes: {
      fajr: 'No Fajr Prayer Here',
      dhuhr: '13:45',
      asr: '17:30',
      maghrib: '19:17',
      isha: '21:00',
      jummah: '12:45',
      eidUlAdha: '06:00',
      eidUlFitr: '06:00'
    },
    lastUpdated: 'June 21, 2025',
    images: [
      '/mosques/chauki_chauraha_masjid.jpg',
      '/mosques/mosque3-interior.jpg'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
];
