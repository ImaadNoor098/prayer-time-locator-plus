
import React from 'react';
import { Mosque } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayer } from '@/contexts/prayer';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
}

const MosqueCard: React.FC<MosqueCardProps> = ({ mosque }) => {
  const { selectedPrayer, isPrayerPassed, isPrayerActive, toggleFavorite, isFavorite, formatTimeToAmPm } = usePrayer();
  const navigate = useNavigate();
  
  if (!selectedPrayer) return null;
  
  const prayerName = selectedPrayer.name.toLowerCase();
  const prayerTime = mosque.prayerTimes[prayerName];
  const formattedPrayerTime = formatTimeToAmPm(prayerTime);
  const isPassed = isPrayerPassed(prayerTime);
  const isActive = isPrayerActive(prayerTime);
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
  
  return (
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
          <Badge variant={isPassed && !isActive ? "outline" : "default"} className={cn(
            isActive ? "bg-islamic-green animate-pulse" :
            isPassed ? "bg-muted text-muted-foreground" : "bg-islamic-blue"
          )}>
            {formattedPrayerTime}
          </Badge>
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
                SALAH STARTED
              </Badge>
            )}
            {isPassed && !isActive && (
              <Badge variant="outline" className="ml-2 border-red-500 text-red-500">
                SALAH DONE
              </Badge>
            )}
          </span>
        </div>
        
        <div className="text-sm text-islamic-gray">
          <span>{mosque.distance.toFixed(1)} km away</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2 border-islamic-blue text-islamic-blue"
          onClick={handleDirections}
        >
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
  );
};

export default MosqueCard;
