import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  lat: number;
  lng: number;
}

// This matches what the RPC functions actually return
interface NearbyProviderData {
  id: string;
  user_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  experience: number;
  bio: string;
  portfolio_image_url: string;
  distance_km: number;
  expertise?: string[];
}

// For compatibility with ProfileCard component
type NearbyProvider = NearbyProviderData & {
  user_type: string;
  age: number;
  created_at: string;
  updated_at: string;
  height: number | null;
  weight: number | null;
  waist: number | null;
  body_shape: string | null;
  gender: string | null;
  fashion_interests: string[] | null;
  coordinates: unknown;
  expertise: string[] | null;
};

export const useNearbyTailors = (userLocation: LocationData | null, radius: number = 50) => {
  const [tailors, setTailors] = useState<NearbyProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation) return;

    const findNearbyTailors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: rpcError } = await supabase
          .rpc('find_nearby_tailors', {
            user_lat: userLocation.lat,
            user_lng: userLocation.lng,
            radius_km: radius
          });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        console.log('Found nearby tailors:', data?.length || 0);
        
        // Transform the data to match expected type
        const transformedTailors = (data || []).map((tailor: NearbyProviderData) => ({
          ...tailor,
          user_type: 'tailor',
          age: 0,
          created_at: '',
          updated_at: '',
          height: null,
          weight: null,
          waist: null,
          body_shape: null,
          gender: null,
          fashion_interests: null,
          coordinates: null,
          expertise: null
        }));
        
        setTailors(transformedTailors);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to find nearby tailors';
        console.error('Error finding tailors:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    findNearbyTailors();
  }, [userLocation, radius]);

  return { tailors, loading, error };
};

export const useNearbyDesigners = (userLocation: LocationData | null, radius: number = 50) => {
  const [designers, setDesigners] = useState<NearbyProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation) return;

    const findNearbyDesigners = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: rpcError } = await supabase
          .rpc('find_nearby_designers', {
            user_lat: userLocation.lat,
            user_lng: userLocation.lng,
            radius_km: radius
          });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        console.log('Found nearby designers:', data?.length || 0);
        
        // Transform the data to match expected type
        const transformedDesigners = (data || []).map((designer: NearbyProviderData) => ({
          ...designer,
          user_type: 'designer',
          age: 0,
          created_at: '',
          updated_at: '',
          height: null,
          weight: null,
          waist: null,
          body_shape: null,
          gender: null,
          fashion_interests: null,
          coordinates: null,
          expertise: designer.expertise || null
        }));
        
        setDesigners(transformedDesigners);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to find nearby designers';
        console.error('Error finding designers:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    findNearbyDesigners();
  }, [userLocation, radius]);

  return { designers, loading, error };
};