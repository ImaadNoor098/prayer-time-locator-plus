
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MosqueData } from '@/contexts/prayer/types';
import { usePrayer } from '@/contexts/prayer';
import UnfavoriteConfirmation from './UnfavoriteConfirmation';

interface MosqueHeaderProps {
  mosque: MosqueData;
  favorite: boolean;
  onFavoriteToggle: () => void;
}

const MosqueHeader: React.FC<MosqueHeaderProps> = ({ mosque, favorite, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const { showUnfavoriteConfirmation, unfavoriteDialogState, hideUnfavoriteConfirmation } = usePrayer();

  const handleFavoriteClick = () => {
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
          className={cn(
            "text-2xl",
            favorite ? "text-islamic-green" : "text-islamic-gray"
          )}
        >
          <Heart className={cn("h-6 w-6", favorite ? "fill-islamic-green" : "")} />
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
    </>
  );
};

export default MosqueHeader;
