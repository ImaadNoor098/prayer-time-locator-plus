
import { SalahTime } from '@/types';

export const getPrayerTimesForDate = (dateObj: Date): SalahTime => {
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  let times: SalahTime;
  
  // April (month 3)
  if (month === 3) {
    if (day <= 10) {
      times = {
        fajr: "04:41",
        sunrise: "05:57",
        dhuhr: "12:09",
        asr: "15:36",
        maghrib: "18:22",
        isha: "19:38",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:31",
        sunrise: "05:49",
        dhuhr: "12:07",
        asr: "15:36",
        maghrib: "18:26",
        isha: "19:43",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:21",
        sunrise: "05:41",
        dhuhr: "12:05",
        asr: "15:35",
        maghrib: "18:30",
        isha: "19:49",
        date: dateObj
      };
    }
  }
  // May (month 4)
  else if (month === 4) {
    if (day <= 10) {
      times = {
        fajr: "04:12",
        sunrise: "05:34",
        dhuhr: "12:04",
        asr: "15:35",
        maghrib: "18:34",
        isha: "19:56",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:05",
        sunrise: "05:29",
        dhuhr: "12:04",
        asr: "15:36",
        maghrib: "18:39",
        isha: "20:02",
        date: dateObj
      };
    } else {
      times = {
        fajr: "03:58",
        sunrise: "05:25",
        dhuhr: "12:04",
        asr: "15:37",
        maghrib: "18:44",
        isha: "20:08",
        date: dateObj
      };
    }
  }
  // June (month 5)
  else if (month === 5) {
    if (day <= 10) {
      times = {
        fajr: "03:55",
        sunrise: "05:23",
        dhuhr: "12:06",
        asr: "15:38",
        maghrib: "18:49",
        isha: "20:13",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "03:54",
        sunrise: "05:23",
        dhuhr: "12:08",
        asr: "15:41",
        maghrib: "18:52",
        isha: "20:17",
        date: dateObj
      };
    } else {
      times = {
        fajr: "03:57",
        sunrise: "05:25",
        dhuhr: "12:10",
        asr: "15:43",
        maghrib: "18:54",
        isha: "20:18",
        date: dateObj
      };
    }
  }
  // July (month 6)
  else if (month === 6) {
    if (day <= 10) {
      times = {
        fajr: "04:01",
        sunrise: "05:29",
        dhuhr: "12:12",
        asr: "15:44",
        maghrib: "18:54",
        isha: "20:17",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:07",
        sunrise: "05:34",
        dhuhr: "12:13",
        asr: "15:44",
        maghrib: "18:51",
        isha: "20:13",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:13",
        sunrise: "05:39",
        dhuhr: "12:13",
        asr: "15:42",
        maghrib: "18:47",
        isha: "20:08",
        date: dateObj
      };
    }
  }
  // August (month 7)
  else if (month === 7) {
    if (day <= 10) {
      times = {
        fajr: "04:20",
        sunrise: "05:44",
        dhuhr: "12:12",
        asr: "15:39",
        maghrib: "18:40",
        isha: "20:00",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:27",
        sunrise: "05:49",
        dhuhr: "12:10",
        asr: "15:35",
        maghrib: "18:31",
        isha: "19:50",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:33",
        sunrise: "05:54",
        dhuhr: "12:08",
        asr: "15:30",
        maghrib: "18:21",
        isha: "19:38",
        date: dateObj
      };
    }
  }
  // September (month 8)
  else if (month === 8) {
    if (day <= 10) {
      times = {
        fajr: "04:39",
        sunrise: "05:59",
        dhuhr: "12:04",
        asr: "15:23",
        maghrib: "18:10",
        isha: "19:26",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:44",
        sunrise: "06:03",
        dhuhr: "12:00",
        asr: "15:16",
        maghrib: "17:58",
        isha: "19:13",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:49",
        sunrise: "06:07",
        dhuhr: "11:57",
        asr: "15:08",
        maghrib: "17:46",
        isha: "19:00",
        date: dateObj
      };
    }
  }
  // October (month 9)
  else if (month === 9) {
    if (day <= 10) {
      times = {
        fajr: "04:53",
        sunrise: "06:11",
        dhuhr: "11:53",
        asr: "15:00",
        maghrib: "17:35",
        isha: "18:49",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:58",
        sunrise: "06:16",
        dhuhr: "11:50",
        asr: "14:53",
        maghrib: "17:24",
        isha: "18:38",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:03",
        sunrise: "06:21",
        dhuhr: "11:49",
        asr: "14:47",
        maghrib: "17:15",
        isha: "18:29",
        date: dateObj
      };
    }
  }
  // November (month 10)
  else if (month === 10) {
    if (day <= 10) {
      times = {
        fajr: "05:09",
        sunrise: "06:28",
        dhuhr: "11:48",
        asr: "14:42",
        maghrib: "17:07",
        isha: "18:22",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:16",
        sunrise: "06:35",
        dhuhr: "11:49",
        asr: "14:38",
        maghrib: "17:02",
        isha: "18:17",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:23",
        sunrise: "06:42",
        dhuhr: "11:51",
        asr: "14:37",
        maghrib: "16:59",
        isha: "18:15",
        date: dateObj
      };
    }
  }
  // December (month 11)
  else if (month === 11) {
    if (day <= 10) {
      times = {
        fajr: "05:30",
        sunrise: "06:49",
        dhuhr: "11:55",
        asr: "14:37",
        maghrib: "16:59",
        isha: "18:15",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:36",
        sunrise: "06:55",
        dhuhr: "12:00",
        asr: "14:40",
        maghrib: "17:03",
        isha: "18:18",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:41",
        sunrise: "06:59",
        dhuhr: "12:05",
        asr: "14:44",
        maghrib: "17:08",
        isha: "18:23",
        date: dateObj
      };
    }
  }
  // January (month 0)
  else if (month === 0) {
    if (day <= 10) {
      times = {
        fajr: "05:43",
        sunrise: "07:01",
        dhuhr: "12:09",
        asr: "14:50",
        maghrib: "17:16",
        isha: "18:30",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:44",
        sunrise: "07:00",
        dhuhr: "12:13",
        asr: "14:56",
        maghrib: "17:24",
        isha: "18:37",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:42",
        sunrise: "06:58",
        dhuhr: "12:15",
        asr: "15:03",
        maghrib: "17:32",
        isha: "18:44",
        date: dateObj
      };
    }
  }
  // February (month 1)
  else if (month === 1) {
    if (day <= 10) {
      times = {
        fajr: "05:37",
        sunrise: "06:52",
        dhuhr: "12:16",
        asr: "15:09",
        maghrib: "17:40",
        isha: "18:51",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:31",
        sunrise: "06:45",
        dhuhr: "12:16",
        asr: "15:15",
        maghrib: "17:47",
        isha: "18:57",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:22",
        sunrise: "06:37",
        dhuhr: "12:14",
        asr: "15:19",
        maghrib: "17:53",
        isha: "19:03",
        date: dateObj
      };
    }
  }
  // March (month 2)
  else if (month === 2) {
    if (day <= 10) {
      times = {
        fajr: "05:13",
        sunrise: "06:28",
        dhuhr: "12:12",
        asr: "15:23",
        maghrib: "17:57",
        isha: "19:08",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:03",
        sunrise: "06:18",
        dhuhr: "12:10",
        asr: "15:26",
        maghrib: "18:02",
        isha: "19:13",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:52",
        sunrise: "06:08",
        dhuhr: "12:07",
        asr: "15:30",
        maghrib: "18:07",
        isha: "19:18",
        date: dateObj
      };
    }
  }
  // Default fallback
  else {
    times = {
      fajr: "05:15",
      sunrise: "06:35",
      dhuhr: "12:08",
      asr: "15:05",
      maghrib: "17:40",
      isha: "19:00",
      date: dateObj
    };
  }
  
  return times;
};
