
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    // Initialize Google Maps services
    if (window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, []);

  const searchPlaces = (input: string) => {
    if (!autocompleteService.current || input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input,
        types: ['geocode'],
        componentRestrictions: { country: 'in' } // Restrict to India
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handlePlaceSelect = (placeId: string, description: string) => {
    if (!geocoder.current) return;

    geocoder.current.geocode({ placeId }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        onLocationSelect({
          latitude: location.lat(),
          longitude: location.lng(),
          address: description
        });
        setQuery(description);
        setSuggestions([]);
        setIsOpen(false);
      }
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address
        if (geocoder.current) {
          geocoder.current.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsGettingLocation(false);
              if (status === 'OK' && results?.[0]) {
                const address = results[0].formatted_address;
                onLocationSelect({ latitude, longitude, address });
                setQuery(address);
                setIsOpen(false);
              } else {
                onLocationSelect({ 
                  latitude, 
                  longitude, 
                  address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
                });
                setQuery(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                setIsOpen(false);
              }
            }
          );
        } else {
          setIsGettingLocation(false);
          onLocationSelect({ 
            latitude, 
            longitude, 
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          });
          setQuery(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setIsOpen(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.error('Error getting location:', error);
        alert('Unable to get your current location. Please try searching manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

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
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for your location..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                searchPlaces(e.target.value);
              }}
              className="pr-10"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-islamic-gray" />
            )}
          </div>

          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
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
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onClick={() => handlePlaceSelect(suggestion.place_id, suggestion.description)}
                  className="w-full text-left p-3 hover:bg-islamic-cream/50 border-b border-gray-100 last:border-b-0 transition-colors"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInput;
