
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        
        {isCurrentPrayer && (
          <Badge className="bg-white text-islamic-green animate-pulse mt-1">
            SALAH STARTED
          </Badge>
        )}
        
        {isPassed && !isCurrentPrayer && (
          <Badge variant="outline" className="border-red-500 text-red-500 mt-1">
            SALAH DONE
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeItem;
