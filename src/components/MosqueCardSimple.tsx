
import React, { useState } from 'react';
import { Mosque } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const favorite = isFavorite(mosque.id);
  
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (mosque.contact?.phone) {
      window.location.href = `tel:${mosque.contact.phone}`;
    } else {
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
  
  const showDistance = userLocation && 
    mosque.distance !== undefined && 
    mosque.distance < 999 && 
    !location.state?.fromBottomBar;
  
  return (
    <>
      <Card 
        className={cn(
          "cursor-pointer group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900/50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
          "border-2 border-transparent hover:border-islamic-green/50"
        )}
        onClick={handleDetails}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-islamic-cream/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="p-5 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-islamic-cream to-white dark:from-gray-800 dark:to-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl">🕌</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-islamic-blue dark:text-islamic-cream group-hover:text-islamic-green transition-colors duration-300">
                      {mosque.name}
                    </h3>
                    {showDistance && (
                      <Badge variant="outline" className="mt-1 text-xs border-islamic-green text-islamic-green bg-islamic-green/5">
                        <MapPin className="h-3 w-3 mr-1" />
                        {formatDistance(mosque.distance)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 line-clamp-2 mb-4 leading-relaxed">
                {mosque.address}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-islamic-gray/60 dark:text-islamic-cream/50">
              Click to view details
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 p-0 rounded-full transition-all duration-300",
                  "hover:bg-islamic-green/10 hover:scale-110"
                )}
                onClick={handleFavoriteToggle}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    favorite && isAuthenticated 
                      ? "fill-islamic-green text-islamic-green scale-110" 
                      : "text-islamic-gray dark:text-islamic-cream/70 group-hover:text-islamic-green"
                  )} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 p-0 rounded-full transition-all duration-300",
                  hasPhone 
                    ? "hover:bg-islamic-blue/10 hover:scale-110 text-islamic-blue dark:text-islamic-cream/70" 
                    : "opacity-50 cursor-not-allowed"
                )}
                onClick={handleCall}
                disabled={!hasPhone}
                title={hasPhone ? "Call mosque" : "No phone number available"}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
        
        <div className="absolute bottom-0 left-0 h-1 w-full bg-islamic-green scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left"></div>
      </Card>
      
      <FavoriteAuthCheck 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthenticated={handleAuthenticated}
      />
    </>
  );
};

export default MosqueCardSimple;
