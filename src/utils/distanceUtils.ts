
// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Function to extract coordinates from Google Maps link
export const extractCoordinatesFromMapsLink = (mapsLink: string): { lat: number; lng: number } | null => {
  try {
    // Pattern for Google Maps links with coordinates
    const coordPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapsLink.match(coordPattern);
    
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    
    // Pattern for place_id or other Google Maps URLs
    const placePattern = /place\/([^\/]+)/;
    const placeMatch = mapsLink.match(placePattern);
    
    if (placeMatch) {
      // For place-based URLs, we'll need to use the existing coordinates in the mosque data
      // or geocode the address
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting coordinates from maps link:', error);
    return null;
  }
};

// Function to geocode an address using Google Maps API
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!window.google) {
      resolve(null);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        resolve(null);
      }
    });
  });
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  }
  return `${distance.toFixed(1)}km`;
};
