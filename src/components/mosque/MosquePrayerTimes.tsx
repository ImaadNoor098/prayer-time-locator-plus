
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CountdownTimer from '../salah/CountdownTimer';
import { MosqueData } from '@/contexts/prayer/types';

interface MosquePrayerTimesProps {
  mosque: MosqueData;
  selectedPrayer: { name: string };
  isPrayerPassed: (time: string) => boolean;
  isPrayerActive: (time: string) => boolean;
  formatTimeToAmPm: (time: string) => string;
}

const MosquePrayerTimes: React.FC<MosquePrayerTimesProps> = ({ 
  mosque, 
  selectedPrayer, 
  isPrayerPassed, 
  isPrayerActive, 
  formatTimeToAmPm 
}) => {
  // Function to get the countdown end time
  const getCountdownEndTime = (time: string, isPrayerTimeActive: boolean) => {
    const [hours, minutes] = time.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes, 0);
    
    // If prayer is active, countdown ends 5 minutes after prayer time
    if (isPrayerTimeActive) {
      return new Date(endTime.getTime() + 5 * 60 * 1000);
    }
    
    // For upcoming prayers, countdown ends at prayer time
    return endTime;
  };

  // Map prayer names to their corresponding keys in mosque data
  const getPrayerKey = (prayerName: string): string => {
    const prayerKeyMap: Record<string, string> = {
      'Fajr': 'fajr',
      'Dhuhr': 'dhuhr', 
      'Asr': 'asr',
      'Maghrib': 'maghrib',
      'Isha': 'isha',
      'Jummah': 'jummah',
      'Eid ul-Adha': 'eidUlAdha',
      'Eid ul-Fitr': 'eidUlFitr'
    };
    
    return prayerKeyMap[prayerName] || prayerName.toLowerCase();
  };

  // Special logic for Eid prayers to determine their status
  const getEidPrayerStatus = (prayer: string, time: string) => {
    const currentDate = new Date();
    
    if (prayer === 'eidUlAdha') {
      // Eid ul-Adha is on 7th June 2025
      const eidDate = new Date('2025-06-07');
      
      // If current date is before Eid date, don't mark as done
      if (currentDate < eidDate) {
        return { isPassed: false, isCurrentPrayer: false };
      }
      
      // If it's Eid date, use normal logic for prayer times
      if (currentDate.toDateString() === eidDate.toDateString()) {
        const [hours, minutes] = time.split(':').map(Number);
        const prayerDateTime = new Date(eidDate);
        prayerDateTime.setHours(hours, minutes, 0);
        
        const isActive = currentDate >= prayerDateTime && currentDate <= new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
        const hasPassed = currentDate > new Date(prayerDateTime.getTime() + 5 * 60 * 1000);
        
        return { isPassed: hasPassed, isCurrentPrayer: isActive };
      }
      
      // If after Eid date, mark as passed
      return { isPassed: true, isCurrentPrayer: false };
    }
    
    if (prayer === 'eidUlFitr') {
      // Since date is not known (based on moon sighting), don't mark as done
      return { isPassed: false, isCurrentPrayer: false };
    }
    
    // For regular prayers, use the passed props
    return { isPassed: isPrayerPassed(time), isCurrentPrayer: isPrayerActive(time) };
  };

  const prayerKey = getPrayerKey(selectedPrayer.name);

  return (
    <div className="flex items-start">
      <Clock className="h-5 w-5 mr-2 text-islamic-green mt-0.5" />
      <div className="w-full">
        <h3 className="font-medium mb-2">Prayer Times</h3>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-islamic-green/20">
          {Object.entries(mosque.prayerTimes).map(([prayer, time], index) => {
            const isCurrentPrayer = prayer === prayerKey;
            
            // Use Eid logic for Eid prayers, otherwise use normal logic
            const eidStatus = getEidPrayerStatus(prayer, time);
            const isPrayerTimeOver = (prayer === 'eidUlAdha' || prayer === 'eidUlFitr') ? eidStatus.isPassed : isPrayerPassed(time);
            const isPrayerTimeActive = (prayer === 'eidUlAdha' || prayer === 'eidUlFitr') ? eidStatus.isCurrentPrayer : isPrayerActive(time);
            
            const formattedTime = formatTimeToAmPm(time);
            const isLastItem = index === Object.entries(mosque.prayerTimes).length - 1;
            
            // Check if today is Friday for Jummah prayer timer logic
            const isFriday = new Date().getDay() === 5;
            
            // Calculate if we should show a countdown
            const shouldShowCountdown = isPrayerTimeActive || 
              (!isPrayerTimeOver && prayer !== "sunrise" && prayer !== 'eidUlFitr' &&
               !(prayer === 'jummah' && !isFriday)); // Don't show timer for Jummah unless it's Friday
            
            // Get display name for prayer
            const getDisplayName = (prayer: string) => {
              switch(prayer) {
                case 'eidUlAdha': return 'Eid ul-Adha';
                case 'eidUlFitr': return 'Eid ul-Fitr';
                default: return prayer.charAt(0).toUpperCase() + prayer.slice(1);
              }
            };
            
            return (
              <div 
                key={prayer}
                className={cn(
                  "flex items-center justify-between p-3 relative",
                  !isLastItem && "border-b border-gray-100 dark:border-gray-700",
                  isPrayerTimeActive ? "bg-islamic-green/10" : "",
                  isCurrentPrayer ? "bg-islamic-blue/5" : ""
                )}
              >
                {isPrayerTimeActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-islamic-green" />
                )}
                
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    isPrayerTimeActive
                      ? "bg-islamic-green text-white"
                      : isPrayerTimeOver && prayer !== "sunrise"
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-islamic-blue/10 text-islamic-blue"
                  )}>
                    {prayer === 'fajr' ? '🌅' : 
                     prayer === 'sunrise' ? '☀️' : 
                     prayer === 'dhuhr' ? '🕌' : 
                     prayer === 'asr' ? '🌇' : 
                     prayer === 'maghrib' ? '🌆' : 
                     prayer === 'isha' ? '🌙' : 
                     prayer === 'jummah' ? '🕌' :
                     prayer === 'eidUlAdha' ? '🕌' :
                     prayer === 'eidUlFitr' ? '🌙' : '🕌'}
                  </div>
                  <div>
                    <p className="font-medium">{getDisplayName(prayer)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-base font-semibold",
                    isPrayerTimeActive 
                      ? "text-islamic-green" 
                      : isPrayerTimeOver && prayer !== "sunrise"
                        ? "text-islamic-gray/70" 
                        : "text-islamic-blue"
                  )}>
                    {formattedTime}
                  </span>
                  
                  {shouldShowCountdown && (
                    <CountdownTimer 
                      endTime={getCountdownEndTime(time, isPrayerTimeActive)}
                      type={isPrayerTimeActive ? 'active' : 'upcoming'}
                    />
                  )}
                  
                  {isPrayerTimeActive && prayer !== "sunrise" && (
                    <Badge className="bg-islamic-green text-white text-xs mt-1">
                      ACTIVE
                    </Badge>
                  )}
                  
                  {isPrayerTimeOver && !isPrayerTimeActive && prayer !== "sunrise" && (
                    <Badge variant="outline" className="border-red-500 text-red-500 text-xs mt-1">
                      SALAH DONE
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MosquePrayerTimes;
