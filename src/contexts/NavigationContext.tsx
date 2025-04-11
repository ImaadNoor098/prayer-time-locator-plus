
import React, { createContext, useContext, useState } from 'react';

type NavigationContextType = {
  previousPath: string;
  setPreviousPath: (path: string) => void;
};

const NavigationContext = createContext<NavigationContextType>({
  previousPath: '/',
  setPreviousPath: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [previousPath, setPreviousPath] = useState<string>('/');

  return (
    <NavigationContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
