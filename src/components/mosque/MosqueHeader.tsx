
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MosqueData } from '@/contexts/prayer/types';

interface MosqueHeaderProps {
  mosque: MosqueData;
  favorite: boolean;
  onFavoriteToggle: () => void;
}

const MosqueHeader: React.FC<MosqueHeaderProps> = ({ mosque, favorite, onFavoriteToggle }) => {
  const navigate = useNavigate();

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
          onClick={onFavoriteToggle}
          className={cn(
            "text-2xl",
            favorite ? "text-islamic-green" : "text-islamic-gray"
          )}
        >
          <Heart className={cn("h-6 w-6", favorite ? "fill-islamic-green" : "")} />
        </Button>
      </div>
    </>
  );
};

export default MosqueHeader;
