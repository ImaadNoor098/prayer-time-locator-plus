
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrayerTimesButtonProps {
  className?: string;
}

const PrayerTimesButton: React.FC<PrayerTimesButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <Button
      onClick={() => navigate('/salah-times')}
      className={cn(
        "bg-islamic-gold hover:bg-islamic-gold/90 text-black font-medium px-4 py-2 rounded-md shadow-md transform transition-transform hover:scale-105",
        className
      )}
    >
      <div className="flex items-center">
        <div className="mr-2 relative">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-lg" role="img" aria-label="Prayer">🧎‍♂️</span>
          </div>
        </div>
        <span>Prayer Times</span>
      </div>
    </Button>
  );
};

export default PrayerTimesButton;
