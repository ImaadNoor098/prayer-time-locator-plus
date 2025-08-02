import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import BottomBar from '@/components/BottomBar';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';
import { 
  getPrayerTimesForDate, 
  getAvailableYears, 
  getAvailableDatesForYear, 
  getLocationForYear,
  DailyPrayerTimes 
} from '@/data/prayer';
import { format } from 'date-fns';

const EnhancedPrayerTimes: React.FC = () => {
  const { currentBackgroundClass } = useBackgroundSelector();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [prayerTimes, setPrayerTimes] = useState<DailyPrayerTimes | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [locationInfo, setLocationInfo] = useState<{ location: string; timezone: string } | null>(null);

  const availableYears = getAvailableYears();

  // Update available dates when year changes
  useEffect(() => {
    const dates = getAvailableDatesForYear(selectedYear);
    setAvailableDates(dates);
    setLocationInfo(getLocationForYear(selectedYear));
    
    // If current selected date is not available in the new year, select first available date
    if (dates.length > 0 && !dates.includes(selectedDate)) {
      setSelectedDate(dates[0]);
    }
  }, [selectedYear, selectedDate]);

  // Update prayer times when date changes
  useEffect(() => {
    const times = getPrayerTimesForDate(selectedDate);
    setPrayerTimes(times);
  }, [selectedDate]);

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const currentIndex = availableDates.indexOf(selectedDate);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : availableDates.length - 1;
    } else {
      newIndex = currentIndex < availableDates.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedDate(availableDates[newIndex]);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const prayerNames = [
    { key: 'fajr', name: 'Fajr', icon: '🌅', description: 'Dawn Prayer' },
    { key: 'sunrise', name: 'Sunrise', icon: '☀️', description: 'Sun Rising' },
    { key: 'dhuhr', name: 'Dhuhr', icon: '☀️', description: 'Noon Prayer' },
    { key: 'asr', name: 'Asr', icon: '🌤️', description: 'Afternoon Prayer' },
    { key: 'maghrib', name: 'Maghrib', icon: '🌇', description: 'Sunset Prayer' },
    { key: 'isha', name: 'Isha', icon: '🌙', description: 'Night Prayer' }
  ];

  return (
    <div className={`min-h-screen ${currentBackgroundClass} pb-20`}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-arabic text-primary mb-2">Prayer Times</h1>
          <p className="text-muted-foreground">Islamic prayer schedule</p>
        </div>

        {/* Year Selection */}
        <Card className="p-6 mb-6 modern-islamic-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-semibold font-arabic">Select Year</h2>
            </div>
          </div>
          
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {locationInfo && (
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">{locationInfo.location}</div>
                <div>Timezone: {locationInfo.timezone}</div>
              </div>
            </div>
          )}
        </Card>

        {/* Date Navigation */}
        {availableDates.length > 0 && (
          <Card className="p-6 mb-6 modern-islamic-card">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateNavigation('prev')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-center">
                <h3 className="font-semibold font-arabic">{formatDisplayDate(selectedDate)}</h3>
                <Badge variant="secondary" className="mt-1">
                  {availableDates.indexOf(selectedDate) + 1} of {availableDates.length}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateNavigation('next')}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Prayer Times Display */}
        {prayerTimes ? (
          <div className="grid gap-4 mb-6">
            {prayerNames.map((prayer) => (
              <Card key={prayer.key} className="p-4 modern-islamic-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prayer.icon}</span>
                    <div>
                      <h3 className="font-semibold font-arabic text-lg">{prayer.name}</h3>
                      <p className="text-sm text-muted-foreground">{prayer.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {formatTime(prayerTimes[prayer.key as keyof DailyPrayerTimes] as string)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prayerTimes[prayer.key as keyof DailyPrayerTimes] as string}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <Info className="h-4 w-4" />
            <AlertTitle>Timings not available</AlertTitle>
            <AlertDescription>
              Prayer times for {formatDisplayDate(selectedDate)} are not available in our database.
              Please select a different date or year.
            </AlertDescription>
          </Alert>
        )}

        {/* Data Source Notice */}
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Prayer Times Source</AlertTitle>
          <AlertDescription>
            Times are calculated for {locationInfo?.location || 'your location'} and may vary slightly 
            based on local conditions. Please verify with your local mosque for exact timings.
          </AlertDescription>
        </Alert>

        {availableDates.length === 0 && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <Info className="h-4 w-4" />
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              No prayer times data is available for the year {selectedYear}. 
              Please select a different year.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <BottomBar />
    </div>
  );
};

export default EnhancedPrayerTimes;