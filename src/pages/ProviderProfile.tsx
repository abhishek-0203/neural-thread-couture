import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Calendar, MessageSquare, ArrowLeft, Award, Clock, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { BookingDialog } from '@/components/BookingDialog';
import { ReviewCard } from '@/components/ReviewCard';
import { AddReviewDialog } from '@/components/AddReviewDialog';

type Profile = Tables<'profiles'>;
type Review = Tables<'reviews'>;

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, [id]);

  const fetchProfile = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!profileData) return;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_user_id', profileData.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((acc, review) => acc + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleMessage = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to message providers",
        variant: "destructive",
      });
      return;
    }

    // Navigate to dashboard and open chat
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold mx-auto mb-4"></div>
          <p className="text-muted-ink">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-2">Profile Not Found</h2>
            <p className="text-muted-ink mb-4">The profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="bg-antique-gold hover:bg-antique-gold/90 text-ink">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-ink hover:text-antique-gold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-antique-gold/10 to-transparent">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-32 w-32 border-4 border-antique-gold">
                <AvatarImage src={profile.portfolio_image_url || undefined} />
                <AvatarFallback className="bg-antique-gold text-ink text-3xl">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-playfair font-bold text-ink mb-2">
                      {profile.name}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-ink">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                      {profile.experience && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{profile.experience} years experience</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-2 bg-canvas px-4 py-2 rounded-lg">
                      <Star className="h-5 w-5 text-antique-gold fill-current" />
                      <span className="text-2xl font-bold text-ink">
                        {averageRating > 0 ? averageRating : 'New'}
                      </span>
                      {reviews.length > 0 && (
                        <span className="text-sm text-muted-ink">({reviews.length} reviews)</span>
                      )}
                    </div>
                    <Badge className="bg-antique-gold text-ink">
                      {profile.user_type === 'designer' ? 'Fashion Designer' : 'Master Tailor'}
                    </Badge>
                  </div>
                </div>

                {/* Expertise Tags */}
                {profile.expertise && profile.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-antique-gold/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <p className="text-muted-ink mb-6 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowBooking(true)}
                    className="bg-antique-gold hover:bg-antique-gold/90 text-ink"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    className="border-antique-gold/30"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  {profile.user_type === 'designer' && (
                    <Button variant="outline" className="border-antique-gold/30">
                      <Award className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Reviews</CardTitle>
                {user && (
                  <Button
                    onClick={() => setShowReview(true)}
                    size="sm"
                    className="bg-antique-gold hover:bg-antique-gold/90 text-ink"
                  >
                    Write a Review
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-muted-ink mx-auto mb-4" />
                    <p className="text-muted-ink">No reviews yet</p>
                    <p className="text-sm text-muted-ink">Be the first to review this provider!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About {profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-ink mb-2">Professional Background</h3>
                  <p className="text-muted-ink">
                    {profile.bio || 'No additional information provided.'}
                  </p>
                </div>

                {profile.experience && (
                  <div>
                    <h3 className="font-semibold text-ink mb-2">Experience</h3>
                    <p className="text-muted-ink">{profile.experience} years in the industry</p>
                  </div>
                )}

                {profile.expertise && profile.expertise.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-ink mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio & Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-muted-ink mx-auto mb-4" />
                  <p className="text-muted-ink">Portfolio coming soon</p>
                  <p className="text-sm text-muted-ink">
                    This feature will showcase the provider's previous work and designs
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      {profile && (
        <BookingDialog
          open={showBooking}
          onOpenChange={setShowBooking}
          providerId={profile.user_id}
          providerName={profile.name}
          onSuccess={() => {
            setShowBooking(false);
            toast({
              title: "Booking Requested",
              description: "Your booking request has been sent successfully!",
            });
          }}
        />
      )}

      {/* Add Review Dialog */}
      {profile && (
        <AddReviewDialog
          open={showReview}
          onOpenChange={setShowReview}
          reviewedUserId={profile.user_id}
          onSuccess={() => {
            setShowReview(false);
            fetchReviews();
            toast({
              title: "Review Posted",
              description: "Thank you for your feedback!",
            });
          }}
        />
      )}
    </div>
  );
}
