import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import MosqueCard from '@/components/MosqueCard';
import FilterBar from '@/components/FilterBar';
import CurrentTime from '@/components/CurrentTime';
import SearchBar from '@/components/SearchBar';
import BottomBar from '@/components/BottomBar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, Calendar, Info } from 'lucide-react';
import useSalahTimes from '@/hooks/useSalahTimes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const MosqueList: React.FC = () => {
  const { 
    prayers, 
    selectedPrayer, 
    getFilteredMosques, 
    saveScrollPosition, 
    getSavedScrollPosition, 
    trackPageVisit, 
    setSelectedPrayer,
    currentFilter,
    setCurrentFilter
  } = usePrayer();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  const { currentBackgroundClass } = useBackgroundSelector();
  
  const { currentTime, isPrayerTime, salahTimes } = useSalahTimes(new Date());
  const [currentActivePrayer, setCurrentActivePrayer] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentFilter('earliest');
  }, [setCurrentFilter]);
  
  useEffect(() => {
    if (!salahTimes) return;
    
    const prayerMap: Record<string, string> = {
      "fajr": "Fajr",
      "dhuhr": "Dhuhr",
      "asr": "Asr",
      "maghrib": "Maghrib",
      "isha": "Isha"
    };
    
    for (const [key, name] of Object.entries(prayerMap)) {
      if (isPrayerTime(key)) {
        const matchingPrayer = prayers.find(p => p.name === name);
        if (matchingPrayer && !selectedPrayer) {
          setSelectedPrayer(matchingPrayer);
          setCurrentActivePrayer(name);
        }
        break;
      }
    }
    
    if (!selectedPrayer && !currentActivePrayer) {
      const now = new Date();
      const currentHour = now.getHours();
      
      let defaultPrayer;
      if (currentHour < 12) defaultPrayer = prayers.find(p => p.name === "Dhuhr");
      else if (currentHour < 15) defaultPrayer = prayers.find(p => p.name === "Asr");
      else if (currentHour < 18) defaultPrayer = prayers.find(p => p.name === "Maghrib");
      else defaultPrayer = prayers.find(p => p.name === "Isha");
      
      if (defaultPrayer) {
        setSelectedPrayer(defaultPrayer);
      }
    }
  }, [salahTimes, isPrayerTime, prayers, selectedPrayer, setSelectedPrayer]);
  
  useEffect(() => {
    if (!selectedPrayer) {
      navigate('/');
      return;
    }
    
    const path = location.pathname;
    
    trackPageVisit(path);
    
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      
      const savedPosition = getSavedScrollPosition(path);
      
      if (savedPosition > 0 && location.state?.fromBottomBar) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
        }, 100);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }
    }
    
    return () => {
      saveScrollPosition(path, window.scrollY);
    };
  }, [selectedPrayer, navigate, location.pathname, getSavedScrollPosition, saveScrollPosition, trackPageVisit, location.state]);
  
  const handleSelectPrayerClick = () => {
    navigate('/', { state: { selectingNewPrayer: true } });
  };
  
  if (!selectedPrayer) {
    return (
      <div className={`min-h-screen ${currentBackgroundClass} pb-20`} ref={pageRef}>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-islamic-blue to-islamic-green bg-clip-text text-transparent">
              Mosque List
            </h1>
            <ThemeToggle />
          </div>
          
          <div className="bg-white dark:bg-card p-8 rounded-xl shadow-lg islamic-card mb-4 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-cream to-white dark:from-gray-800 dark:to-gray-700 shadow-md flex items-center justify-center">
                <span className="text-3xl">🕌</span>
              </div>
              <h2 className="text-xl font-semibold text-islamic-blue dark:text-islamic-cream mb-2">
                Select a Prayer
              </h2>
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                Please select a prayer to see mosque timings
              </p>
            </div>
            <Button
              onClick={handleSelectPrayerClick}
              className="bg-gradient-to-r from-islamic-gold to-islamic-gold/90 hover:from-islamic-gold/90 hover:to-islamic-gold text-black font-semibold px-6 py-3 rounded-lg shadow-md transform transition-transform hover:scale-105"
            >
              Select Prayer
            </Button>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }
  
  const mosques = getFilteredMosques();
  
  return (
    <div className={`min-h-screen ${currentBackgroundClass} pb-20`} ref={pageRef}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-3">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-islamic-blue dark:text-islamic-cream hover:bg-islamic-blue/10 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSelectPrayerClick}
                className="bg-gradient-to-r from-islamic-gold to-islamic-gold/90 hover:from-islamic-gold/90 hover:to-islamic-gold text-black font-semibold px-4 py-2 rounded-lg shadow-md transform transition-transform hover:scale-105"
              >
                Select Prayer
              </Button>
              
              <ThemeToggle />
            </div>
          </div>
          
          <header className="mb-4">
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 mr-4 rounded-full bg-gradient-to-br from-islamic-cream to-white dark:from-gray-800 dark:to-gray-700 shadow-md flex items-center justify-center">
                <span className="text-2xl">{selectedPrayer.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-islamic-blue to-islamic-green bg-clip-text text-transparent">
                  {selectedPrayer.name} Prayer Times
                </h1>
                <p className="text-sm text-islamic-gray dark:text-islamic-cream/70">
                  Find mosques offering {selectedPrayer.name} prayer
                </p>
              </div>
            </div>
            
            <SearchBar />
          </header>
        </div>
        
        <CurrentTime />
        
        {/* Eid ul-Fitr Date Banner - Only show when Eid ul-Fitr prayer is selected */}
        {selectedPrayer.name === 'Eid ul-Fitr' && (
          <>
            <Alert className="mb-4 bg-blue-100 border-blue-500 border-2">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-black">
                <div className="font-bold text-lg mb-2 text-blue-600">
                  🔴 EID UL-FITR TIMINGS - YEAR 2025
                </div>
                <div className="text-sm text-blue-700">
                  All Eid ul-Fitr prayer timings shown below are according to the year 2025.
                </div>
              </AlertDescription>
            </Alert>
            <Alert className="mb-4 bg-red-100 border-red-500 border-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-black">
                <div className="font-bold text-lg mb-2 text-red-600">
                  🌙 EID UL-FITR 🌙
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">This Year:</span>
                    <span className="px-3 py-1 rounded-full font-bold text-white bg-red-500">
                      SALAH DONE
                    </span>
                  </div>
                  <div className="text-sm text-red-700">
                    Eid Ul Fitr salah for the year 2025 has been completed
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </>
        )}
        
        {/* Eid ul-Adha Date Banner - Only show when Eid ul-Adha prayer is selected */}
        {selectedPrayer.name === 'Eid ul-Adha' && (
          <>
            <Alert className="mb-4 bg-blue-100 border-blue-500 border-2">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-black">
                <div className="font-bold text-lg mb-2 text-blue-600">
                  🔴 EID UL-ADHA TIMINGS - YEAR 2025
                </div>
                <div className="text-sm text-blue-700">
                  All Eid ul-Adha prayer timings shown below are according to the year 2025.
                </div>
              </AlertDescription>
            </Alert>
            <Alert className="mb-4 bg-red-100 border-red-500 border-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-black">
                <div className="font-bold text-lg mb-2 text-red-600">
                  🌙 EID UL-ADHA 🌙
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">This Year:</span>
                    <span className="px-3 py-1 rounded-full font-bold text-white bg-red-500">
                      SALAH DONE
                    </span>
                  </div>
                  <div className="text-sm text-red-700">
                    Eid Ul Adha salah for the year 2025 has been completed
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </>
        )}
        
        {/* Distance Notice - Shortened and Rectangular */}
        <div className="mb-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
              <div className="font-semibold mb-2 text-orange-900 dark:text-orange-100">Distance Notice:</div>
              <div className="space-y-1">
                <div>Distance calculations are currently under development and may be inaccurate.</div>
                <div>Use the <span className="bg-islamic-blue text-white px-2 py-0.5 rounded text-xs font-medium">Directions</span> button on each mosque card for accurate navigation.</div>
              </div>
            </div>
          </div>
        </div>
        
        <FilterBar />
        
        <div className="pt-6 space-y-4">
          {mosques.length > 0 ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-sm text-islamic-gray dark:text-islamic-cream/70">
                  Found {mosques.length} mosque{mosques.length !== 1 ? 's' : ''} for {selectedPrayer.name} prayer
                </p>
              </div>
              {mosques.map((mosque) => (
                <MosqueCard key={mosque.id} mosque={mosque} />
              ))}
            </>
          ) : (
            <div className="text-center p-12 bg-white dark:bg-card rounded-xl shadow-lg islamic-card">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-cream to-white dark:from-gray-800 dark:to-gray-700 shadow-md flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-islamic-blue dark:text-islamic-cream mb-2">
                No mosques found
              </h3>
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                No mosques found for {selectedPrayer.name} prayer.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default MosqueList;
