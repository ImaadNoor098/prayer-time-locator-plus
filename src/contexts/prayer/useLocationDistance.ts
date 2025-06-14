
import { useState, useEffect } from 'react';
import { Mosque } from '@/types';
import { calculateDistance, extractCoordinatesFromMapsLink, geocodeAddress } from '@/utils/distanceUtils';

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export const useLocationDistance = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('user-location');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isCalculatingDistances, setIsCalculatingDistances] = useState(false);

  // Save user location to localStorage
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('user-location', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('user-location');
    }
  }, [userLocation]);

  const calculateMosqueDistances = async (mosques: Mosque[]): Promise<Mosque[]> => {
    if (!userLocation) return mosques;

    setIsCalculatingDistances(true);
    
    const mosquesWithDistances = await Promise.all(
      mosques.map(async (mosque) => {
        let mosqueCoords = mosque.coordinates;
        
        // If mosque doesn't have coordinates, try to extract from Google Maps link
        if (!mosqueCoords && mosque.googleMapsLink) {
          const extractedCoords = extractCoordinatesFromMapsLink(mosque.googleMapsLink);
          if (extractedCoords) {
            mosqueCoords = extractedCoords;
          }
        }
        
        // If still no coordinates, try geocoding the address
        if (!mosqueCoords) {
          const geocodedCoords = await geocodeAddress(mosque.address);
          if (geocodedCoords) {
            mosqueCoords = geocodedCoords;
          }
        }
        
        // Calculate distance if we have coordinates
        let distance = 999; // Default large distance if calculation fails
        if (mosqueCoords) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mosqueCoords.latitude || mosqueCoords.lat,
            mosqueCoords.longitude || mosqueCoords.lng
          );
        }
        
        return {
          ...mosque,
          distance,
          coordinates: mosqueCoords ? {
            latitude: mosqueCoords.latitude || mosqueCoords.lat,
            longitude: mosqueCoords.longitude || mosqueCoords.lng
          } : mosque.coordinates
        };
      })
    );
    
    setIsCalculatingDistances(false);
    return mosquesWithDistances;
  };

  return {
    userLocation,
    setUserLocation,
    calculateMosqueDistances,
    isCalculatingDistances
  };
};
