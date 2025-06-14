
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

declare namespace google {
  namespace maps {
    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    interface GeocoderRequest {
      address?: string;
      placeId?: string;
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: LatLng;
      };
    }

    type GeocoderStatus = string;

    class LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (predictions: AutocompletePrediction[], status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        types?: string[];
        componentRestrictions?: { country: string };
      }

      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      enum PlacesServiceStatus {
        OK = 'OK'
      }
    }
  }
}
