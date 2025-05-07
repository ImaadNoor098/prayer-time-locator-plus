
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import MosqueHeader from './mosque/MosqueHeader';
import MosqueImage from './mosque/MosqueImage';
import MosqueInformation from './mosque/MosqueInformation';
import MosquePrayerTimes from './mosque/MosquePrayerTimes';
import MosqueActions from './mosque/MosqueActions';

const MosqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    mosques, 
    selectedPrayer, 
    isPrayerPassed, 
    isPrayerActive, 
    toggleFavorite, 
    isFavorite, 
    formatTimeToAmPm 
  } = usePrayer();
  
  const mosque = mosques.find(m => m.id === id);
  
  if (!mosque || !selectedPrayer) {
    return (
      <div className="p-4 text-center">
        <p>Mosque not found</p>
      </div>
    );
  }
  
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
  
  return (
    <div className="pb-8">
      <MosqueHeader 
        mosque={mosque} 
        favorite={favorite} 
        onFavoriteToggle={handleFavoriteToggle} 
      />
      
      <MosqueImage mosque={mosque} />
      
      {/* General prayer times disclaimer */}
      <Alert className="mb-4 bg-islamic-gold/10 border-islamic-gold">
        <Info className="h-4 w-4 text-islamic-gray" />
        <AlertDescription className="text-islamic-gray text-sm">
          Prayer times are being verified for accuracy. Please confirm with the mosque directly for the most current times.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-islamic-blue">Mosque Information</h2>
          
          <div className="space-y-3">
            <MosqueInformation mosque={mosque} />
            
            <MosquePrayerTimes 
              mosque={mosque} 
              selectedPrayer={selectedPrayer} 
              isPrayerPassed={isPrayerPassed} 
              isPrayerActive={isPrayerActive} 
              formatTimeToAmPm={formatTimeToAmPm} 
            />
          </div>
        </CardContent>
      </Card>
      
      <MosqueActions 
        mosque={mosque} 
        favorite={favorite} 
        onFavoriteToggle={handleFavoriteToggle} 
        onDirections={handleDirections} 
      />
    </div>
  );
};

export default MosqueDetail;
