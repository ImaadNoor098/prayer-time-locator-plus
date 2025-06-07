
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { usePrayer } from '@/contexts/prayer';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';

const SearchBar: React.FC = () => {
  const { searchParams, setSearchParams } = usePrayer();
  const { getLastSearchQuery, setLastSearchQuery } = useNavigation();
  
  // On component mount, restore the last search query only if we're navigating between pages
  useEffect(() => {
    // Check if this is a fresh page load (page refresh or direct URL access)
    const isPageRefresh = performance.navigation.type === 1 || 
      !document.referrer || 
      document.referrer === window.location.href;
    
    if (isPageRefresh) {
      // Clear search on page refresh/reload
      setSearchParams({ query: '' });
      setLastSearchQuery('');
    } else {
      // Normal navigation between pages - restore last search if available
      const lastQuery = getLastSearchQuery();
      if (lastQuery && !searchParams.query) {
        setSearchParams({ query: lastQuery });
      }
    }
  }, []); // Only run on mount
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchParams({ query });
    setLastSearchQuery(query);
  };
  
  const handleClear = () => {
    setSearchParams({ query: '' });
    setLastSearchQuery('');
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-islamic-gray" size={16} />
      <Input
        type="text"
        placeholder="Search mosques..."
        value={searchParams.query || ''}
        onChange={handleSearch}
        className="pl-10 pr-10 bg-background border-islamic-green/20 focus-visible:ring-islamic-green"
      />
      {searchParams.query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-islamic-gray/10"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-islamic-gray" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
