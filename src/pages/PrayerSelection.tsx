
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import PrayerCard from '@/components/PrayerCard';
import CurrentTime from '@/components/CurrentTime';

const PrayerSelection: React.FC = () => {
  const { prayers, setSelectedPrayer } = usePrayer();
  const navigate = useNavigate();
  
  const handlePrayerSelect = (prayer: any) => {
    setSelectedPrayer(prayer);
    navigate('/mosques');
  };
  
  return (
    <div className="min-h-screen islamic-pattern-bg">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-islamic-blue dark:text-islamic-cream mb-2">
            Prayer Time Locator
          </h1>
          <p className="text-islamic-gray dark:text-islamic-cream/70">
            Select a prayer to find mosques and prayer times
          </p>
        </header>
        
        <CurrentTime />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {prayers.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              prayer={prayer}
              onClick={() => handlePrayerSelect(prayer)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerSelection;
