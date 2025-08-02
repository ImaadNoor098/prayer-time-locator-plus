import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompassData {
  heading: number;
  accuracy: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

// Extend DeviceOrientationEvent to include WebKit properties
interface WebKitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
}

// Kaaba coordinates
const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262
};

const QiblaFinder: React.FC = () => {
  const navigate = useNavigate();
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isCompassSupported, setIsCompassSupported] = useState<boolean>(true);
  const [isLocationGranted, setIsLocationGranted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [compassAccuracy, setCompassAccuracy] = useState<number>(0);

  // Calculate Qibla direction based on user location
  const calculateQiblaDirection = (userLat: number, userLng: number): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const lat1 = toRadians(userLat);
    const lat2 = toRadians(KAABA_COORDINATES.latitude);
    const deltaLng = toRadians(KAABA_COORDINATES.longitude - userLng);

    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = Math.atan2(x, y);
    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  // Request location permission
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setIsLocationGranted(true);
        const qiblaDir = calculateQiblaDirection(location.latitude, location.longitude);
        setQiblaDirection(qiblaDir);
        setIsLoading(false);
      },
      (error) => {
        setError(`Location access denied: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Initialize compass with enhanced handling
  useEffect(() => {
    let watchId: number;
    let calibrationTimeout: NodeJS.Timeout;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const webkitEvent = event as WebKitDeviceOrientationEvent;
        // Enhanced compass calculation
        let heading = event.alpha;
        
        // For iOS, adjust the heading calculation
        if (webkitEvent.webkitCompassHeading) {
          heading = webkitEvent.webkitCompassHeading;
        } else {
          heading = 360 - heading;
        }
        
        setCompassHeading(heading);
        setCompassAccuracy(webkitEvent.webkitCompassAccuracy || 0);
        
        // Auto-calibration after stable readings
        if (!isCalibrated) {
          clearTimeout(calibrationTimeout);
          calibrationTimeout = setTimeout(() => {
            setIsCalibrated(true);
          }, 3000);
        }
      }
    };

    const handleDeviceOrientationAbsolute = (event: DeviceOrientationEvent) => {
      if (event.absolute && event.alpha !== null) {
        const webkitEvent = event as WebKitDeviceOrientationEvent;
        setCompassHeading(360 - event.alpha);
        setCompassAccuracy(webkitEvent.webkitCompassAccuracy || 0);
      }
    };

    const checkCompassSupport = async () => {
      if ('DeviceOrientationEvent' in window) {
        // For iOS 13+ devices, request permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission === 'granted') {
              window.addEventListener('deviceorientationabsolute', handleDeviceOrientationAbsolute, true);
              window.addEventListener('deviceorientation', handleDeviceOrientation, true);
              setIsCompassSupported(true);
            } else {
              setIsCompassSupported(false);
              setError('Compass permission denied. Please grant permission for accurate direction.');
            }
          } catch (error) {
            setIsCompassSupported(false);
            setError('Compass not supported on this device.');
          }
        } else {
          // For Android and other devices
          window.addEventListener('deviceorientationabsolute', handleDeviceOrientationAbsolute, true);
          window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          setIsCompassSupported(true);
        }
      } else {
        setIsCompassSupported(false);
        setError('Device orientation not supported. Please use a mobile device with compass capability.');
      }
    };

    checkCompassSupport();
    requestLocation();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientationAbsolute);
      clearTimeout(calibrationTimeout);
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isCalibrated]);

  const getRelativeQiblaDirection = () => {
    if (!isLocationGranted) return 0;
    // Calculate the angle between current device heading and Qibla direction
    // This ensures the Qibla arrow always points correctly relative to device orientation
    return (qiblaDirection - compassHeading + 360) % 360;
  };

  const getQiblaArrowRotation = () => {
    if (!isLocationGranted) return 0;
    // The arrow should point towards Qibla direction relative to the top of the screen
    return getRelativeQiblaDirection();
  };

  const formatDirection = (degrees: number) => {
    return `${Math.round(degrees)}°`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-islamic-cream via-background to-islamic-soft flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground font-arabic-sans">Loading Qibla Finder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-cream via-background to-islamic-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold font-arabic">Qibla Finder</h1>
        <div className="w-16" />
      </div>

      <div className="container mx-auto max-w-lg px-4 py-8">
        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Compass */}
        <Card className="p-8 mb-6 modern-islamic-card text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Compass Ring */}
            <div 
              className="absolute inset-0 border-4 border-border rounded-full"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  hsl(var(--primary)) 0deg 5deg,
                  transparent 5deg 85deg,
                  hsl(var(--primary)) 85deg 95deg,
                  transparent 95deg 175deg,
                  hsl(var(--primary)) 175deg 185deg,
                  transparent 185deg 265deg,
                  hsl(var(--primary)) 265deg 275deg,
                  transparent 275deg 355deg,
                  hsl(var(--primary)) 355deg 360deg
                )`
              }}
            >
              {/* Cardinal Directions */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg font-bold text-primary">N</div>
              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-lg font-bold text-muted-foreground">E</div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-lg font-bold text-muted-foreground">S</div>
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-lg font-bold text-muted-foreground">W</div>
            </div>

            {/* Compass Needle/Phone Orientation */}
            {isCompassSupported && (
              <div 
                className="absolute inset-4 transition-transform duration-300"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              >
                <Navigation className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 h-6 w-6 text-blue-500" />
              </div>
            )}

            {/* Qibla Direction Pointer - Always points to top of screen when facing Qibla */}
            {isLocationGranted && (
              <div 
                className="absolute inset-8 transition-transform duration-500"
                style={{ transform: `rotate(${getQiblaArrowRotation()}deg)` }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-qibla-pulse shadow-lg">
                    <div className="text-white text-xs font-bold">🕋</div>
                  </div>
                  {/* Arrow pointing upward */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-600"></div>
                </div>
              </div>
            )}

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Direction Information */}
          <div className="space-y-4">
            <div className="text-2xl font-bold font-arabic text-primary">
              {isLocationGranted ? `${formatDirection(qiblaDirection)} from North` : 'Location Required'}
            </div>
            
            {isLocationGranted && (
              <div className="text-sm text-muted-foreground">
                Current compass heading: {formatDirection(compassHeading)}
              </div>
            )}
          </div>
        </Card>

        {/* Calibration Status */}
        {isCompassSupported && !isCalibrated && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Calibrating compass... Move your device in a figure-8 pattern for better accuracy.
            </AlertDescription>
          </Alert>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 modern-islamic-card text-center">
            <MapPin className={`h-6 w-6 mx-auto mb-2 ${isLocationGranted ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="text-sm font-medium">Location</div>
            <div className="text-xs text-muted-foreground">
              {isLocationGranted ? 'Granted' : 'Required'}
            </div>
          </Card>

          <Card className="p-4 modern-islamic-card text-center">
            <Navigation className={`h-6 w-6 mx-auto mb-2 ${isCompassSupported ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="text-sm font-medium">Compass</div>
            <div className="text-xs text-muted-foreground">
              {isCompassSupported ? 'Active' : 'Not Supported'}
            </div>
          </Card>

          <Card className="p-4 modern-islamic-card text-center">
            <div className={`h-6 w-6 mx-auto mb-2 rounded-full flex items-center justify-center ${isCalibrated ? 'bg-green-600' : 'bg-yellow-500'}`}>
              <div className="text-white text-xs">✓</div>
            </div>
            <div className="text-sm font-medium">Calibration</div>
            <div className="text-xs text-muted-foreground">
              {isCalibrated ? 'Ready' : 'Calibrating...'}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-4 modern-islamic-card">
          <h3 className="font-semibold mb-2 font-arabic">How to Use:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Hold your device flat and parallel to the ground</li>
            <li>• The red Kaaba icon shows the Qibla direction</li>
            <li>• Face the direction of the Kaaba icon to pray</li>
            <li>• The compass automatically adjusts as you move</li>
          </ul>
        </Card>

        {!isLocationGranted && (
          <Button 
            onClick={requestLocation}
            className="w-full mt-4 bg-primary hover:bg-primary/90"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Grant Location Access
          </Button>
        )}
      </div>
    </div>
  );
};

export default QiblaFinder;