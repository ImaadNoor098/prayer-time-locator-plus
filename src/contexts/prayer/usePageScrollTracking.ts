
import { useState } from 'react';

export const usePageScrollTracking = () => {
  const [pageScrollPositions, setPageScrollPositions] = useState<Record<string, number>>({});
  const [lastVisitedPages, setLastVisitedPages] = useState<string[]>([]);

  // Save scroll position for a page
  const saveScrollPosition = (page: string, position: number) => {
    setPageScrollPositions(prev => ({
      ...prev,
      [page]: position
    }));
  };

  // Get saved scroll position for a page
  const getSavedScrollPosition = (page: string): number => {
    return pageScrollPositions[page] || 0;
  };

  // Track page visits for double-tap detection
  const trackPageVisit = (page: string) => {
    setLastVisitedPages(prev => {
      // If last visited page is the same as current, this is a double-tap
      if (prev.length > 0 && prev[prev.length - 1] === page) {
        // Clear scroll position for this page on double-tap
        setPageScrollPositions(positions => {
          const newPositions = { ...positions };
          delete newPositions[page];
          return newPositions;
        });
        // Return the array with the page removed (will be added back)
      }
      // Add current page to the end
      return [...prev, page].slice(-5); // Keep last 5 for memory efficiency
    });
  };

  return {
    saveScrollPosition,
    getSavedScrollPosition,
    trackPageVisit
  };
};
