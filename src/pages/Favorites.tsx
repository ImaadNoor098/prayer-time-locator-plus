import React, { useEffect, useRef } from 'react';
import { usePrayer } from '@/contexts/prayer';
import MosqueCard from '@/components/MosqueCard';
import SearchBar from '@/components/SearchBar';
import CurrentTime from '@/components/CurrentTime';
import BottomBar from '@/components/BottomBar';
import { Heart } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { mosques, favorites, selectedPrayer, setSearchParams, saveScrollPosition, getSavedScrollPosition, trackPageVisit } = usePrayer();
  const location = useLocation();
  const firstRenderRef = useRef(true);
  
  // Set showFavorites to true when component mounts
  useEffect(() => {
    setSearchParams({ showFavorites: true });
    
    // Reset when component unmounts
    return () => {
      setSearchParams({ showFavorites: false });
    };
  }, [setSearchParams]);

  // Handle scroll position management
  useEffect(() => {
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
  }, [location.pathname, getSavedScrollPosition, saveScrollPosition, trackPageVisit, location.state]);
  
  // Get all favorited mosques
  const favoritedMosques = mosques.filter(mosque => favorites.includes(mosque.id));
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream flex items-center mb-2">
            <Heart className="h-5 w-5 mr-2 fill-islamic-green text-islamic-green" />
            Favorite Mosques
          </h1>
          <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
            Mosques you've added to favorites
          </p>
          
          <SearchBar />
        </header>
        
        <CurrentTime />
        
        <div className="pt-4 space-y-4">
          {favoritedMosques.length > 0 ? (
            favoritedMosques.map((mosque) => (
              <MosqueCard key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                No favorite mosques yet. Add some by tapping the heart icon.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Favorites;
