import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import MosqueCardSimple from '@/components/MosqueCardSimple';
import FilterBar from '@/components/FilterBar';
import CurrentTime from '@/components/CurrentTime';
import SearchBar from '@/components/SearchBar';
import BottomBar from '@/components/BottomBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const MosqueBrowser: React.FC = () => {
  const { 
    mosques,
    searchParams,
    currentFilter,
    saveScrollPosition, 
    getSavedScrollPosition, 
    trackPageVisit 
  } = usePrayer();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  
  // Use useEffect to handle navigation and scrolling behavior
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
  
  // Filter mosques based on search query and favorites
  const getFilteredMosques = () => {
    let filtered = [...mosques];
    
    // Apply search filter
    if (searchParams.query.trim()) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(mosque => 
        mosque.name.toLowerCase().includes(query) || 
        mosque.address.toLowerCase().includes(query)
      );
    }
    
    // Apply favorites filter
    if (searchParams.showFavorites) {
      // This would need access to favorites from context
      // For now, we'll skip this filter in browse mode
    }
    
    // Apply sorting based on current filter
    switch (currentFilter) {
      case 'nearest':
        return [...filtered].sort((a, b) => a.distance - b.distance);
      case 'farthest':
        return [...filtered].sort((a, b) => b.distance - a.distance);
      default:
        return filtered;
    }
  };
  
  const filteredMosques = getFilteredMosques();
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20" ref={pageRef}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream">
              Browse Mosques
            </h1>
            <ThemeToggle variant="button" />
          </div>
          
          <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
            Discover mosques in your area
          </p>
          
          <SearchBar />
        </div>
        
        <CurrentTime />
        
        {/* Distance Notice for NEAREST and FARTHEST filters */}
        {(currentFilter === 'nearest' || currentFilter === 'farthest') && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-md p-3 dark:bg-orange-950/20 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                <div className="font-medium mb-1">Distance Filter Notice:</div>
                <div className="space-y-1">
                  <div>The <span className="font-semibold">{currentFilter.toUpperCase()}</span> filter may show inaccurate distance results.</div>
                  <div>Use the <span className="bg-islamic-blue text-white px-2 py-0.5 rounded text-xs font-medium">Directions</span> button on each mosque card for accurate navigation.</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <FilterBar />
        
        <div className="pt-4 space-y-4">
          {filteredMosques.length > 0 ? (
            filteredMosques.map((mosque) => (
              <MosqueCardSimple key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                {searchParams.query.trim() 
                  ? `No mosques found matching "${searchParams.query}"`
                  : "No mosques found."
                }
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
