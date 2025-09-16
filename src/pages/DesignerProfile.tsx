import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Award, 
  User,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';

type Profile = Tables<'profiles'>;

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrFindConversation } = useConversations();
  const { toast } = useToast();
  const [designer, setDesigner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDesigner();
    }
  }, [id]);

  const fetchDesigner = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('user_type', 'designer')
        .single();

      if (error) throw error;
      setDesigner(data);
    } catch (error) {
      console.error('Error fetching designer:', error);
      toast({
        title: "Designer not found",
        description: "The designer profile you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/designers');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!user || !designer) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to message designers.",
        variant: "destructive",
      });
      return;
    }

    try {
      const conversationId = await createOrFindConversation(designer.user_id);
      if (conversationId) {
        navigate('/dashboard?tab=chats');
      }
    } catch (error) {
      toast({
        title: "Failed to start conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold mx-auto mb-4"></div>
          <p className="text-muted-ink">Loading designer profile...</p>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-muted-ink mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-ink mb-2">Designer not found</h2>
          <p className="text-muted-ink mb-4">The designer profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/designers')} className="bg-antique-gold hover:bg-antique-gold/90 text-ink">
            Browse Designers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-ink hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-antique-gold/20 to-muted-ink/20 rounded-full flex items-center justify-center">
                  {designer.portfolio_image_url ? (
                    <img 
                      src={designer.portfolio_image_url} 
                      alt={designer.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-ink" />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-playfair font-bold text-ink mb-2">
                      {designer.name}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-ink mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{designer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{designer.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-antique-gold fill-current" />
                        <span>4.8 (127 reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={handleStartChat}
                      className="bg-antique-gold hover:bg-antique-gold/90 text-ink"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Expertise */}
                {designer.expertise && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-ink mb-2">Specializations:</h3>
                    <div className="flex flex-wrap gap-2">
                      {designer.expertise.map((skill) => (
                        <Badge key={skill} className="bg-antique-gold/10 text-antique-gold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {designer.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-2">About:</h3>
                    <p className="text-muted-ink leading-relaxed">{designer.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-antique-gold" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Portfolio items would go here */}
                  <div className="aspect-square bg-gradient-to-br from-antique-gold/20 to-muted-ink/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-ink">Portfolio item 1</p>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-antique-gold/20 to-muted-ink/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-ink">Portfolio item 2</p>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-antique-gold/20 to-muted-ink/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-ink">Portfolio item 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-antique-gold" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mock reviews */}
                  <div className="border-b border-muted-ink/20 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-antique-gold/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-ink" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-ink">Sarah Johnson</h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-antique-gold fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-ink text-sm">
                          Absolutely amazing work! The designer understood my vision perfectly and delivered beyond expectations.
                        </p>
                        <p className="text-xs text-muted-ink/70 mt-2">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-muted-ink/20 rounded-lg p-4">
                    <h4 className="font-semibold text-ink mb-2">Custom Design Consultation</h4>
                    <p className="text-muted-ink text-sm mb-2">1-hour personalized styling session</p>
                    <p className="text-antique-gold font-semibold">₹2,500</p>
                  </div>
                  <div className="border border-muted-ink/20 rounded-lg p-4">
                    <h4 className="font-semibold text-ink mb-2">Complete Outfit Design</h4>
                    <p className="text-muted-ink text-sm mb-2">Full custom outfit with fitting</p>
                    <p className="text-antique-gold font-semibold">₹15,000 - ₹50,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Education</h4>
                    <p className="text-muted-ink">National Institute of Fashion Technology, New Delhi</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Certifications</h4>
                    <ul className="text-muted-ink space-y-1">
                      <li>• Certified Fashion Designer (NIFT)</li>
                      <li>• Sustainable Fashion Certificate</li>
                      <li>• Textile Design Specialization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Awards</h4>
                    <ul className="text-muted-ink space-y-1">
                      <li>• Best Emerging Designer 2023</li>
                      <li>• Sustainable Fashion Award 2022</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignerProfile;