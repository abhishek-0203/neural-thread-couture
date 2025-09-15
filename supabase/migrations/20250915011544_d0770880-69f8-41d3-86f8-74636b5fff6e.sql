-- Fix function search path security issues
CREATE OR REPLACE FUNCTION find_nearby_tailors(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  experience INTEGER,
  bio TEXT,
  portfolio_image_url TEXT,
  distance_km DECIMAL
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.location,
    p.latitude,
    p.longitude,
    p.experience,
    p.bio,
    p.portfolio_image_url,
    ST_Distance(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(p.longitude, p.latitude)::geography
    ) / 1000 AS distance_km
  FROM profiles p
  WHERE 
    p.user_type = 'tailor' 
    AND p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(p.longitude, p.latitude)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 20;
$$;

-- Fix the designers function as well
CREATE OR REPLACE FUNCTION find_nearby_designers(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  experience INTEGER,
  expertise TEXT[],
  bio TEXT,
  portfolio_image_url TEXT,
  distance_km DECIMAL
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.location,
    p.latitude,
    p.longitude,
    p.experience,
    p.expertise,
    p.bio,
    p.portfolio_image_url,
    ST_Distance(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(p.longitude, p.latitude)::geography
    ) / 1000 AS distance_km
  FROM profiles p
  WHERE 
    p.user_type = 'designer' 
    AND p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(p.longitude, p.latitude)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 20;
$$;