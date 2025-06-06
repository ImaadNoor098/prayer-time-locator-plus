
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endTime: Date;
  type: 'active' | 'upcoming';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, type }) => {
  const [minutesLeft, setMinutesLeft] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsVisible(false);
        return 0;
      }

      // Only show the countdown if less than 60 minutes are left
      const minutes = Math.floor(difference / (1000 * 60));
      
      setIsVisible(minutes < 60);
      return minutes;
    };

    setMinutesLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setMinutesLeft(calculateTimeLeft());
    }, 60000); // Update every minute instead of every second
    
    return () => clearInterval(timer);
  }, [endTime]);

  if (!isVisible) {
    return null;
  }

  // Format to show "X minutes left"
  const formattedTime = `${minutesLeft} minutes left`;

  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md text-sm font-bold flex items-center shadow-sm border",
      type === 'active' 
        ? "bg-islamic-green/20 text-islamic-green border-islamic-green/30" 
        : "bg-islamic-blue/20 text-islamic-blue border-islamic-blue/30"
    )}>
      <span className="inline-block font-mono tracking-wider">
        {formattedTime}
      </span>
    </div>
  );
};

export default CountdownTimer;
