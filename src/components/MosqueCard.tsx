import React, { useState } from 'react';
import { Mosque } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayer } from '@/contexts/prayer';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UnfavoriteConfirmation from './mosque/UnfavoriteConfirmation';
import FavoriteAuthCheck from './FavoriteAuthCheck';
import { useAuth } from '@/contexts/AuthContext';

interface MosqueCardProps {
  mosque: Mosque;
}

const MosqueCard: React.FC<MosqueCardProps> = ({ mosque }) => {
  const { 
    selectedPrayer, 
    isPrayerPassed, 
    isPrayerActive, 
    toggleFavorite, 
    isFavorite, 
    formatTimeToAmPm,
    showUnfavoriteConfirmation,
    unfavoriteDialogState,
    hideUnfavoriteConfirmation
  } = usePrayer();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  if (!selectedPrayer) return null;
  
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
      // Eid ul-Fitr salah for 2025 was done on 1st April 2025, so always mark as done
      return { isPassed: true, isCurrentPrayer: false };
    }
    
    // For regular prayers, use the passed props
    return { isPassed: isPrayerPassed(time), isCurrentPrayer: isPrayerActive(time) };
  };
  
  // Special logic for Jummah prayer to check if it's Friday
  const getJummahPrayerStatus = (time: string) => {
    const currentDate = new Date();
    const isFriday = currentDate.getDay() === 5;
    
    // If it's not Friday, Jummah prayer is not applicable
    if (!isFriday) {
      return { isPassed: false, isCurrentPrayer: false };
    }
    
    // If it's Friday, use normal prayer logic
    return { isPassed: isPrayerPassed(time), isCurrentPrayer: isPrayerActive(time) };
  };
  
  const prayerKey = getPrayerKey(selectedPrayer.name);
  const prayerTime = mosque.prayerTimes[prayerKey];
  
  // For Eid prayers, extract time from the formatted string if it contains "SALAH DONE"
  let displayTime = prayerTime;
  if ((prayerKey === 'eidUlAdha' || prayerKey === 'eidUlFitr') && prayerTime.includes('SALAH DONE')) {
    // Extract time from strings like "SALAH DONE on 7 June 2025" - for display purposes, we'll use a default time
    // Since the data shows "SALAH DONE on [date]", we'll display this as a completed prayer
    displayTime = prayerKey === 'eidUlAdha' ? '07:00' : '07:00'; // Default Eid prayer times for display
  }
  
  const formattedPrayerTime = formatTimeToAmPm(displayTime);
  
  // Determine prayer status based on prayer type
  let isPassed, isActive;
  
  if (prayerKey === 'eidUlAdha' || prayerKey === 'eidUlFitr') {
    const eidStatus = getEidPrayerStatus(prayerKey, displayTime);
    isPassed = eidStatus.isPassed;
    isActive = eidStatus.isCurrentPrayer;
  } else if (prayerKey === 'jummah') {
    const jummahStatus = getJummahPrayerStatus(displayTime);
    isPassed = jummahStatus.isPassed;
    isActive = jummahStatus.isCurrentPrayer;
  } else {
    isPassed = isPrayerPassed(displayTime);
    isActive = isPrayerActive(displayTime);
  }
  
  const favorite = isFavorite(mosque.id);
  
  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // Use the googleMapsLink if available, otherwise fall back to coordinates
    if (mosque.googleMapsLink) {
      window.open(mosque.googleMapsLink, '_blank');
    } else if (mosque.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.coordinates.latitude},${mosque.coordinates.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      // If neither are available, search for the mosque by name and address
      const searchQuery = encodeURIComponent(`${mosque.name} ${mosque.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
    }
  };
  
  const handleDetails = () => {
    navigate(`/mosque/${mosque.id}`);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // If user is not authenticated, show login dialog
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    // If it's already a favorite, show confirmation dialog
    if (favorite) {
      showUnfavoriteConfirmation(mosque);
    } else {
      // If not a favorite, add it directly
      toggleFavorite(mosque.id);
    }
  };
  
  // Handle the confirmation of unfavoriting
  const handleConfirmUnfavorite = () => {
    toggleFavorite(mosque.id);
    hideUnfavoriteConfirmation();
  };
  
  // Handle successful authentication
  const handleAuthenticated = () => {
    toggleFavorite(mosque.id);
  };
  
  // Check if this mosque is the one in the unfavorite dialog
  const isCurrentMosqueInDialog = unfavoriteDialogState.mosque?.id === mosque.id;
  
  return (
    <>
      <Card 
        className={cn(
          "islamic-card transition-all relative overflow-hidden cursor-pointer",
          isActive ? "border-2 border-islamic-green" : 
          isPassed ? "bg-gray-200 dark:bg-gray-800/70 opacity-80" : ""
        )}
        onClick={handleDetails}
      >
        {isPassed && !isActive && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-[200%] h-[1px] bg-islamic-gray/80 dark:bg-islamic-cream/80 rotate-[-35deg] transform origin-top-left translate-x-[-20%] translate-y-[50%] border-t border-islamic-gray/80 dark:border-islamic-cream/80"></div>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "text-lg font-semibold",
              isActive ? "text-islamic-green" :
              isPassed ? "text-islamic-gray dark:text-islamic-cream/60" : "text-islamic-blue"
            )}>
              {mosque.name}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={handleFavoriteToggle}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5 transition-colors",
                    favorite && isAuthenticated ? "fill-islamic-green text-islamic-green" : "text-islamic-gray"
                  )} 
                />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-islamic-gray mb-3">
            <MapPin size={16} className="mr-1" />
            <span className="truncate">{mosque.address}</span>
          </div>
          
          {/* Enhanced Prayer Time Display */}
          <div className="bg-gradient-to-r from-islamic-blue/10 to-islamic-green/10 rounded-lg p-4 mb-3 border border-islamic-gold/30">
            <div className="flex items-center justify-center">
              <Clock size={20} className={cn(
                "mr-2",
                isActive ? "text-islamic-green" : 
                isPassed ? "text-islamic-gray/70" : "text-islamic-blue"
              )} />
              <div className="text-center">
                <p className="text-sm font-medium text-islamic-gray dark:text-islamic-cream/70 mb-1">
                  {selectedPrayer.name} Prayer
                </p>
                <div className={cn(
                  "text-4xl font-bold tracking-wider transition-all duration-300",
                  isActive ? "text-islamic-green animate-pulse-gentle drop-shadow-lg" :
                  isPassed ? "text-islamic-gray/70 dark:text-islamic-cream/50" : "text-islamic-blue drop-shadow-md"
                )}>
                  <span className={cn(
                    "inline-block",
                    isActive && "animate-pulse bg-gradient-to-r from-islamic-green to-islamic-light-green bg-clip-text text-transparent"
                  )}>
                    {formattedPrayerTime}
                  </span>
                </div>
                <div className="flex justify-center mt-2">
                  {isActive && (
                    <Badge className="bg-islamic-green animate-pulse text-white font-medium">
                      ACTIVE
                    </Badge>
                  )}
                  {isPassed && !isActive && prayerKey !== "sunrise" && (
                    <Badge variant="outline" className="border-red-500 text-red-500 font-medium">
                      SALAH DONE
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 bg-islamic-gold hover:bg-islamic-gold/90 text-black border-islamic-gold"
            onClick={handleDirections}
          >
            <MapPin className="mr-1 h-4 w-4" />
            Directions
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-1/2 bg-islamic-green hover:bg-islamic-light-green"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleDetails();
            }}
          >
            Details
          </Button>
        </CardFooter>
      </Card>
      
      {isCurrentMosqueInDialog && (
        <UnfavoriteConfirmation
          isOpen={unfavoriteDialogState.isOpen}
          onClose={hideUnfavoriteConfirmation}
          onConfirm={handleConfirmUnfavorite}
          mosqueName={mosque.name}
        />
      )}
      
      {/* Auth check dialog */}
      <FavoriteAuthCheck 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthenticated={handleAuthenticated}
      />
    </>
  );
};

export default MosqueCard;
