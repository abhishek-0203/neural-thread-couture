import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Users, 
  Settings,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useChat';
import { supabase } from '@/integrations/supabase/client';
import { AIStylistChat } from '@/components/AIStylistChat';
import { LocationBasedProviders } from '@/components/LocationBasedProviders';
import { ChatInterface } from '@/components/ChatInterface';
import { ProfileCard } from '@/components/ProfileCard';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export default function Dashboard() {
  const { user } = useAuth();
  const { conversations, createOrFindConversation } = useConversations();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [activeChat, setActiveChat] = useState<{conversationId: string, otherUser: Profile} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        console.log('No user found, skipping profile fetch');
        setLoading(false);
        return;
      }
      
      console.log('Fetching profile for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Profile fetch error:', error);
          throw error;
        }
        
        console.log('Profile data received:', data);
        setUserProfile(data ?? null);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChatWithProvider = async (otherUserId: string) => {
    try {
      const conversationId = await createOrFindConversation(otherUserId);
      if (!conversationId) return;

      // Get the other user's profile
      const { data: otherUserProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', otherUserId)
        .maybeSingle();

      if (otherUserProfile) {
        setActiveChat({
          conversationId,
          otherUser: otherUserProfile
        });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold mx-auto mb-4"></div>
          <p className="text-muted-ink">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-ink mb-4">Please complete your profile setup first.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Go to Profile Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">AI Consultations</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Sparkles className="h-8 w-8 text-white/80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Chats</p>
              <p className="text-2xl font-bold">{conversations.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-white/80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Connections</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Users className="h-8 w-8 text-white/80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProfileOverview = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-antique-gold" />
          Welcome back, {userProfile.name}!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-antique-gold/10 text-antique-gold">
                {userProfile.user_type.charAt(0).toUpperCase() + userProfile.user_type.slice(1)}
              </Badge>
              <Badge variant="outline">
                📍 {userProfile.location}
              </Badge>
              {userProfile.experience && (
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  {userProfile.experience} years
                </Badge>
              )}
            </div>
            
            {userProfile.bio && (
              <p className="text-muted-ink text-sm mb-4 line-clamp-3">
                {userProfile.bio}
              </p>
            )}

            {userProfile.user_type === 'designer' && userProfile.expertise && (
              <div className="flex flex-wrap gap-1">
                {userProfile.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (activeChat) {
    return (
      <div className="min-h-screen bg-canvas p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInterface
            conversationId={activeChat.conversationId}
            otherUser={activeChat.otherUser}
            onBack={() => setActiveChat(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto p-6">
        <ProfileOverview />
        <DashboardStats />

        <Tabs defaultValue="ai-stylist" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-stylist" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Stylist
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Find Nearby
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages ({conversations.length})
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-stylist" className="mt-6">
            <AIStylistChat userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="nearby" className="mt-6">
            <LocationBasedProviders onChatWithProvider={handleChatWithProvider} />
          </TabsContent>

          <TabsContent value="chats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-ink mx-auto mb-4" />
                    <p className="text-muted-ink">No conversations yet</p>
                    <p className="text-sm text-muted-ink">
                      Start chatting with designers and tailors to see your conversations here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <Card key={conv.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Conversation</h4>
                              <p className="text-sm text-muted-ink">
                                Last updated: {new Date(conv.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // You'd implement this to open the specific conversation
                                console.log('Open conversation:', conv.id);
                              }}
                            >
                              Open Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-antique-gold" />
                  Fashion Trends & Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-pink-50 to-purple-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">🌟 Trending Now</h3>
                      <p className="text-sm text-muted-ink mb-4">
                        Sustainable fashion is making waves. Discover eco-friendly brands and designers.
                      </p>
                      <Button size="sm" variant="outline">Explore</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">🎨 Style Guide</h3>
                      <p className="text-sm text-muted-ink mb-4">
                        Learn how to mix and match colors for your perfect wardrobe.
                      </p>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}