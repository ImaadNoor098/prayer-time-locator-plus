
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endTime: Date;
  type: 'active' | 'upcoming';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, type }) => {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsVisible(false);
        return { minutes: 0, seconds: 0 };
      }

      // Only show the countdown if less than 60 minutes are left
      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setIsVisible(minutes < 60);
      return { minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);

  if (!isVisible) {
    return null;
  }

  // Format the time to include a minus symbol with better visibility
  const formattedTime = `-${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`;

  return (
    <div className={cn(
      "px-3 py-1.5 rounded-md text-sm font-bold flex items-center shadow-sm border",
      type === 'active' 
        ? "bg-islamic-green/20 text-islamic-green border-islamic-green/30 animate-pulse" 
        : "bg-islamic-blue/20 text-islamic-blue border-islamic-blue/30"
    )}>
      <span className="inline-block font-mono tracking-wider">
        {formattedTime}
      </span>
    </div>
  );
};

export default CountdownTimer;
