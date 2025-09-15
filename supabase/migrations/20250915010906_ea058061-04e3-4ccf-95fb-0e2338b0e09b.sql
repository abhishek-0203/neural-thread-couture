-- Enable PostGIS extension for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add location columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);

-- Create conversations table for chat system
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- Create messages table for chat system
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video_call')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view conversations they are part of" 
ON conversations FOR SELECT 
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" 
ON conversations FOR INSERT 
WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their conversations" 
ON messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

-- Create function to find nearby tailors
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

-- Create function to find nearby designers
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

-- Enable realtime for chat system
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE messages;
ALTER publication supabase_realtime ADD TABLE conversations;

-- Create updated_at trigger for conversations
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();