
import { useEffect } from 'react';
import { PrayerTime, Mosque } from '@/types';
import { NotificationService } from '@/services/NotificationService';

export const useNotifications = (
  prayers: PrayerTime[], 
  mosqueList: Mosque[], 
  favorites: string[], 
  isFavorite: (id: string) => boolean,
  currentTime: Date
) => {
  // Check for prayer times that need notifications (every minute)
  useEffect(() => {
    // Function to check if we need to send notifications
    const checkPrayerTimesForNotifications = () => {
      // Only check if we have favorite mosques
      if (favorites.length === 0) return;
      
      // Get all favorite mosques
      const favoriteMosques = mosqueList.filter(mosque => favorites.includes(mosque.id));
      
      // For each prayer type, check if it's active time
      prayers.forEach(prayer => {
        const prayerName = prayer.name.toLowerCase();
        
        // For each favorite mosque, check if prayer is active
        favoriteMosques.forEach(mosque => {
          const prayerTime = mosque.prayerTimes[prayerName];
          if (!prayerTime) return;
          
          const isActive = isPrayerActive(prayerTime, currentTime);
          
          // Should notify if: mosque is favorite, prayer is active, haven't notified yet
          if (isActive && isFavorite(mosque.id)) {
            if (NotificationService.shouldNotifyForPrayer(mosque.id, prayer.name, true, true)) {
              NotificationService.showPrayerTimeNotification(mosque, prayer);
            }
          }
        });
      });
    };
    
    // Check immediately on component mount
    checkPrayerTimesForNotifications();
    
    // Check every minute
    const interval = setInterval(checkPrayerTimesForNotifications, 60000);
    
    // Clear on unmount
    return () => clearInterval(interval);
  }, [currentTime, favorites, isFavorite, mosqueList, prayers]);

  // Helper function for notifications
  const isPrayerActive = (time: string, currentTime: Date): boolean => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return false;
    
    const prayerDateTime = new Date(currentTime);
    prayerDateTime.setHours(hours, minutes, 0);
    
    // Set end time to 5 minutes after the prayer time
    const endDateTime = new Date(prayerDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 5);
    
    return currentTime >= prayerDateTime && currentTime <= endDateTime;
  };
};
