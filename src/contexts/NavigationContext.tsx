
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationState {
  previousPath: string;
  lastMosqueListState: any;
  lastMosqueDetailState: any;
  lastPrayerSelectionState: any;
  lastMosquePage: string;
}

type NavigationContextType = {
  navigationState: NavigationState;
  setPreviousPath: (path: string) => void;
  setLastMosqueListState: (state: any) => void;
  setLastMosqueDetailState: (state: any) => void;
  setLastPrayerSelectionState: (state: any) => void;
  getLastVisitedPage: () => string;
  getLastMosquePage: () => string;
};

const initialState: NavigationState = {
  previousPath: '/',
  lastMosqueListState: null,
  lastMosqueDetailState: null,
  lastPrayerSelectionState: null,
  lastMosquePage: '/mosques',
};

const NavigationContext = createContext<NavigationContextType>({
  navigationState: initialState,
  setPreviousPath: () => {},
  setLastMosqueListState: () => {},
  setLastMosqueDetailState: () => {},
  setLastPrayerSelectionState: () => {},
  getLastVisitedPage: () => '/',
  getLastMosquePage: () => '/mosques',
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    // Initialize with values from localStorage if available
    const savedState = localStorage.getItem('navigation-state');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        return initialState;
      }
    }
    return initialState;
  });
  const location = useLocation();

  // Track page navigation
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't track auth and verification pages in navigation history
    if (currentPath === '/login' || currentPath === '/register' || currentPath === '/verify-otp') {
      return;
    }
    
    // Update navigation state
    setNavigationState(prev => {
      const newState = {
        ...prev,
        previousPath: currentPath,
      };
      
      // Update lastMosquePage if this is a mosque-related page
      if (currentPath === '/mosques' || 
          currentPath.startsWith('/mosque/') || 
          currentPath === '/mosque-browser') {
        newState.lastMosquePage = currentPath;
      }
      
      return newState;
    });
    
    // Store last visited page in local storage
    localStorage.setItem('last-visited-page', currentPath);
  }, [location.pathname]);
  
  // Save navigation state to localStorage
  useEffect(() => {
    localStorage.setItem('navigation-state', JSON.stringify(navigationState));
  }, [navigationState]);

  const setPreviousPath = (path: string) => {
    setNavigationState(prev => ({ ...prev, previousPath: path }));
  };

  const setLastMosqueListState = (state: any) => {
    setNavigationState(prev => ({ ...prev, lastMosqueListState: state }));
  };

  const setLastMosqueDetailState = (state: any) => {
    setNavigationState(prev => ({ ...prev, lastMosqueDetailState: state }));
  };

  const setLastPrayerSelectionState = (state: any) => {
    setNavigationState(prev => ({ ...prev, lastPrayerSelectionState: state }));
  };

  const getLastVisitedPage = (): string => {
    // Get the most recent non-auth page from local storage
    const lastPage = localStorage.getItem('last-visited-page') || '/';
    
    // If the last page is mosque-related but no prayer is selected, go to home
    if ((lastPage.includes('/mosques') || lastPage.includes('/mosque/')) && 
        !localStorage.getItem('selected-prayer')) {
      return '/';
    }
    
    return lastPage;
  };
  
  const getLastMosquePage = (): string => {
    return navigationState.lastMosquePage || '/mosques';
  };

  return (
    <NavigationContext.Provider 
      value={{ 
        navigationState, 
        setPreviousPath,
        setLastMosqueListState,
        setLastMosqueDetailState,
        setLastPrayerSelectionState,
        getLastVisitedPage,
        getLastMosquePage
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
