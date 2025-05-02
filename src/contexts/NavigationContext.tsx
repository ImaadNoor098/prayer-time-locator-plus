
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationState {
  previousPath: string;
  lastMosqueListState: any;
  lastMosqueDetailState: any;
  lastPrayerSelectionState: any;
}

type NavigationContextType = {
  navigationState: NavigationState;
  setPreviousPath: (path: string) => void;
  setLastMosqueListState: (state: any) => void;
  setLastMosqueDetailState: (state: any) => void;
  setLastPrayerSelectionState: (state: any) => void;
  getLastVisitedPage: () => string;
};

const initialState: NavigationState = {
  previousPath: '/',
  lastMosqueListState: null,
  lastMosqueDetailState: null,
  lastPrayerSelectionState: null,
};

const NavigationContext = createContext<NavigationContextType>({
  navigationState: initialState,
  setPreviousPath: () => {},
  setLastMosqueListState: () => {},
  setLastMosqueDetailState: () => {},
  setLastPrayerSelectionState: () => {},
  getLastVisitedPage: () => '/',
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(initialState);
  const location = useLocation();

  // Track page navigation
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't track auth and verification pages in navigation history
    if (currentPath === '/login' || currentPath === '/register' || currentPath === '/verify-otp') {
      return;
    }
    
    // Update navigation state
    setNavigationState(prev => ({
      ...prev,
      previousPath: currentPath,
    }));
    
    // Store last visited page in local storage
    localStorage.setItem('last-visited-page', currentPath);
  }, [location.pathname]);

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

  return (
    <NavigationContext.Provider 
      value={{ 
        navigationState, 
        setPreviousPath,
        setLastMosqueListState,
        setLastMosqueDetailState,
        setLastPrayerSelectionState,
        getLastVisitedPage
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
