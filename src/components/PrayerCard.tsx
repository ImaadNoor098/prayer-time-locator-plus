
import React from 'react';
import { PrayerTime } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  prayer: PrayerTime;
  isSelected?: boolean;
  onClick: () => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, isSelected = false, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 islamic-card",
        isSelected ? "ring-2 ring-islamic-green shadow-lg" : ""
      )}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-4xl mb-2">{prayer.icon}</div>
        <h3 className="text-xl font-semibold text-islamic-green mb-1">{prayer.name}</h3>
        <p className="text-sm text-islamic-gray">{prayer.description}</p>
      </CardContent>
    </Card>
  );
};

export default PrayerCard;
