
import { Mosque } from '@/types';

// Mock mosque data
export const mosques: Mosque[] = [
  {
    id: 'm1',
    name: 'Masjid Al-Noor',
    address: '123 Islamic Way, Muslim District',
    distance: 1.2,
    // You can either provide coordinates, a Google Maps link, or both
    googleMapsLink: 'https://goo.gl/maps/exampleLink1',
    prayerTimes: {
      fajr: '05:30',
      dhuhr: '13:15',
      asr: '16:45',
      maghrib: '19:30',
      isha: '21:00',
      jummah: '13:30'
    },
    images: [
      'https://images.unsplash.com/photo-1584551246679-ac93133d14dc',
      'https://images.unsplash.com/photo-1584551246679-ac93133d14dc'
    ],
    facilities: ['Prayer Hall', 'Ablution Area', 'Women\'s Section', 'Parking']
  },
  {
    id: 'm2',
    name: 'Islamic Center of Peace',
    address: '456 Faith Street, Harmony Heights',
    distance: 2.5,
    googleMapsLink: 'https://goo.gl/maps/exampleLink2',
    prayerTimes: {
      fajr: '05:15',
      dhuhr: '13:00',
      asr: '16:30',
      maghrib: '19:45',
      isha: '21:15',
      jummah: '13:15'
    },
    images: [
      'https://images.unsplash.com/photo-1542377575-1a78e9f2befa',
      'https://images.unsplash.com/photo-1542377575-1a78e9f2befa'
    ],
    facilities: ['Prayer Hall', 'Library', 'Conference Room', 'Educational Classes']
  },
  {
    id: 'm3',
    name: 'Masjid Al-Rahman',
    address: '789 Mercy Road, Blessing Hills',
    distance: 0.8,
    googleMapsLink: 'https://goo.gl/maps/exampleLink3',
    prayerTimes: {
      fajr: '05:45',
      dhuhr: '13:30',
      asr: '17:00',
      maghrib: '19:15',
      isha: '20:45',
      jummah: '13:45'
    },
    images: [
      'https://images.unsplash.com/photo-1564769625688-78e0ff96661a',
      'https://images.unsplash.com/photo-1564769625688-78e0ff96661a'
    ],
    facilities: ['Prayer Hall', 'Community Center', 'Children\'s Area', 'Charity Services']
  },
  {
    id: 'm4',
    name: 'Tawhid Mosque',
    address: '101 Unity Plaza, Faith Valley',
    distance: 3.7,
    googleMapsLink: 'https://goo.gl/maps/exampleLink4',
    prayerTimes: {
      fajr: '05:00',
      dhuhr: '12:45',
      asr: '16:15',
      maghrib: '19:00',
      isha: '20:30',
      jummah: '13:00'
    },
    images: [
      'https://images.unsplash.com/photo-1585129918930-d358629058ec',
      'https://images.unsplash.com/photo-1585129918930-d358629058ec'
    ],
    facilities: ['Prayer Hall', 'Islamic Shop', 'Funeral Services', 'Marriage Services']
  },
  {
    id: 'm5',
    name: 'Masjid Al-Taqwa',
    address: '202 Piety Lane, Devotion Square',
    distance: 1.9,
    googleMapsLink: 'https://goo.gl/maps/exampleLink5',
    prayerTimes: {
      fajr: '05:20',
      dhuhr: '13:10',
      asr: '16:40',
      maghrib: '19:20',
      isha: '20:50',
      jummah: '13:20'
    },
    images: [
      'https://images.unsplash.com/photo-1585129918930-d358629058ec',
      'https://images.unsplash.com/photo-1585129918930-d358629058ec'
    ],
    facilities: ['Prayer Hall', 'Food Bank', 'Madrasah', 'Multilingual Sermons']
  }
];
