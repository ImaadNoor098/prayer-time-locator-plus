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
import { ArrowLeft, AlertTriangle, Calendar } from 'lucide-react';
import useSalahTimes from '@/hooks/useSalahTimes';
import { ThemeToggle } from '@/components/ThemeToggle';

const MosqueList: React.FC = () => {
  const { 
    prayers, 
    selectedPrayer, 
    getFilteredMosques, 
    saveScrollPosition, 
    getSavedScrollPosition, 
    trackPageVisit, 
    setSelectedPrayer 
  } = usePrayer();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  
  // Get current prayer based on prayer times
  const { currentTime, isPrayerTime, salahTimes } = useSalahTimes(new Date());
  const [currentActivePrayer, setCurrentActivePrayer] = useState<string | null>(null);
  
  // Determine the current active prayer
  useEffect(() => {
    if (!salahTimes) return;
    
    const prayerMap: Record<string, string> = {
      "fajr": "Fajr",
      "dhuhr": "Dhuhr",
      "asr": "Asr",
      "maghrib": "Maghrib",
      "isha": "Isha"
    };
    
    // Check which prayer is active now
    for (const [key, name] of Object.entries(prayerMap)) {
      if (isPrayerTime(key)) {
        // If prayer is currently active, set it
        const matchingPrayer = prayers.find(p => p.name === name);
        if (matchingPrayer && !selectedPrayer) {
          setSelectedPrayer(matchingPrayer);
          setCurrentActivePrayer(name);
        }
        break;
      }
    }
    
    // If no prayer is active and no prayer is selected, default to next upcoming prayer
    if (!selectedPrayer && !currentActivePrayer) {
      // This is simplified logic - in a real app, you'd determine the next prayer more precisely
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
  
  // Use useEffect to handle navigation and scrolling behavior
  useEffect(() => {
    if (!selectedPrayer) {
      navigate('/');
      return;
    }
    
    const path = location.pathname;
    
    // Track this page visit for double-tap detection
    trackPageVisit(path);
    
    // On first render, decide whether to restore position or start at top
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      
      // Get saved position for this page
      const savedPosition = getSavedScrollPosition(path);
      
      // If this is direct navigation (not from bottom bar), start from top
      // Otherwise restore previous position if available
      if (savedPosition > 0 && location.state?.fromBottomBar) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
        }, 100);
      } else {
        // Scroll to top for first visit or non-bottom-bar navigation
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }
    }
    
    // Save scroll position when leaving the page
    return () => {
      saveScrollPosition(path, window.scrollY);
    };
  }, [selectedPrayer, navigate, location.pathname, getSavedScrollPosition, saveScrollPosition, trackPageVisit, location.state]);
  
  // Handle Select Prayer button click
  const handleSelectPrayerClick = () => {
    // Navigate to home page to select a new prayer
    navigate('/', { state: { selectingNewPrayer: true } });
  };
  
  // If coming from mosque button with no prayer selected, show message
  if (!selectedPrayer) {
    return (
      <div className="min-h-screen islamic-pattern-bg pb-20" ref={pageRef}>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream">
              Mosque List
            </h1>
            <ThemeToggle />
          </div>
          
          <div className="bg-white dark:bg-card p-6 rounded-lg shadow islamic-card mb-4">
            <p className="text-center mb-4">Please select a prayer to see mosque timings</p>
            <div className="flex justify-center">
              <Button
                onClick={handleSelectPrayerClick}
                className="bg-islamic-gold hover:bg-islamic-gold/90 text-black font-medium px-4 py-2 rounded-md shadow-md"
              >
                Select Prayer
              </Button>
            </div>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }
  
  const mosques = getFilteredMosques();
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20" ref={pageRef}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-2">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-islamic-blue dark:text-islamic-cream"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSelectPrayerClick}
                className="bg-islamic-gold hover:bg-islamic-gold/90 text-black font-medium px-4 py-2 rounded-md shadow-md transform transition-transform hover:scale-105"
              >
                Select Prayer
              </Button>
              
              <ThemeToggle variant="button" />
            </div>
          </div>
          
          <header className="mb-2">
            <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream flex items-center">
              <span className="mr-2">{selectedPrayer.icon}</span>
              {selectedPrayer.name} Prayer Times
            </h1>
            <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
              Find mosques offering {selectedPrayer.name} prayer
            </p>
            
            <SearchBar />
          </header>
        </div>
        
        <CurrentTime />
        
        {/* Eid ul-Adha Date Banner - Only show when Eid ul-Adha prayer is selected */}
        {selectedPrayer.name === 'Eid ul-Adha' && (
          <Alert className="mb-4 bg-islamic-gold/20 border-islamic-gold border-2">
            <Calendar className="h-5 w-5 text-islamic-blue" />
            <AlertDescription className="text-black">
              <div className="font-bold text-lg mb-2 text-islamic-blue">
                🌙 EID UL-ADHA 🌙
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-islamic-blue">This Year:</span>
                  <span className="px-3 py-1 rounded-full font-bold text-white bg-islamic-green">
                    7th June 2025
                  </span>
                </div>
                <div className="text-sm text-islamic-gray">
                  Festival of Sacrifice - Find mosques offering Eid prayers
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Distance Calculation Notice */}
        <Alert className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Notice:</strong> Distance calculations may be inaccurate and are currently under development. 
            We apologize for any inconvenience and are working to improve this feature. 
            In the meantime, you can use the <span className="bg-islamic-blue text-white px-2 py-1 rounded text-sm font-medium">Directions</span> button 
            on each mosque card to find the accurate way to the mosque.
          </AlertDescription>
        </Alert>
        
        <FilterBar />
        
        <div className="pt-4 space-y-4">
          {mosques.length > 0 ? (
            mosques.map((mosque) => (
              <MosqueCard key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
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
