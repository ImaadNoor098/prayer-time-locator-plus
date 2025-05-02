
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MosqueData } from '@/contexts/prayer/types';
import { usePrayer } from '@/contexts/prayer';
import { useAuth } from '@/contexts/AuthContext';
import UnfavoriteConfirmation from './UnfavoriteConfirmation';
import FavoriteAuthCheck from '../FavoriteAuthCheck';

interface MosqueActionsProps {
  mosque: MosqueData;
  favorite: boolean;
  onFavoriteToggle: () => void;
  onDirections: () => void;
}

const MosqueActions: React.FC<MosqueActionsProps> = ({ 
  mosque, 
  favorite, 
  onFavoriteToggle, 
  onDirections 
}) => {
  const { showUnfavoriteConfirmation, unfavoriteDialogState, hideUnfavoriteConfirmation } = usePrayer();
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      // Show auth dialog if not logged in
      setShowAuthDialog(true);
      return;
    }

    if (favorite) {
      // Show confirmation dialog if removing from favorites
      showUnfavoriteConfirmation(mosque);
    } else {
      // Add to favorites directly
      onFavoriteToggle();
    }
  };

  // Handle confirmation of unfavoriting
  const handleConfirmUnfavorite = () => {
    onFavoriteToggle();
    hideUnfavoriteConfirmation();
  };

  // Handle successful authentication
  const handleAuthenticated = () => {
    onFavoriteToggle();
  };

  // Check if this mosque is the one in the unfavorite dialog
  const isCurrentMosqueInDialog = unfavoriteDialogState.mosque?.id === mosque.id;

  return (
    <>
      <div className="flex gap-4">
        <Button 
          onClick={onDirections}
          className="flex-1 bg-islamic-blue hover:bg-islamic-blue/80"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Directions
        </Button>
        <Button 
          onClick={handleFavoriteClick}
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

      {/* Only render the confirmation dialog if this mosque is the one being unfavorited */}
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

export default MosqueActions;
