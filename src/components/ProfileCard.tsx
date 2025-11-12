import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

type Profile = Tables<'profiles'>;

interface ProfileCardProps {
  profile: Profile & { distance_km?: number };
  showDistance?: boolean;
  showChatButton?: boolean;
  onChatClick?: (userId: string) => void;
  className?: string;
}

export const ProfileCard = ({ 
  profile, 
  showDistance = false, 
  showChatButton = false,
  onChatClick,
  className = "" 
}: ProfileCardProps) => {
  const navigate = useNavigate();
  
  const getProfileTypeColor = (userType: string) => {
    switch (userType) {
      case 'designer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tailor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`bg-canvas border-muted-ink/20 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-antique-gold/20">
            <AvatarImage src={profile.portfolio_image_url || undefined} />
            <AvatarFallback className="bg-antique-gold/10 text-ink font-semibold">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-ink truncate">{profile.name}</h3>
                <Badge variant="secondary" className={getProfileTypeColor(profile.user_type)}>
                  {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
                </Badge>
              </div>
              
              <div className="flex gap-2 ml-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/provider/${profile.id}`)}
                  className="border-muted-ink/20"
                >
                  View
                </Button>
                {showChatButton && onChatClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChatClick(profile.user_id)}
                    className="bg-antique-gold hover:bg-antique-gold/90 text-ink border-0"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                )}
              </div>
            </div>
            
            {profile.user_type === 'designer' && profile.expertise && profile.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.expertise.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.expertise.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.expertise.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            {profile.experience && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 text-antique-gold" />
                <span className="text-sm text-muted-ink font-medium">
                  {profile.experience} years experience
                </span>
              </div>
            )}
            
            {profile.bio && (
              <p className="text-sm text-muted-ink mb-2 line-clamp-2">
                {profile.bio}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-ink">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
              
              {showDistance && profile.distance_km !== undefined && (
                <span className="text-sm text-antique-gold font-medium">
                  {profile.distance_km.toFixed(1)} km away
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};