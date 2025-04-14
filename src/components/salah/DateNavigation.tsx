
import React, { useState } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ selectedDate, onDateChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const today = new Date();
  const isToday = isSameDay(selectedDate, today);
  
  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };
  
  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };
  
  const handleToday = () => {
    if (!isToday) {
      onDateChange(today);
    }
  };
  
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setCalendarOpen(false); // Close calendar after selection
    }
  };
  
  return (
    <div className="flex justify-between items-center my-4 bg-white dark:bg-card shadow-sm rounded-lg p-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousDay}
        className="text-islamic-blue dark:text-islamic-cream"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-2 items-center">
        <Button
          variant={isToday ? "default" : "outline"}
          size="sm"
          onClick={handleToday}
          className={cn(
            isToday ? "bg-islamic-green hover:bg-islamic-green/90" : "text-islamic-blue dark:text-islamic-cream"
          )}
        >
          Today
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[150px] flex justify-between items-center text-islamic-blue dark:text-islamic-cream"
            >
              <span>{format(selectedDate, 'MMMM dd, yyyy')}</span>
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        className="text-islamic-blue dark:text-islamic-cream"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateNavigation;
