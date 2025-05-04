
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, Clock, MapPin, User } from 'lucide-react';
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
  const { getLastVisitedPage } = useNavigation();
  const { selectedPrayer } = usePrayer();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [lastTap, setLastTap] = useState<{ item: string, time: number } | null>(null);

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-6 w-6" />,
      label: 'Home',
      path: '/',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      label: 'Favorites',
      path: '/favorites',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: 'Mosques',
      path: '/mosques',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Prayer Times',
      path: '/salah-times',
    },
    {
      icon: <User className="h-6 w-6" />,
      label: 'Profile',
      path: '/profile',
      requireAuth: true,
      authRedirect: '/login',
    },
  ];

  const handleNavigation = (item: NavItem) => {
    // Special handling for home button - always go to prayer selection page
    if (item.path === '/') {
      navigate('/', { replace: true });
      return;
    }
    
    // Special handling for mosques button - show current prayer's mosques
    if (item.path === '/mosques') {
      navigate('/mosques', { state: { fromBottomBar: true } });
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
    return location.pathname === path;
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
