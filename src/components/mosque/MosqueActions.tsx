
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MosqueData } from '@/contexts/prayer/types';

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
  return (
    <div className="flex gap-4">
      <Button 
        onClick={onDirections}
        className="flex-1 bg-islamic-blue hover:bg-islamic-blue/80"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Directions
      </Button>
      <Button 
        onClick={onFavoriteToggle}
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
  );
};

export default MosqueActions;
