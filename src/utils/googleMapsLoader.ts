
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

let isLoaded = false;
let isLoading = false;
const callbacks: (() => void)[] = [];

export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isLoaded) {
      resolve();
      return;
    }

    callbacks.push(resolve);

    if (isLoading) {
      return;
    }

    isLoading = true;

    // Check if API key is available
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      console.error('Google Maps API key is not configured properly');
      isLoading = false;
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      console.error('Failed to load Google Maps script');
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
      reject(new Error('Failed to load Google Maps script'));
    };
    
    document.head.appendChild(script);
  });
};
