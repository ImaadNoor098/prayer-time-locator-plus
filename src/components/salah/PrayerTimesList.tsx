
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SalahTime } from '@/types';
import PrayerTimeItem from './PrayerTimeItem';

interface PrayerTimesListProps {
  salahTimes: SalahTime | null;
  isPrayerTime: (prayerTime: string) => boolean;
  isPrayerPassed: (prayerTime: string) => boolean;
  formatTimeToAmPm: (time: string) => string;
  loading: boolean;
}

const PrayerTimesList: React.FC<PrayerTimesListProps> = ({
  salahTimes,
  isPrayerTime,
  isPrayerPassed,
  formatTimeToAmPm,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Loading prayer times...</div>
      </div>
    );
  }

  if (!salahTimes) {
    return null;
  }

  return (
    <Card className="islamic-card overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y">
          {Object.entries(salahTimes).map(([prayer, time]) => {
            if (prayer === 'date') return null;
            
            const formattedTime = formatTimeToAmPm(time as string);
            const isCurrentPrayer = isPrayerTime(time as string);
            const isPassed = isPrayerPassed(time as string);
            
            return (
              <PrayerTimeItem
                key={prayer}
                prayer={prayer}
                time={time as string}
                date={salahTimes.date}
                isCurrentPrayer={isCurrentPrayer}
                isPassed={isPassed}
                formattedTime={formattedTime}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerTimesList;
