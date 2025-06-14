
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationInputProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
  currentLocation?: { latitude: number; longitude: number; address: string } | null;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect, currentLocation }) => {
  const [isOpen, setIsOpen] = useState(!currentLocation);
  const [query, setQuery] = useState(currentLocation?.address || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsCacheRef = useRef<Map<string, any[]>>(new Map());

  useEffect(() => {
    // Initialize Google Maps services with error handling
    const initializeServices = async () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          geocoder.current = new window.google.maps.Geocoder();
          setApiError(null);
          console.log('Google Maps services initialized successfully');
        } else {
          setApiError('Google Maps services not available');
        }
      } catch (error) {
        console.error('Error initializing Google Maps services:', error);
        setApiError('Failed to initialize location services');
      }
    };

    // Check if Google Maps is loaded
    if (window.google) {
      initializeServices();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleMaps);
          initializeServices();
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!window.google) {
          setApiError('Google Maps failed to load');
        }
      }, 10000);
    }
  }, []);

  // Optimized debounced search function with faster debounce
  const debouncedSearch = useCallback((input: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchPlaces(input);
    }, 150); // Reduced from 300ms to 150ms for faster response
  }, []);

  const searchPlaces = (input: string) => {
    if (!autocompleteService.current || input.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Check cache first for instant results
    const cacheKey = input.toLowerCase().trim();
    if (suggestionsCacheRef.current.has(cacheKey)) {
      const cachedResults = suggestionsCacheRef.current.get(cacheKey) || [];
      setSuggestions(cachedResults);
      setIsLoading(false);
      console.log('Using cached results for:', input);
      return;
    }

    setIsLoading(true);
    console.log('Searching for places:', input);

    // Optimized autocomplete request
    const request = {
      input: input.trim(),
      types: ['geocode'],
      componentRestrictions: { country: 'in' },
      // Add session token for better performance (if available)
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        console.log('Places API response:', status, predictions?.length || 0, 'results');
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Cache the results for instant access
          suggestionsCacheRef.current.set(cacheKey, predictions);
          setSuggestions(predictions);
          setApiError(null);
        } else if (status === window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          console.error('Places API access denied - check API key');
          setApiError('Location services access denied. Please check API configuration.');
          setSuggestions([]);
        } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          console.error('Places API quota exceeded');
          setApiError('Location service quota exceeded. Please try again later.');
          setSuggestions([]);
        } else {
          console.warn('Places API error:', status);
          setSuggestions([]);
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setIsLoading(true);
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (placeId: string, description: string) => {
    if (!geocoder.current) {
      console.error('Geocoder not available');
      return;
    }

    console.log('Selecting place:', placeId, description);
    setIsLoading(true);

    geocoder.current.geocode({ placeId }, (results, status) => {
      setIsLoading(false);
      console.log('Geocoding result:', status, results?.[0]?.geometry?.location);
      
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        const selectedLocation = {
          latitude: location.lat(),
          longitude: location.lng(),
          address: description
        };
        
        console.log('Location selected:', selectedLocation);
        onLocationSelect(selectedLocation);
        setQuery(description);
        setSuggestions([]);
        setIsOpen(false);
      } else {
        console.error('Geocoding failed:', status);
        setApiError('Unable to get location details. Please try another address.');
      }
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setApiError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    console.log('Getting current location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location obtained:', latitude, longitude);
        
        // Reverse geocode to get address
        if (geocoder.current) {
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsGettingLocation(false);
              console.log('Reverse geocoding result:', status, results?.[0]?.formatted_address);
              
              if (status === 'OK' && results?.[0]) {
                const address = results[0].formatted_address;
                const currentLoc = { latitude, longitude, address };
                console.log('Current location with address:', currentLoc);
                onLocationSelect(currentLoc);
                setQuery(address);
                setIsOpen(false);
              } else {
                const coordAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                console.log('Using coordinate address:', coordAddress);
                onLocationSelect({ 
                  latitude, 
                  longitude, 
                  address: coordAddress 
                });
                setQuery(coordAddress);
                setIsOpen(false);
              }
            }
          );
        } else {
          setIsGettingLocation(false);
          const coordAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onLocationSelect({ 
            latitude, 
            longitude, 
            address: coordAddress 
          });
          setQuery(coordAddress);
          setIsOpen(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your current location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setApiError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!isOpen && currentLocation) {
    return (
      <Card className="mb-6 islamic-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-islamic-green mr-2" />
              <div>
                <p className="font-medium text-islamic-blue">Your Location</p>
                <p className="text-sm text-islamic-gray line-clamp-1">{currentLocation.address}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="text-islamic-blue border-islamic-blue/20"
            >
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 islamic-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-islamic-blue flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Enter Your Location
            </h3>
            {currentLocation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* API Error Alert */}
          {apiError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {apiError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for your location..."
              value={query}
              onChange={handleInputChange}
              className="pr-10"
              autoComplete="off"
              disabled={!!apiError}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-islamic-gray" />
            )}
          </div>

          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation || !!apiError}
            className="w-full bg-islamic-green hover:bg-islamic-green/90"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Use Current Location
              </>
            )}
          </Button>

          {suggestions.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onClick={() => handlePlaceSelect(suggestion.place_id, suggestion.description)}
                  className="w-full text-left p-3 hover:bg-islamic-cream/50 border-b border-gray-100 last:border-b-0 transition-colors focus:bg-islamic-cream/70 focus:outline-none"
                >
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-islamic-gray mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-islamic-blue">
                        {suggestion.structured_formatting.main_text}
                      </p>
                      <p className="text-sm text-islamic-gray">
                        {suggestion.structured_formatting.secondary_text}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && !isLoading && suggestions.length === 0 && !apiError && (
            <div className="text-center py-4 text-islamic-gray">
              <p>No suggestions found. Try a different search term.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInput;
