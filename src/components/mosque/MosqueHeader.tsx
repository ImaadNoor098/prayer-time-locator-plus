
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MosqueData } from '@/contexts/prayer/types';
import { usePrayer } from '@/contexts/prayer';
import { useAuth } from '@/contexts/AuthContext';
import UnfavoriteConfirmation from './UnfavoriteConfirmation';
import FavoriteAuthCheck from '../FavoriteAuthCheck';

interface MosqueHeaderProps {
  mosque: MosqueData;
  favorite: boolean;
  onFavoriteToggle: () => void;
}

const MosqueHeader: React.FC<MosqueHeaderProps> = ({ mosque, favorite, onFavoriteToggle }) => {
  const navigate = useNavigate();
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
          onClick={handleFavoriteClick}
          className="text-2xl text-islamic-gray"
        >
          <Heart className={cn(
            "h-6 w-6", 
            favorite && isAuthenticated ? "fill-islamic-green text-islamic-green" : ""
          )} />
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

export default MosqueHeader;
