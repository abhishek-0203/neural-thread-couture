import { useState } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const err = {
        code: 0,
        message: 'Geolocation is not supported by this browser'
      };
      setError(err);
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
        console.log('Location obtained:', position.coords);
      },
      (err) => {
        const errorMap = {
          1: 'Location access denied by user',
          2: 'Location information unavailable',
          3: 'Location request timeout'
        };
        
        setError({
          code: err.code,
          message: errorMap[err.code as keyof typeof errorMap] || 'Unknown location error'
        });
        setLoading(false);
        console.error('Geolocation error:', err);
      },
      options
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: LocationData, point2: LocationData): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearLocation,
    calculateDistance
  };
};