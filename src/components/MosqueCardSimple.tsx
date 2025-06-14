
import React, { useState } from 'react';
import { Mosque } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePrayer } from '@/contexts/prayer';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistance } from '@/utils/distanceUtils';
import FavoriteAuthCheck from './FavoriteAuthCheck';

interface MosqueCardSimpleProps {
  mosque: Mosque;
}

const MosqueCardSimple: React.FC<MosqueCardSimpleProps> = ({ mosque }) => {
  const { toggleFavorite, isFavorite, userLocation } = usePrayer();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const favorite = isFavorite(mosque.id);
  
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if phone property exists in the mosque object
    if (mosque.contact?.phone) {
      window.location.href = `tel:${mosque.contact.phone}`;
    } else {
      // If no phone number is available, show a message
      alert('No phone number available for this mosque');
    }
  };
  
  const handleDetails = () => {
    navigate(`/mosque/${mosque.id}`);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    toggleFavorite(mosque.id);
  };
  
  const handleAuthenticated = () => {
    toggleFavorite(mosque.id);
  };
  
  const hasPhone = mosque.contact?.phone !== undefined && mosque.contact.phone !== '';
  const showDistance = userLocation && mosque.distance !== undefined && mosque.distance < 999;
  
  return (
    <>
      <Card 
        className="islamic-card transition-all cursor-pointer hover:shadow-md"
        onClick={handleDetails}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-islamic-blue dark:text-islamic-cream">
                  {mosque.name}
                </h3>
                {showDistance && (
                  <Badge variant="outline" className="ml-2 text-xs border-islamic-green text-islamic-green">
                    <MapPin className="h-3 w-3 mr-1" />
                    {formatDistance(mosque.distance)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 line-clamp-2">
                {mosque.address}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={handleFavoriteToggle}
              title={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-colors",
                  favorite && isAuthenticated ? "fill-islamic-green text-islamic-green" : "text-islamic-gray dark:text-islamic-cream/70"
                )} 
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-islamic-blue dark:text-islamic-cream/70"
              onClick={handleCall}
              disabled={!hasPhone}
              title={hasPhone ? "Call mosque" : "No phone number available"}
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Auth check dialog */}
      <FavoriteAuthCheck 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthenticated={handleAuthenticated}
      />
    </>
  );
};

export default MosqueCardSimple;
