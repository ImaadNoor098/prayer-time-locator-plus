
import React from 'react';
import { format } from 'date-fns';
import { ArrowLeftCircle, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      
      {/* Eid Information Banner */}
      <Alert className="mb-6 bg-islamic-gold/20 border-islamic-gold border-2">
        <Calendar className="h-5 w-5 text-islamic-blue" />
        <AlertDescription className="text-black">
          <div className="font-bold text-lg mb-2 text-islamic-blue">🌙 EID PRAYER DATES 2025 🌙</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-islamic-blue">Eid ul-Adha:</span>
              <span className="bg-islamic-green text-white px-3 py-1 rounded-full font-bold">7th June 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-islamic-blue">Eid ul-Fitr:</span>
              <span className="bg-islamic-blue text-white px-3 py-1 rounded-full font-bold">Based on Moon Sighting</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <h1 className="text-3xl font-bold text-islamic-blue dark:text-islamic-cream text-center mb-2">
        SALAH TIMES
      </h1>
      <p className="text-islamic-gray dark:text-islamic-cream/70 text-center mb-2">
        Prayer times for Bareilly
      </p>
      <p className="text-sm text-islamic-blue dark:text-islamic-cream text-center mb-2 font-semibold">
        📅 Timings for the year 2025
      </p>
      
      {/* Highlighted Data Source */}
      <div className="text-center mb-6">
        <Alert className="inline-flex items-center bg-islamic-blue/10 border-islamic-blue border-2 max-w-md mx-auto">
          <ExternalLink className="h-4 w-4 text-islamic-blue mr-2" />
          <AlertDescription className="text-islamic-blue">
            <span className="font-bold">Data Source: </span>
            <a 
              href="https://prayer-times.muslimpro.com/en/find?country_code=IN&country_name=India&city_name=Bareilly&coordinates=28.3670355,79.4304381" 
              className="underline font-bold hover:text-islamic-green transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Muslim Pro
            </a>
          </AlertDescription>
        </Alert>
      </div>
      
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
