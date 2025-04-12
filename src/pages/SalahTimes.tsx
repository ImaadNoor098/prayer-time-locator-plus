
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import BottomBar from '@/components/BottomBar';
import SalahHeader from '@/components/salah/SalahHeader';
import DateNavigation from '@/components/salah/DateNavigation';
import PrayerTimesList from '@/components/salah/PrayerTimesList';
import useSalahTimes from '@/hooks/useSalahTimes';

const SalahTimes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    salahTimes,
    loading,
    currentTime,
    formatTimeToAmPm,
    isPrayerTime,
    isPrayerPassed
  } = useSalahTimes(selectedDate);

  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <SalahHeader currentTime={currentTime} />
        
        <DateNavigation 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
        
        <PrayerTimesList
          salahTimes={salahTimes}
          loading={loading}
          isPrayerTime={isPrayerTime}
          isPrayerPassed={isPrayerPassed}
          formatTimeToAmPm={formatTimeToAmPm}
        />
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => window.open('https://www.muslimpro.com/Prayer-times', '_blank')}
            variant="outline"
            className="text-islamic-gray"
          >
            Data source: MuslimPro.com
          </Button>
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default SalahTimes;
