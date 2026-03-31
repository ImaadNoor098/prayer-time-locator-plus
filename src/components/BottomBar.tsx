
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, Clock, MapPin, User, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { usePrayer } from '@/contexts/prayer';
import FavoriteAuthCheck from './FavoriteAuthCheck';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  requireAuth?: boolean;
  authRedirect?: string;
}

const BottomBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getLastVisitedPage, getLastDetailedMosqueId } = useNavigation();
  const { selectedPrayer, setSelectedPrayer } = usePrayer();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Double-tap detection for Home button
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Home',
      path: '/',
    },
    {
      icon: <Navigation className="h-5 w-5" />,
      label: 'Qibla',
      path: '/qibla',
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'Favorites',
      path: '/favorites',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Mosques',
      path: '/mosque-browser',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Prayer Times',
      path: '/salah-times',
    },
    {
      icon: <User className="h-5 w-5" />,
      label: 'Account',
      path: '/profile',
      requireAuth: true,
      authRedirect: '/login',
    },
  ];

  const handleHomeButtonTap = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapRef.current;
    
    // If this is a double-tap (within 300ms)
    if (timeDiff < 300 && timeDiff > 0) {
      // Clear any pending single-tap timeout
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      
      // Double-tap detected - navigate to prayer selection and clear selected prayer
      setSelectedPrayer(null);
      navigate('/', { replace: true });
      lastTapRef.current = 0; // Reset to prevent triple-tap issues
      return;
    }
    
    // Single tap - set a timeout to handle normal navigation
    lastTapRef.current = currentTime;
    tapTimeoutRef.current = setTimeout(() => {
      // This is a single tap - handle normal home navigation
      if (!selectedPrayer) {
        navigate('/', { replace: true });
        return;
      }
      
      // If a prayer is selected, show the mosque list for that prayer
      navigate('/mosques', { state: { fromBottomBar: true } });
      tapTimeoutRef.current = null;
    }, 300);
  };

  const handleNavigation = (item: NavItem) => {
    // Special handling for home button with double-tap detection
    if (item.path === '/') {
      handleHomeButtonTap();
      return;
    }
    
    // Special handling for mosque button - show simple mosque cards view
    if (item.path === '/mosque-browser') {
      navigate('/mosque-browser', { state: { fromBottomBar: true } });
      return;
    }
    
    // Special handling for favorites - show auth dialog if not authenticated
    if (item.path === '/favorites') {
      if (!isAuthenticated) {
        // Store the target path for redirect after auth
        sessionStorage.setItem('auth-redirect', '/favorites');
        setShowAuthDialog(true);
        return;
      }
    }
    
    // If the item requires authentication and user is not authenticated, redirect
    if (item.requireAuth && !isAuthenticated && item.authRedirect) {
      // Store the target path for redirect after auth
      sessionStorage.setItem('auth-redirect', item.path);
      navigate(item.authRedirect, { state: { fromBottomBar: true } });
    } else {
      navigate(item.path, { state: { fromBottomBar: true } });
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || (location.pathname === '/mosques' && selectedPrayer))) return true;
    if (path === '/qibla' && location.pathname === '/qibla') return true;
    if (path === '/mosque-browser' && location.pathname === '/mosque-browser') return true;
    if (path === '/mosques' && location.pathname === '/mosques') return true;
    if (path === '/favorites' && location.pathname === '/favorites') return true;
    if (path === '/salah-times' && location.pathname === '/salah-times') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    
    return false;
  };
  
  // Handle authentication success
  const handleAuthenticated = () => {
    navigate('/favorites');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center z-10">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive(item.path)
                ? "text-islamic-blue dark:text-islamic-gold"
                : "text-gray-500 dark:text-gray-400"
            )}
            onClick={() => handleNavigation(item)}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Auth dialog for favorites */}
      <FavoriteAuthCheck 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthenticated={handleAuthenticated}
      />
    </>
  );
};

export default BottomBar;
