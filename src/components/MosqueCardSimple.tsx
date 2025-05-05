
import React, { useState } from 'react';
import { Mosque } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePrayer } from '@/contexts/prayer';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteAuthCheck from './FavoriteAuthCheck';

interface MosqueCardSimpleProps {
  mosque: Mosque;
}

const MosqueCardSimple: React.FC<MosqueCardSimpleProps> = ({ mosque }) => {
  const { toggleFavorite, isFavorite } = usePrayer();
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
  
  return (
    <>
      <Card 
        className="islamic-card transition-all cursor-pointer hover:shadow-md"
        onClick={handleDetails}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-islamic-blue dark:text-islamic-cream mb-2">
                {mosque.name}
              </h3>
              <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 line-clamp-2">
                {mosque.address}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
