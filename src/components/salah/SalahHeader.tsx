
import React from 'react';
import { format } from 'date-fns';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SalahHeaderProps {
  currentTime: Date;
}

const SalahHeader: React.FC<SalahHeaderProps> = ({ currentTime }) => {
  const navigate = useNavigate();

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-islamic-blue dark:text-islamic-cream"
        >
          <ArrowLeftCircle className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-islamic-blue dark:text-islamic-cream text-center mb-2">
        SALAH TIMES
      </h1>
      <p className="text-islamic-gray dark:text-islamic-cream/70 text-center mb-6">
        Prayer times for Bareilly according to Hanafi School of Thought
      </p>
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-islamic-blue/10 dark:bg-islamic-cream/10 rounded-full px-4 py-2">
          <span className="text-islamic-blue dark:text-islamic-cream font-medium">
            {format(currentTime, 'h:mm a')}
          </span>
        </div>
      </div>
    </header>
  );
};

export default SalahHeader;
