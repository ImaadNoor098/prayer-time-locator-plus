
import React from 'react';
import { FilterOption } from '@/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePrayer } from '@/contexts/PrayerContext';
import { Clock, ArrowUpNarrowWide, ArrowDownNarrowWide, MapPin } from 'lucide-react';

const FilterBar: React.FC = () => {
  const { currentFilter, setCurrentFilter } = usePrayer();
  
  const filters: { value: FilterOption; label: string; icon: React.ReactNode }[] = [
    { value: 'earliest', label: 'Earliest', icon: <Clock className="h-4 w-4" /> },
    { value: 'latest', label: 'Latest', icon: <Clock className="h-4 w-4" /> },
    { value: 'nearest', label: 'Nearest', icon: <MapPin className="h-4 w-4" /> },
    { value: 'farthest', label: 'Farthest', icon: <MapPin className="h-4 w-4" /> },
  ];
  
  return (
    <div className="p-4 sticky top-0 bg-background z-10 border-b islamic-border">
      <div className="mb-2 text-sm font-medium text-islamic-blue dark:text-islamic-light-blue">
        Filter Mosques
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
