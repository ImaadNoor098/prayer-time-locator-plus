
import React from 'react';
import { FilterOption } from '@/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePrayer } from '@/contexts/prayer';
import { ArrowUpNarrowWide, ArrowDownNarrowWide, Clock, Clock3, MapPin, Navigation } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const FilterBar: React.FC = () => {
  const { currentFilter, setCurrentFilter } = usePrayer();
  const location = useLocation();
  
  // Check if we're on the browse mosques page (either /browse or /mosque-browser)
  const isBrowsePage = location.pathname === '/browse' || location.pathname === '/mosque-browser';
  
  // Define filters based on the current page
  const filters: { value: FilterOption; label: string; icon: React.ReactNode }[] = isBrowsePage 
    ? [
        { value: 'alphabetical', label: 'A-Z', icon: <ArrowUpNarrowWide className="h-4 w-4" /> },
        { value: 'alphabetical-desc', label: 'Z-A', icon: <ArrowDownNarrowWide className="h-4 w-4" /> },
      ]
    : [
        { value: 'earliest', label: 'Earliest', icon: <Clock className="h-4 w-4" /> },
        { value: 'latest', label: 'Latest', icon: <Clock3 className="h-4 w-4" /> },
        { value: 'nearest', label: 'Nearest', icon: <MapPin className="h-4 w-4" /> },
        { value: 'farthest', label: 'Farthest', icon: <Navigation className="h-4 w-4" /> },
      ];
  
  return (
    <div className="p-4 sticky top-0 bg-background z-10 border-b islamic-border">
      <div className="mb-2 text-sm font-medium text-islamic-blue dark:text-islamic-light-blue">
        {isBrowsePage ? 'Sort Mosques' : 'Filter Prayer Times'}
      </div>
      <ToggleGroup type="single" value={currentFilter} onValueChange={(value) => value && setCurrentFilter(value as FilterOption)}>
        {filters.map((filter) => (
          <ToggleGroupItem 
            key={filter.value} 
            value={filter.value}
            aria-label={filter.label}
            className={`text-xs flex items-center gap-1 ${
              currentFilter === filter.value 
                ? 'bg-islamic-green text-white' 
                : 'hover:bg-islamic-cream hover:text-islamic-green'
            }`}
          >
            {filter.icon}
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default FilterBar;
