
import { SalahTime } from '@/types';

export const getPrayerTimesForDate = (dateObj: Date): SalahTime => {
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  let times: SalahTime;
  
  // April (month 3)
  if (month === 3) {
    if (day <= 10) {
      times = {
        fajr: "04:37",
        sunrise: "05:58",
        dhuhr: "12:10",
        asr: "15:37",
        maghrib: "18:22",
        isha: "19:39",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:28",
        sunrise: "05:50",
        dhuhr: "12:08",
        asr: "15:36",
        maghrib: "18:26",
        isha: "19:44",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:19",
        sunrise: "05:42",
        dhuhr: "12:06",
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
        fajr: "04:11",
        sunrise: "05:35",
        dhuhr: "12:05",
        asr: "15:35",
        maghrib: "18:35",
        isha: "19:55",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:04",
        sunrise: "05:30",
        dhuhr: "12:05",
        asr: "15:36",
        maghrib: "18:39",
        isha: "20:01",
        date: dateObj
      };
    } else {
      times = {
        fajr: "03:59",
        sunrise: "05:26",
        dhuhr: "12:05",
        asr: "15:37",
        maghrib: "18:44",
        isha: "20:07",
        date: dateObj
      };
    }
  }
  // June (month 5)
  else if (month === 5) {
    if (day <= 10) {
      times = {
        fajr: "03:56",
        sunrise: "05:24",
        dhuhr: "12:07",
        asr: "15:38",
        maghrib: "18:49",
        isha: "20:13",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "03:55",
        sunrise: "05:24",
        dhuhr: "12:09",
        asr: "15:41",
        maghrib: "18:52",
        isha: "20:17",
        date: dateObj
      };
    } else {
      times = {
        fajr: "03:58",
        sunrise: "05:26",
        dhuhr: "12:11",
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
        asr: "15:45",
        maghrib: "18:54",
        isha: "20:17",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:06",
        sunrise: "05:33",
        dhuhr: "12:13",
        asr: "15:44",
        maghrib: "18:52",
        isha: "20:14",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:12",
        sunrise: "05:38",
        dhuhr: "12:13",
        asr: "15:42",
        maghrib: "18:47",
        isha: "20:09",
        date: dateObj
      };
    }
  }
  // August (month 7)
  else if (month === 7) {
    if (day <= 10) {
      times = {
        fajr: "04:18",
        sunrise: "05:42",
        dhuhr: "12:12",
        asr: "15:39",
        maghrib: "18:41",
        isha: "20:01",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:24",
        sunrise: "05:47",
        dhuhr: "12:10",
        asr: "15:34",
        maghrib: "18:33",
        isha: "19:52",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:30",
        sunrise: "05:51",
        dhuhr: "12:07",
        asr: "15:28",
        maghrib: "18:24",
        isha: "19:40",
        date: dateObj
      };
    }
  }
  // September (month 8)
  else if (month === 8) {
    if (day <= 10) {
      times = {
        fajr: "04:36",
        sunrise: "05:55",
        dhuhr: "12:04",
        asr: "15:21",
        maghrib: "18:13",
        isha: "19:28",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:41",
        sunrise: "05:59",
        dhuhr: "12:00",
        asr: "15:14",
        maghrib: "18:02",
        isha: "19:16",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:46",
        sunrise: "06:03",
        dhuhr: "11:57",
        asr: "15:06",
        maghrib: "17:51",
        isha: "19:04",
        date: dateObj
      };
    }
  }
  // October (month 9)
  else if (month === 9) {
    if (day <= 10) {
      times = {
        fajr: "04:51",
        sunrise: "06:07",
        dhuhr: "11:54",
        asr: "14:59",
        maghrib: "17:40",
        isha: "18:52",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "04:56",
        sunrise: "06:12",
        dhuhr: "11:51",
        asr: "14:52",
        maghrib: "17:30",
        isha: "18:42",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:02",
        sunrise: "06:17",
        dhuhr: "11:50",
        asr: "14:47",
        maghrib: "17:21",
        isha: "18:33",
        date: dateObj
      };
    }
  }
  // November (month 10)
  else if (month === 10) {
    if (day <= 10) {
      times = {
        fajr: "05:08",
        sunrise: "06:24",
        dhuhr: "11:49",
        asr: "14:42",
        maghrib: "17:14",
        isha: "18:25",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:14",
        sunrise: "06:31",
        dhuhr: "11:50",
        asr: "14:39",
        maghrib: "17:09",
        isha: "18:21",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:21",
        sunrise: "06:38",
        dhuhr: "11:52",
        asr: "14:37",
        maghrib: "17:05",
        isha: "18:18",
        date: dateObj
      };
    }
  }
  // December (month 11)
  else if (month === 11) {
    if (day <= 10) {
      times = {
        fajr: "05:28",
        sunrise: "06:45",
        dhuhr: "11:55",
        asr: "14:37",
        maghrib: "17:04",
        isha: "18:18",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:34",
        sunrise: "06:52",
        dhuhr: "12:00",
        asr: "14:40",
        maghrib: "17:07",
        isha: "18:20",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:39",
        sunrise: "06:56",
        dhuhr: "12:04",
        asr: "14:44",
        maghrib: "17:11",
        isha: "18:25",
        date: dateObj
      };
    }
  }
  // January (month 0)
  else if (month === 0) {
    if (day <= 10) {
      times = {
        fajr: "05:42",
        sunrise: "06:59",
        dhuhr: "12:09",
        asr: "14:50",
        maghrib: "17:17",
        isha: "18:30",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:43",
        sunrise: "06:59",
        dhuhr: "12:12",
        asr: "14:56",
        maghrib: "17:24",
        isha: "18:37",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:41",
        sunrise: "06:57",
        dhuhr: "12:14",
        asr: "15:03",
        maghrib: "17:32",
        isha: "18:43",
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
        maghrib: "17:39",
        isha: "18:50",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:30",
        sunrise: "06:46",
        dhuhr: "12:16",
        asr: "15:15",
        maghrib: "17:46",
        isha: "18:57",
        date: dateObj
      };
    } else {
      times = {
        fajr: "05:22",
        sunrise: "06:38",
        dhuhr: "12:14",
        asr: "15:19",
        maghrib: "17:51",
        isha: "19:02",
        date: dateObj
      };
    }
  }
  // March (month 2)
  else if (month === 2) {
    if (day <= 10) {
      times = {
        fajr: "05:14",
        sunrise: "06:29",
        dhuhr: "12:13",
        asr: "15:23",
        maghrib: "17:56",
        isha: "19:07",
        date: dateObj
      };
    } else if (day <= 20) {
      times = {
        fajr: "05:04",
        sunrise: "06:20",
        dhuhr: "12:11",
        asr: "15:26",
        maghrib: "18:02",
        isha: "19:13",
        date: dateObj
      };
    } else {
      times = {
        fajr: "04:53",
        sunrise: "06:10",
        dhuhr: "12:09",
        asr: "15:30",
        maghrib: "18:07",
        isha: "19:19",
        date: dateObj
      };
    }
  }
  // Default fallback
  else {
    times = {
      fajr: "05:13",
      sunrise: "06:36",
      dhuhr: "12:08",
      asr: "15:03",
      maghrib: "17:40",
      isha: "19:03",
      date: dateObj
    };
  }
  
  return times;
};
