
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CurrentTime: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-center p-4">
      <div className="flex flex-col items-center">
        <div className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-1">
          Current Time
        </div>
        <div className="text-2xl font-semibold text-islamic-blue dark:text-islamic-cream animate-pulse-gentle">
          {format(time, 'h:mm:ss a')}
        </div>
        <div className="text-sm text-islamic-gray dark:text-islamic-cream/70 mt-1">
          {format(time, 'EEEE, MMMM do, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default CurrentTime;
