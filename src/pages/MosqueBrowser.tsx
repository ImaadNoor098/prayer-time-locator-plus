import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrayer } from '@/contexts/prayer';
import MosqueCardSimple from '@/components/MosqueCardSimple';
import FilterBar from '@/components/FilterBar';
import CurrentTime from '@/components/CurrentTime';
import SearchBar from '@/components/SearchBar';
import BottomBar from '@/components/BottomBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const MosqueBrowser: React.FC = () => {
  const { 
    mosques,
    searchParams,
    currentFilter,
    setCurrentFilter,
    saveScrollPosition, 
    getSavedScrollPosition, 
    trackPageVisit 
  } = usePrayer();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  const { currentBackgroundClass } = useBackgroundSelector();
  
  // Set default filter to A-Z on component mount for browse page
  useEffect(() => {
    setCurrentFilter('alphabetical');
  }, [setCurrentFilter]);
  
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
  
  // Filter mosques based on search query and sorting
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
    
    // Apply sorting based on current filter
    switch (currentFilter) {
      case 'alphabetical':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'alphabetical-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name)); // Default to A-Z
    }
  };
  
  const filteredMosques = getFilteredMosques();
  
  return (
    <div className={`min-h-screen ${currentBackgroundClass} pb-20`} ref={pageRef}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream">
              Browse Mosques
            </h1>
            <ThemeToggle />
          </div>
          
          <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
            Discover mosques in your area
          </p>
          
          <SearchBar />
        </div>
        
        <CurrentTime />
        
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
