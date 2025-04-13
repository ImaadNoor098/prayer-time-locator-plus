
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  const [open, setOpen] = useState(false);

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setOpen(false); // Close the popover after selecting a date
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <Button
        onClick={handlePreviousDay}
        variant="outline"
        size="icon"
        className="rounded-full border-2 border-islamic-blue text-islamic-blue hover:bg-islamic-blue/10 h-12 w-12 shadow-md"
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="sr-only">Previous Day</span>
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-islamic-gold bg-islamic-gold/10 text-islamic-blue hover:bg-islamic-gold/20 font-medium px-6"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {format(selectedDate, 'MMMM d, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Button
        onClick={handleNextDay}
        variant="outline"
        size="icon"
        className="rounded-full border-2 border-islamic-blue text-islamic-blue hover:bg-islamic-blue/10 h-12 w-12 shadow-md"
      >
        <ArrowRight className="h-6 w-6" />
        <span className="sr-only">Next Day</span>
      </Button>
    </div>
  );
};

export default DateNavigation;
