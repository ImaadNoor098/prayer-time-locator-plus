
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Heart, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import CountdownTimer from './salah/CountdownTimer';

const MosqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mosques, selectedPrayer, isPrayerPassed, isPrayerActive, toggleFavorite, isFavorite, formatTimeToAmPm } = usePrayer();
  
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
  const isActive = isPrayerActive(prayerTime);
  const favorite = isFavorite(mosque.id);
  
  const handleFavoriteToggle = () => {
    toggleFavorite(mosque.id);
  };
  
  const handleDirections = () => {
    if (mosque.googleMapsLink) {
      window.open(mosque.googleMapsLink, '_blank');
    } else if (mosque.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.coordinates.latitude},${mosque.coordinates.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${mosque.name} ${mosque.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
    }
  };

  // Function to get the countdown end time
  const getCountdownEndTime = (time: string, isPrayerActive: boolean) => {
    const [hours, minutes] = time.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes, 0);
    
    // If prayer is active, countdown ends 5 minutes after prayer time
    if (isPrayerActive) {
      return new Date(endTime.getTime() + 5 * 60 * 1000);
    }
    
    // For upcoming prayers, countdown ends at prayer time
    return endTime;
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
              <div className="w-full">
                <h3 className="font-medium mb-2">Prayer Times</h3>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-islamic-green/20">
                  {Object.entries(mosque.prayerTimes).map(([prayer, time], index) => {
                    const isCurrentPrayer = prayer === prayerName;
                    const isPrayerTimeOver = isPrayerPassed(time);
                    const isPrayerTimeActive = isPrayerActive(time);
                    const formattedTime = formatTimeToAmPm(time);
                    const isLastItem = index === Object.entries(mosque.prayerTimes).length - 1;
                    
                    // Calculate if we should show a countdown
                    const shouldShowCountdown = isPrayerTimeActive || 
                      (!isPrayerTimeOver && prayer !== "sunrise");
                    
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
                             prayer === 'isha' ? '🌙' : '🕌'}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{prayer}</p>
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
