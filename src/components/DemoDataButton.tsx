import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function DemoDataButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createDemoData = async () => {
    setLoading(true);
    
    try {
      // Check if demo data already exists
      const { data: existingDesigners } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'designer')
        .limit(1);

      if (existingDesigners && existingDesigners.length > 0) {
        toast({
          title: "Demo Data Exists",
          description: "Demo designers already exist in the database",
        });
        setLoading(false);
        return;
      }

      // Create demo user accounts and profiles
      const demoDesigners = [
        {
          email: 'priya.sharma@demo.com',
          password: 'demo123456',
          name: 'Priya Sharma',
          location: 'Mumbai, Maharashtra',
          age: 28,
          experience: 5,
          expertise: ['Ethnic', 'Bridal', 'Traditional'],
          bio: 'Award-winning designer specializing in contemporary ethnic fusion wear. Passionate about blending traditional Indian craftsmanship with modern aesthetics.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        },
        {
          email: 'arjun.mehta@demo.com',
          password: 'demo123456',
          name: 'Arjun Mehta',
          location: 'Delhi, Delhi',
          age: 35,
          experience: 12,
          expertise: ['Western', 'Casual', 'Sports'],
          bio: 'Minimalist designer focusing on sustainable fashion and streetwear. Featured in Fashion Week Delhi 2024.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        },
        {
          email: 'neha.patel@demo.com',
          password: 'demo123456',
          name: 'Neha Patel',
          location: 'Bangalore, Karnataka',
          age: 30,
          experience: 8,
          expertise: ['Indo-Western', 'Casual', 'Western'],
          bio: 'Tech-savvy designer creating smart wardrobe solutions. Combines functionality with style for the modern professional.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        },
        {
          email: 'rahul.kapoor@demo.com',
          password: 'demo123456',
          name: 'Rahul Kapoor',
          location: 'Jaipur, Rajasthan',
          age: 42,
          experience: 18,
          expertise: ['Bridal', 'Traditional', 'Ethnic'],
          bio: 'Master craftsman specializing in royal Rajasthani wedding attire. Third generation designer preserving heritage techniques.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        },
        {
          email: 'aisha.khan@demo.com',
          password: 'demo123456',
          name: 'Aisha Khan',
          location: 'Chennai, Tamil Nadu',
          age: 26,
          experience: 4,
          expertise: ['Ethnic', 'Indo-Western'],
          bio: 'Young innovative designer reimagining traditional South Indian textiles with contemporary silhouettes.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        },
        {
          email: 'vikram.singh@demo.com',
          password: 'demo123456',
          name: 'Vikram Singh',
          location: 'Kolkata, West Bengal',
          age: 38,
          experience: 15,
          expertise: ['Western', 'Casual', 'Sports'],
          bio: 'Sports fashion specialist with collaborations with top athletic brands. Comfort meets style in every design.',
          portfolio_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        },
      ];

      let createdCount = 0;
      
      for (const designer of demoDesigners) {
        try {
          // Create auth user
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: designer.email,
            password: designer.password,
            options: {
              data: {
                name: designer.name,
              },
            },
          });

          if (signUpError) {
            console.error(`Failed to create user ${designer.email}:`, signUpError);
            continue;
          }

          if (authData.user) {
            // Create profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: authData.user.id,
                user_type: 'designer',
                name: designer.name,
                location: designer.location,
                age: designer.age,
                experience: designer.experience,
                expertise: designer.expertise,
                bio: designer.bio,
                portfolio_image_url: designer.portfolio_image_url,
              });

            if (profileError) {
              console.error(`Failed to create profile for ${designer.email}:`, profileError);
            } else {
              createdCount++;
            }
          }
        } catch (error) {
          console.error(`Error creating designer ${designer.email}:`, error);
        }
      }

      toast({
        title: "Demo Data Created!",
        description: `Successfully created ${createdCount} demo designer profiles. Reload the page to see them.`,
      });

      // Reload after a short delay
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error: any) {
      console.error('Demo data creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create demo data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={createDemoData}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-antique-gold/30 text-antique-gold hover:bg-antique-gold/10"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Load Demo Data
        </>
      )}
    </Button>
  );
}
