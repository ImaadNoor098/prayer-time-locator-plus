import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import MosqueCard from '@/components/MosqueCard';
import FilterBar from '@/components/FilterBar';
import CurrentTime from '@/components/CurrentTime';
import SearchBar from '@/components/SearchBar';
import BottomBar from '@/components/BottomBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MosqueList: React.FC = () => {
  const { selectedPrayer, getFilteredMosques, saveScrollPosition, getSavedScrollPosition, trackPageVisit } = usePrayer();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  
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
  
  // If no prayer is selected, render nothing while redirecting
  if (!selectedPrayer) {
    return null;
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
            
            <Button
              onClick={() => navigate('/')}
              className="bg-islamic-gold hover:bg-islamic-gold/90 text-black font-medium px-4 py-2 rounded-md shadow-md transform transition-transform hover:scale-105"
            >
              Select Prayer
            </Button>
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
