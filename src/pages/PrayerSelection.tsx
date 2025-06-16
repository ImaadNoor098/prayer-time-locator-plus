
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import PrayerCard from '@/components/PrayerCard';
import CurrentTime from '@/components/CurrentTime';
import BottomBar from '@/components/BottomBar';
import PrayerTimesButton from '@/components/PrayerTimesButton';
import BackgroundSelector from '@/components/BackgroundSelector';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const PrayerSelection: React.FC = () => {
  const { 
    prayers, 
    setSelectedPrayer
  } = usePrayer();
  const navigate = useNavigate();
  const { selectedBackground, setSelectedBackground, currentBackgroundClass } = useBackgroundSelector();
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  
  const handlePrayerSelect = (prayer: any) => {
    setSelectedPrayer(prayer);
    navigate('/mosques');
  };

  const handleCall = () => {
    window.location.href = 'tel:9548160990';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919548160990', '_blank');
  };

  const handleBackgroundChange = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    // Automatically close the background selector after selection
    setShowBackgroundSelector(false);
  };
  
  return (
    <div className={`min-h-screen ${currentBackgroundClass} pb-20`}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-islamic-blue dark:text-islamic-cream mr-4">
              PRAY GO
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
              className="bg-white/80 hover:bg-white border-islamic-blue/20"
            >
              {showBackgroundSelector ? (
                <X className="h-4 w-4" />
              ) : (
                <Palette className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <p className="text-islamic-gray dark:text-islamic-cream/70">
            Select a prayer to find mosques and prayer times
          </p>
          
          {/* Contact Note */}
          <div className="mt-4 p-3 bg-white/60 dark:bg-islamic-cream/10 rounded-lg border border-islamic-blue/20 backdrop-blur-sm">
            <p className="text-sm text-islamic-blue dark:text-islamic-cream">
              To Add Mosque Please{' '}
              <button 
                onClick={handleCall}
                className="underline hover:text-islamic-green font-medium transition-colors"
              >
                Call
              </button>
              {' '}Or{' '}
              <button 
                onClick={handleWhatsApp}
                className="underline hover:text-islamic-green font-medium transition-colors"
              >
                WhatsApp
              </button>
            </p>
          </div>
        </header>

        {/* Background Selector */}
        {showBackgroundSelector && (
          <div className="mb-6">
            <BackgroundSelector
              currentBackground={selectedBackground}
              onBackgroundChange={handleBackgroundChange}
            />
          </div>
        )}
        
        <div className="flex justify-center mb-8">
          <PrayerTimesButton />
        </div>
        
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
      
      <BottomBar />
    </div>
  );
};

export default PrayerSelection;
