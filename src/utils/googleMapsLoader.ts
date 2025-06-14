
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
  return new Promise((resolve) => {
    if (isLoaded) {
      resolve();
      return;
    }

    callbacks.push(resolve);

    if (isLoading) {
      return;
    }

    isLoading = true;

    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      console.error('Failed to load Google Maps script');
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
    };
    
    document.head.appendChild(script);
  });
};
