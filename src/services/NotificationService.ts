
import { toast } from "@/hooks/use-toast";
import { Mosque, PrayerTime } from "@/types";

export class NotificationService {
  private static notifiedPrayers: Set<string> = new Set();
  
  // Function to show a prayer time notification
  static showPrayerTimeNotification(mosque: Mosque, prayer: PrayerTime): void {
    // Create a unique key for this mosque-prayer combination
    const notificationKey = `${mosque.id}:${prayer.name}:${new Date().toDateString()}`;
    
    // Only notify once per prayer per mosque per day
    if (this.notifiedPrayers.has(notificationKey)) {
      return;
    }
    
    // Add to notified set to prevent duplicate notifications
    this.notifiedPrayers.add(notificationKey);
    
    // Show the toast notification
    toast({
      title: `${prayer.name} Prayer Time`,
      description: `It's time for ${prayer.name} prayer at ${mosque.name}. Please join the congregation!`,
      variant: "default",
      duration: 10000, // longer duration for prayer alerts (10 seconds)
    });
  }
  
  // Check if we should notify for a prayer
  static shouldNotifyForPrayer(
    mosqueId: string, 
    prayerName: string, 
    isFavorite: boolean, 
    isActive: boolean
  ): boolean {
    if (!isFavorite || !isActive) {
      return false;
    }
    
    // Create notification key to check if already notified
    const notificationKey = `${mosqueId}:${prayerName}:${new Date().toDateString()}`;
    return !this.notifiedPrayers.has(notificationKey);
  }
  
  // Clear notification history (can be called on app restart or midnight)
  static clearNotificationHistory(): void {
    this.notifiedPrayers.clear();
  }
}
