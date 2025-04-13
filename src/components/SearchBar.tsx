
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePrayer } from '@/contexts/prayer';

const SearchBar: React.FC = () => {
  const { searchParams, setSearchParams } = usePrayer();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ query: e.target.value });
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
