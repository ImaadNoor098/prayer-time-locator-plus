
import React from 'react';
import { Mosque } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayer } from '@/contexts/PrayerContext';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
}

const MosqueCard: React.FC<MosqueCardProps> = ({ mosque }) => {
  const { selectedPrayer, isPrayerPassed } = usePrayer();
  
  if (!selectedPrayer) return null;
  
  const prayerName = selectedPrayer.name.toLowerCase();
  const prayerTime = mosque.prayerTimes[prayerName];
  const isPassed = isPrayerPassed(prayerTime);
  
  return (
    <Card className={cn(
      "islamic-card transition-all",
      isPassed ? "opacity-70" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={cn(
            "text-lg font-semibold",
            isPassed ? "text-islamic-gray" : "text-islamic-blue"
          )}>
            {mosque.name}
          </h3>
          <Badge variant={isPassed ? "outline" : "default"} className={cn(
            isPassed ? "bg-muted text-muted-foreground" : "bg-islamic-green"
          )}>
            {prayerTime}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-islamic-gray mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="truncate">{mosque.address}</span>
        </div>
        
        <div className="flex items-center text-sm mb-3">
          <Clock size={16} className="mr-1 text-islamic-green" />
          <span className={isPassed ? "text-islamic-gray" : "text-islamic-blue"}>
            {selectedPrayer.name}: {prayerTime}
            {isPassed && " (Passed)"}
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
        >
          Directions
        </Button>
        <Button
          variant="default"
          size="sm"
          className="w-1/2 bg-islamic-green hover:bg-islamic-light-green"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MosqueCard;
