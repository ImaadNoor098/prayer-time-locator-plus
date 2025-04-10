
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Heart, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MosqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mosques, selectedPrayer, isPrayerPassed, toggleFavorite, isFavorite } = usePrayer();
  
  const mosque = mosques.find(m => m.id === id);
  
  if (!mosque || !selectedPrayer) {
    return (
      <div className="p-4 text-center">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <p>Mosque not found</p>
      </div>
    );
  }
  
  const prayerName = selectedPrayer.name.toLowerCase();
  const prayerTime = mosque.prayerTimes[prayerName];
  const isPassed = isPrayerPassed(prayerTime);
  const favorite = isFavorite(mosque.id);
  
  const handleFavoriteToggle = () => {
    toggleFavorite(mosque.id);
  };
  
  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.coordinates.latitude},${mosque.coordinates.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 pb-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-4 text-islamic-blue dark:text-islamic-cream"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-islamic-blue">{mosque.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className={cn(
            "text-2xl",
            favorite ? "text-islamic-green" : "text-islamic-gray"
          )}
        >
          <Heart className={cn("h-6 w-6", favorite ? "fill-islamic-green" : "")} />
        </Button>
      </div>
      
      <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-muted">
        {mosque.images && mosque.images.length > 0 ? (
          <img 
            src={mosque.images[0]} 
            alt={mosque.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-islamic-gray">
            No image available
          </div>
        )}
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-islamic-blue">Mosque Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-islamic-green mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-islamic-gray">{mosque.address}</p>
                <p className="text-islamic-gray text-sm">{mosque.distance.toFixed(1)} km away</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-2 text-islamic-green mt-0.5" />
              <div>
                <h3 className="font-medium">Prayer Times</h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(mosque.prayerTimes).map(([prayer, time]) => {
                    const isCurrentPrayer = prayer === prayerName;
                    const isPrayerTimeOver = isPrayerPassed(time);
                    
                    return (
                      <div 
                        key={prayer}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md relative overflow-hidden",
                          isCurrentPrayer ? "bg-islamic-green/10" : "",
                          isPrayerTimeOver ? "bg-gray-200 dark:bg-gray-800/70 opacity-80" : ""
                        )}
                      >
                        {isPrayerTimeOver && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-0 w-[200%] h-[1px] bg-islamic-gray/80 dark:bg-islamic-cream/80 rotate-[-35deg] transform origin-top-left translate-x-[-20%] translate-y-[50%] border-t border-islamic-gray/80 dark:border-islamic-cream/80"></div>
                          </div>
                        )}
                        <span className="capitalize">{prayer}</span>
                        <Badge variant={isPrayerTimeOver ? "outline" : "default"}>
                          {time}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {mosque.facilities && (
              <div className="flex items-start">
                <div className="h-5 w-5 mr-2 text-islamic-green mt-0.5 flex items-center justify-center">🏢</div>
                <div>
                  <h3 className="font-medium">Facilities</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mosque.facilities.map((facility, index) => (
                      <Badge key={index} variant="secondary">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button 
          onClick={handleDirections}
          className="flex-1 bg-islamic-blue hover:bg-islamic-blue/80"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Directions
        </Button>
        <Button 
          onClick={handleFavoriteToggle}
          variant={favorite ? "default" : "outline"}
          className={cn(
            "flex-1",
            favorite 
              ? "bg-islamic-green hover:bg-islamic-green/80" 
              : "border-islamic-green text-islamic-green hover:bg-islamic-green/10"
          )}
        >
          <Heart className={cn("mr-2 h-4 w-4", favorite ? "fill-current" : "")} />
          {favorite ? "Favorited" : "Add to Favorites"}
        </Button>
      </div>
    </div>
  );
};

export default MosqueDetail;
