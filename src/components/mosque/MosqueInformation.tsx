
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MosqueData } from '@/contexts/prayer/types';

interface MosqueInformationProps {
  mosque: MosqueData;
}

const MosqueInformation: React.FC<MosqueInformationProps> = ({ mosque }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start">
        <MapPin className="h-5 w-5 mr-2 text-islamic-green mt-0.5" />
        <div>
          <h3 className="font-medium">Address</h3>
          <p className="text-islamic-gray">{mosque.address}</p>
          <p className="text-islamic-gray text-sm">{mosque.distance.toFixed(1)} km away</p>
        </div>
      </div>
      
      {mosque.facilities && (
        <div className="flex items-start">
          <div className="h-5 w-5 mr-2 text-islamic-green mt-0.5 flex items-center justify-center">🏢</div>
          <div>
            <h3 className="font-medium">Facilities</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {mosque.facilities.map((facility, index) => (
                <Badge key={index} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosqueInformation;
