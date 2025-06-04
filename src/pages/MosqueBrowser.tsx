
import React, { useEffect } from 'react';
import { usePrayer } from '@/contexts/prayer';
import MosqueCardSimple from '@/components/MosqueCardSimple';
import BottomBar from '@/components/BottomBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import { ArrowLeft } from 'lucide-react';

const MosqueBrowser: React.FC = () => {
  const { getFilteredMosques, trackPageVisit, saveScrollPosition, getSavedScrollPosition } = usePrayer();
  const navigate = useNavigate();
  
  // Get filtered mosques based on search query
  const mosques = getFilteredMosques();
  
  // Handle navigation and scrolling behavior
  useEffect(() => {
    const path = '/mosque-browser';
    
    // Track this page visit
    trackPageVisit(path);
    
    // Get saved position for this page
    const savedPosition = getSavedScrollPosition(path);
    
    // Restore previous scroll position if available
    if (savedPosition > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto'
        });
      }, 100);
    }
    
    // Save scroll position when leaving the page
    return () => {
      saveScrollPosition(path, window.scrollY);
    };
  }, [trackPageVisit, getSavedScrollPosition, saveScrollPosition]);
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-islamic-blue dark:text-islamic-cream"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <ThemeToggle />
          </div>
          
          <header className="mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream">
                Browse Mosques
              </h1>
            </div>
            <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
              Find mosques in your area
            </p>
            
            <SearchBar />
          </header>
        </div>
        
        <div className="pt-4 grid gap-4 grid-cols-1">
          {mosques.length > 0 ? (
            mosques.map((mosque) => (
              <MosqueCardSimple key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                No mosques found.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default MosqueBrowser;
