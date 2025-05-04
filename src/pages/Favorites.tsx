
import React, { useEffect, useRef, useState } from 'react';
import { usePrayer } from '@/contexts/prayer';
import MosqueCard from '@/components/MosqueCard';
import SearchBar from '@/components/SearchBar';
import CurrentTime from '@/components/CurrentTime';
import BottomBar from '@/components/BottomBar';
import { Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteAuthCheck from '@/components/FavoriteAuthCheck';

const Favorites: React.FC = () => {
  const { mosques, favorites, selectedPrayer, setSearchParams, saveScrollPosition, getSavedScrollPosition, trackPageVisit } = usePrayer();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  // Handle authentication check
  useEffect(() => {
    // If not authenticated and this is the first render, show auth dialog
    if (!isAuthenticated && firstRenderRef.current) {
      setShowAuthDialog(true);
    }
  }, [isAuthenticated]);

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
  
  // Handle successful authentication
  const handleAuthenticated = () => {
    // Just close the dialog, we're already on the favorites page
    setShowAuthDialog(false);
  };
  
  // Get all favorited mosques if authenticated
  const favoritedMosques = isAuthenticated ? 
    mosques.filter(mosque => favorites.includes(mosque.id)) : [];
  
  // If not authenticated, show auth prompt but still show bottom bar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen islamic-pattern-bg pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
            <h1 className="text-2xl font-bold text-islamic-blue flex items-center mb-2">
              <Heart className="h-5 w-5 mr-2 fill-islamic-green text-islamic-green" />
              Favorite Mosques
            </h1>
            <p className="text-sm text-islamic-gray mb-4">
              Please sign in to see your favorite mosques
            </p>
          </header>
          
          <div className="text-center p-8 bg-white rounded-lg shadow islamic-card mt-8">
            <p className="text-islamic-gray mb-4">
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
        </div>
        
        <BottomBar />
        
        {/* Auth check dialog */}
        <FavoriteAuthCheck 
          isOpen={showAuthDialog}
          onClose={() => navigate('/')} // Go home if they close without auth
          onAuthenticated={handleAuthenticated}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-islamic-blue flex items-center mb-2">
            <Heart className="h-5 w-5 mr-2 fill-islamic-green text-islamic-green" />
            Favorite Mosques
          </h1>
          <p className="text-sm text-islamic-gray mb-4">
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
            <div className="text-center p-8 bg-white rounded-lg shadow islamic-card">
              <p className="text-islamic-gray">
                No favorite mosques yet. Add some by tapping the heart icon on a mosque.
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
