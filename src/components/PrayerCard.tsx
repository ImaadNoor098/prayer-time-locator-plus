
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
        "cursor-pointer group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900/50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
        "border-2",
        isSelected 
          ? "border-islamic-green" 
          : "border-transparent hover:border-islamic-green/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-islamic-cream/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
        <div className="mb-4 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-islamic-cream to-white dark:from-gray-800 dark:to-gray-700 shadow-md group-hover:scale-105 transition-transform duration-300">
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">{prayer.icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream mb-1 transition-colors duration-300 group-hover:text-islamic-green">
          {prayer.name}
        </h3>
        <p className="text-sm text-islamic-gray dark:text-gray-400 min-h-[40px]">
          {prayer.description}
        </p>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-islamic-green scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left"></div>
    </Card>
  );
};

export default PrayerCard;
