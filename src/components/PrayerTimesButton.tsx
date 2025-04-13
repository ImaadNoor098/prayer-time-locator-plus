
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
        <Clock className="h-5 w-5 mr-2" />
        <span>Prayer Times</span>
      </div>
    </Button>
  );
};

export default PrayerTimesButton;
