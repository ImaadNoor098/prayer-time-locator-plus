
import React, { useEffect, useState } from 'react';
import { usePrayer } from '@/contexts/prayer';
import MosqueCardSimple from '@/components/MosqueCardSimple';
import BottomBar from '@/components/BottomBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import { ArrowLeft, ArrowDownAZ, ArrowDownZA } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const MosqueBrowser: React.FC = () => {
  const { getFilteredMosques, trackPageVisit, saveScrollPosition, getSavedScrollPosition, searchParams, setSearchParams } = usePrayer();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<'aToZ' | 'zToA'>('aToZ');
  
  // Get filtered mosques based on search query
  const mosques = getFilteredMosques();

  // Sort mosques alphabetically
  const sortedMosques = [...mosques].sort((a, b) => {
    if (sortOrder === 'aToZ') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
  
  // Handle navigation and scrolling behavior
  useEffect(() => {
    const path = '/mosque-browser';
    
    // Track this page visit
    trackPageVisit(path);
    
    // Get saved position for this page
    const savedPosition = getSavedScrollPosition(path);
    
    // Clear search on refresh/initial load
    if (performance.navigation && performance.navigation.type === 1) { // 1 is TYPE_RELOAD
      setSearchParams({ query: '' });
    } else if (window.performance) {
      // Modern browsers
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && (navEntries[0] as any).type === 'reload') {
        setSearchParams({ query: '' });
      }
    }
    
    // Restore previous scroll position if available
    if (savedPosition > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto'
        });
      }, 100);
    }
    
    // Save scroll position when leaving the page
    return () => {
      saveScrollPosition(path, window.scrollY);
    };
  }, [trackPageVisit, getSavedScrollPosition, saveScrollPosition, setSearchParams]);
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 pt-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-islamic-blue dark:text-islamic-cream"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <ThemeToggle />
          </div>
          
          <header className="mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-islamic-blue dark:text-islamic-cream">
                Browse Mosques
              </h1>
            </div>
            <p className="text-sm text-islamic-gray dark:text-islamic-cream/70 mb-4">
              Find mosques in your area
            </p>
            
            <SearchBar />
          </header>
          
          {/* Sort Filter Bar */}
          <div className="p-3 bg-white dark:bg-card rounded-md shadow-sm mb-4">
            <div className="mb-2 text-sm font-medium text-islamic-blue dark:text-islamic-light-blue">
              Sort Mosques
            </div>
            <ToggleGroup 
              type="single" 
              value={sortOrder} 
              onValueChange={(value) => value && setSortOrder(value as 'aToZ' | 'zToA')}
              className="justify-start"
            >
              <ToggleGroupItem 
                value="aToZ"
                aria-label="Sort A to Z"
                className={`text-xs flex items-center gap-1 ${
                  sortOrder === 'aToZ' 
                    ? 'bg-islamic-green text-white' 
                    : 'hover:bg-islamic-cream hover:text-islamic-green'
                }`}
              >
                <ArrowDownAZ className="h-4 w-4" />
                A to Z
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="zToA"
                aria-label="Sort Z to A"
                className={`text-xs flex items-center gap-1 ${
                  sortOrder === 'zToA' 
                    ? 'bg-islamic-green text-white' 
                    : 'hover:bg-islamic-cream hover:text-islamic-green'
                }`}
              >
                <ArrowDownZA className="h-4 w-4" />
                Z to A
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="pt-4 grid gap-4 grid-cols-1">
          {sortedMosques.length > 0 ? (
            sortedMosques.map((mosque) => (
              <MosqueCardSimple key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <div className="text-center p-8 bg-white dark:bg-card rounded-lg shadow islamic-card">
              <p className="text-islamic-gray dark:text-islamic-cream/70">
                No mosques found.
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
