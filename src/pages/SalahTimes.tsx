
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import SalahHeader from '@/components/salah/SalahHeader';
import DateNavigation from '@/components/salah/DateNavigation';
import PrayerTimesList from '@/components/salah/PrayerTimesList';
import useSalahTimes from '@/hooks/useSalahTimes';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const SalahTimes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { currentBackgroundClass } = useBackgroundSelector();
  const {
    salahTimes,
    loading,
    currentTime,
    formatTimeToAmPm,
    isPrayerTime,
    isPrayerPassed
  } = useSalahTimes(selectedDate);

  return (
    <div className={`min-h-screen ${currentBackgroundClass} pb-20`}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Development notice banner */}
        <Alert className="mb-8 bg-islamic-gold/20 border-islamic-gold text-black animate-pulse backdrop-blur-sm">
          <Info className="h-5 w-5 text-islamic-blue" />
          <AlertTitle className="text-lg font-bold text-islamic-blue">
            Page Under Development
          </AlertTitle>
          <AlertDescription className="text-islamic-gray">
            Our prayer times page is currently being refined for greater accuracy. 
            Please refer to the data source website linked above for the most current information. 
            We'll be back soon with more precise prayer times!
          </AlertDescription>
        </Alert>
        
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
      </div>
      
      <BottomBar />
    </div>
  );
};

export default SalahTimes;
