
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CountdownTimer from './CountdownTimer';

interface PrayerTimeItemProps {
  prayer: string;
  time: string;
  date: Date;
  isCurrentPrayer: boolean;
  isPassed: boolean;
  formattedTime: string;
}

const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({
  prayer,
  time,
  date,
  isCurrentPrayer,
  isPassed,
  formattedTime
}) => {
  const getIconForPrayer = (prayer: string) => {
    switch(prayer) {
      case 'fajr': return '🌅';
      case 'sunrise': return '☀️';
      case 'dhuhr': return '🕌';
      case 'asr': return '🌇';
      case 'maghrib': return '🌆';
      case 'isha': return '🌙';
      case 'eidUlAdha': return '🐑';
      case 'eidUlFitr': return '🌙';
      default: return '🕌';
    }
  };

  // Special logic for Eid prayers
  const getEidPrayerStatus = () => {
    const currentDate = new Date();
    
    if (prayer === 'eidUlAdha') {
      // Eid ul-Adha is on 7th June 2025
      const eidDate = new Date('2025-06-07');
      
      // If current date is before Eid date, don't mark as done
      if (currentDate < eidDate) {
        return { isPassed: false, isCurrentPrayer: false };
      }
      
      // If it's Eid date or after, use normal logic
      const [hours, minutes] = time.split(':').map(Number);
      const prayerDateTime = new Date(eidDate);
      prayerDateTime.setHours(hours, minutes, 0);
      
      const isActive = currentDate >= prayerDateTime && currentDate <= new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
      const hasPassed = currentDate > new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
      
      return { isPassed: hasPassed, isCurrentPrayer: isActive };
    }
    
    if (prayer === 'eidUlFitr') {
      // Since date is not known (based on moon sighting), mark as done
      return { isPassed: true, isCurrentPrayer: false };
    }
    
    // For regular prayers, use the passed props
    return { isPassed, isCurrentPrayer };
  };

  const eidStatus = getEidPrayerStatus();
  const finalIsPassed = (prayer === 'eidUlAdha' || prayer === 'eidUlFitr') ? eidStatus.isPassed : isPassed;
  const finalIsCurrentPrayer = (prayer === 'eidUlAdha' || prayer === 'eidUlFitr') ? eidStatus.isCurrentPrayer : isCurrentPrayer;

  // Calculate the prayer end time (for countdown)
  const getPrayerEndTime = () => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    const prayerDate = new Date(date);
    prayerDate.setHours(hours, minutes, 0);
    
    // For active prayer, end time is 5 minutes after start
    if (finalIsCurrentPrayer) {
      return new Date(prayerDate.getTime() + 5 * 60 * 1000);
    }
    
    // For upcoming prayer, end time is the prayer time itself
    return prayerDate;
  };
  
  const endTime = getPrayerEndTime();
  const shouldShowTimer = finalIsCurrentPrayer || (!finalIsPassed && prayer !== 'sunrise' && prayer !== 'eidUlFitr');

  // Special display for Eid prayers
  const getEidDisplayInfo = () => {
    if (prayer === 'eidUlAdha') {
      return {
        name: 'Eid ul-Adha',
        subtitle: '7th June 2025'
      };
    }
    if (prayer === 'eidUlFitr') {
      return {
        name: 'Eid ul-Fitr',
        subtitle: 'Based on Moon Sighting'
      };
    }
    return null;
  };

  const eidInfo = getEidDisplayInfo();

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4",
        finalIsCurrentPrayer 
          ? "bg-islamic-green border-l-4 border-islamic-green" 
          : finalIsPassed 
            ? "bg-gray-200 dark:bg-gray-800/50 opacity-80" 
            : "bg-white dark:bg-card"
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
          finalIsCurrentPrayer 
            ? "bg-white text-islamic-green" 
            : finalIsPassed 
              ? "bg-gray-300 dark:bg-gray-700" 
              : "bg-islamic-blue/10 text-islamic-blue"
        )}>
          {getIconForPrayer(prayer)}
        </div>
        <div>
          <h3 className={cn(
            "font-medium capitalize",
            finalIsCurrentPrayer 
              ? "text-white" 
              : finalIsPassed 
                ? "text-islamic-gray/70" 
                : "text-islamic-blue"
          )}>
            {eidInfo ? eidInfo.name : prayer}
          </h3>
          <p className={cn(
            "text-sm",
            finalIsCurrentPrayer ? "text-white/80" : "text-islamic-gray"
          )}>
            {eidInfo ? eidInfo.subtitle : format(date, 'EEEE, MMMM d')}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-lg font-bold",
          finalIsCurrentPrayer 
            ? "text-white" 
            : finalIsPassed 
              ? "text-islamic-gray/70" 
              : "text-islamic-blue"
        )}>
          {formattedTime}
        </span>
        
        {shouldShowTimer && (
          <CountdownTimer 
            endTime={endTime} 
            type={finalIsCurrentPrayer ? 'active' : 'upcoming'} 
          />
        )}
        
        {finalIsCurrentPrayer && prayer !== "sunrise" && (
          <Badge className="bg-white text-islamic-green mt-1">
            ACTIVE
          </Badge>
        )}
        
        {finalIsPassed && !finalIsCurrentPrayer && prayer !== "sunrise" && (
          <Badge variant="outline" className="border-red-500 text-red-500 mt-1">
            SALAH DONE
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeItem;
