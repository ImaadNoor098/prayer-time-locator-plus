
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
      default: return '🕌';
    }
  };

  // Calculate the prayer end time (for countdown)
  const getPrayerEndTime = () => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    const prayerDate = new Date(date);
    prayerDate.setHours(hours, minutes, 0);
    
    // For active prayer, end time is 5 minutes after start
    if (isCurrentPrayer) {
      return new Date(prayerDate.getTime() + 5 * 60 * 1000);
    }
    
    // For upcoming prayer, end time is the prayer time itself
    return prayerDate;
  };
  
  const endTime = getPrayerEndTime();
  const shouldShowTimer = isCurrentPrayer || (!isPassed && prayer !== 'sunrise');

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4",
        isCurrentPrayer 
          ? "bg-islamic-green border-l-4 border-islamic-green" 
          : isPassed 
            ? "bg-gray-200 dark:bg-gray-800/50 opacity-80" 
            : "bg-white dark:bg-card"
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
          isCurrentPrayer 
            ? "bg-white text-islamic-green" 
            : isPassed 
              ? "bg-gray-300 dark:bg-gray-700" 
              : "bg-islamic-blue/10 text-islamic-blue"
        )}>
          {getIconForPrayer(prayer)}
        </div>
        <div>
          <h3 className={cn(
            "font-medium capitalize",
            isCurrentPrayer 
              ? "text-white" 
              : isPassed 
                ? "text-islamic-gray/70" 
                : "text-islamic-blue"
          )}>
            {prayer}
          </h3>
          <p className={cn(
            "text-sm",
            isCurrentPrayer ? "text-white/80" : "text-islamic-gray"
          )}>
            {format(date, 'EEEE, MMMM d')}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-lg font-bold",
          isCurrentPrayer 
            ? "text-white" 
            : isPassed 
              ? "text-islamic-gray/70" 
              : "text-islamic-blue"
        )}>
          {formattedTime}
        </span>
        
        {shouldShowTimer && (
          <CountdownTimer 
            endTime={endTime} 
            type={isCurrentPrayer ? 'active' : 'upcoming'} 
          />
        )}
        
        {isCurrentPrayer && prayer !== "sunrise" && (
          <Badge className="bg-white text-islamic-green mt-1">
            ACTIVE
          </Badge>
        )}
        
        {isPassed && !isCurrentPrayer && prayer !== "sunrise" && (
          <Badge variant="outline" className="border-red-500 text-red-500 mt-1">
            SALAH DONE
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeItem;
