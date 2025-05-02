
import React, { useEffect, useRef, useState } from 'react';
import { usePrayer } from '@/contexts/prayer';
import MosqueCard from '@/components/MosqueCard';
import SearchBar from '@/components/SearchBar';
import CurrentTime from '@/components/CurrentTime';
import BottomBar from '@/components/BottomBar';
import { Heart } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteAuthCheck from '@/components/FavoriteAuthCheck';

const Favorites: React.FC = () => {
  const { mosques, favorites, selectedPrayer, setSearchParams, saveScrollPosition, getSavedScrollPosition, trackPageVisit } = usePrayer();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const firstRenderRef = useRef(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
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
  
  // Handle double-tap on favorites page to show login dialog
  useEffect(() => {
    if (!isAuthenticated) {
      // Check if this is a second visit to favorites page in quick succession
      const recentVisits = localStorage.getItem('recent-page-visits');
      if (recentVisits) {
        try {
          const visits = JSON.parse(recentVisits);
          const favoritesVisits = visits.filter((v: any) => 
            v.path === '/favorites' && 
            (Date.now() - v.timestamp) < 1000
          );
          
          if (favoritesVisits.length > 1) {
            setShowAuthDialog(true);
          }
        } catch (e) {
          console.error('Error parsing recent visits:', e);
        }
      }
    }
  }, [isAuthenticated]);
  
  // Get all favorited mosques if authenticated
  const favoritedMosques = isAuthenticated ? 
    mosques.filter(mosque => favorites.includes(mosque.id)) : [];
  
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
          {isAuthenticated ? (
            favoritedMosques.length > 0 ? (
              favoritedMosques.map((mosque) => (
                <MosqueCard key={mosque.id} mosque={mosque} />
              ))
            ) : (
              <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
                <p className="text-islamic-gray dark:text-islamic-cream/70">
                  No favorite mosques yet. Add some by tapping the heart icon.
                </p>
              </div>
            )
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
              <p className="text-islamic-gray dark:text-islamic-cream/70 mb-4">
                Please sign in to view and manage your favorite mosques.
              </p>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => setShowAuthDialog(true)}
                  className="px-4 py-2 bg-islamic-blue text-white rounded-md hover:bg-islamic-blue/90"
                >
                  Sign In / Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BottomBar />
      
      {/* Auth check dialog */}
      <FavoriteAuthCheck 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthenticated={() => {}}
      />
    </div>
  );
};

export default Favorites;
