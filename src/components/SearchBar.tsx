
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePrayer } from '@/contexts/prayer';
import { useNavigation } from '@/contexts/NavigationContext';

const SearchBar: React.FC = () => {
  const { searchParams, setSearchParams } = usePrayer();
  const { getLastSearchQuery, setLastSearchQuery } = useNavigation();
  
  // On component mount, get the last search query from navigation context
  useEffect(() => {
    const lastQuery = getLastSearchQuery();
    if (lastQuery && lastQuery !== searchParams.query) {
      setSearchParams({ query: lastQuery });
    }
  }, [getLastSearchQuery, searchParams.query, setSearchParams]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchParams({ query });
    setLastSearchQuery(query);
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-islamic-gray" size={16} />
      <Input
        type="text"
        placeholder="Search mosques..."
        value={searchParams.query}
        onChange={handleSearch}
        className="pl-10 bg-background border-islamic-green/20 focus-visible:ring-islamic-green"
      />
    </div>
  );
};

export default SearchBar;
