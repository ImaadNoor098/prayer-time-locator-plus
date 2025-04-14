
import React from 'react';
import { MosqueData } from '@/contexts/prayer/types';

interface MosqueImageProps {
  mosque: MosqueData;
}

const MosqueImage: React.FC<MosqueImageProps> = ({ mosque }) => {
  return (
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
  );
};

export default MosqueImage;
