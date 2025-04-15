import React from 'react';
import { Mosque } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayer } from '@/contexts/prayer';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UnfavoriteConfirmation from './mosque/UnfavoriteConfirmation';

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
    userLocation,
    showUnfavoriteConfirmation,
    unfavoriteDialogState,
    hideUnfavoriteConfirmation
  } = usePrayer();
  const navigate = useNavigate();
  
  if (!selectedPrayer) return null;
  
  const prayerName = selectedPrayer.name.toLowerCase();
  const prayerTime = mosque.prayerTimes[prayerName];
  const formattedPrayerTime = formatTimeToAmPm(prayerTime);
  const isPassed = isPrayerPassed(prayerTime);
  const isActive = isPrayerActive(prayerTime);
  const favorite = isFavorite(mosque.id);
  
  // Calculate actual distance if user location is available
  let distanceText = `${mosque.distance.toFixed(1)} km away`;
  
  if (userLocation && userLocation.latitude && userLocation.longitude && mosque.coordinates) {
    // Calculate real distance using Haversine formula
    const calculatedDistance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      mosque.coordinates.latitude,
      mosque.coordinates.longitude
    );
    
    distanceText = `${calculatedDistance.toFixed(1)} km away`;
  }
  
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
  
  // Function to calculate distance using Haversine formula (great-circle distance)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
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
                    favorite ? "fill-islamic-green text-islamic-green" : "text-islamic-gray"
                  )} 
                />
              </Button>
              <Badge variant={isPassed && !isActive ? "outline" : "default"} className={cn(
                isActive ? "bg-islamic-green animate-pulse" :
                isPassed ? "bg-muted text-muted-foreground" : "bg-islamic-blue"
              )}>
                {formattedPrayerTime}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-islamic-gray mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="truncate">{mosque.address}</span>
          </div>
          
          <div className="flex items-center text-sm mb-3">
            <Clock size={16} className={cn(
              "mr-1",
              isActive ? "text-islamic-green" : 
              isPassed ? "text-islamic-gray/70" : "text-islamic-green"
            )} />
            <span className={cn(
              isActive ? "text-islamic-green font-medium" :
              isPassed ? "text-islamic-gray/70 dark:text-islamic-cream/50" : "text-islamic-blue"
            )}>
              {selectedPrayer.name}: {formattedPrayerTime}
              {isActive && (
                <Badge className="ml-2 bg-islamic-green animate-pulse">
                  ACTIVE
                </Badge>
              )}
              {isPassed && !isActive && (
                <Badge variant="outline" className="ml-2 border-red-500 text-red-500">
                  SALAH DONE
                </Badge>
              )}
            </span>
          </div>
          
          <div className="text-sm text-islamic-gray flex items-center">
            <span className="flex items-center">
              <MapPin size={14} className="mr-1 text-islamic-blue" />
              {distanceText}
            </span>
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
    </>
  );
};

export default MosqueCard;
