import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Upload, Sparkles, Camera, Heart, Zap } from 'lucide-react';

const AIStyleAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: Camera,
      title: 'Wardrobe Upload',
      description: 'Upload photos of your clothing items for personalized styling'
    },
    {
      icon: Sparkles,
      title: 'AI Recommendations',
      description: 'Get outfit suggestions based on occasion, weather, and style'
    },
    {
      icon: Heart,
      title: 'Body Shape Analysis',
      description: 'Tailored recommendations for your unique body type'
    },
    {
      icon: Zap,
      title: 'Instant Styling',
      description: '5+ outfit combinations generated in seconds'
    }
  ];

  return (
    <>
      {/* Main Section */}
      <section className="py-20 bg-gradient-vintage-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 text-vintage-gold text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </div>

              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-vintage-ink mb-6 text-shadow-elegant">
                Your Personal <span className="text-vintage-gold">AI Stylist</span>
              </h2>

              <p className="text-lg text-vintage-ink/80 font-merriweather mb-8 leading-relaxed">
                Meet your intelligent fashion assistant. Upload your wardrobe, share your preferences, 
                and receive personalized outfit recommendations tailored to your body shape, 
                style preferences, and occasions.
              </p>

              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-vintage-gold" />
                    </div>
                    <div>
                      <h3 className="font-playfair font-semibold text-vintage-ink mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-vintage-ink/70 font-merriweather text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setIsOpen(true)}
                size="lg" 
                className="btn-vintage-gold text-lg px-8 py-4"
              >
                Try AI Stylist Now
              </Button>
            </div>

            {/* Preview */}
            <div className="relative">
              <Card className="card-vintage max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-vintage-gold/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-vintage-gold" />
                    </div>
                    <div>
                      <h3 className="font-playfair font-semibold text-vintage-ink">AI Stylist</h3>
                      <p className="text-xs text-vintage-ink/60">Fashion Assistant</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-vintage-gold/5 rounded-lg p-3 border border-vintage-gold/10">
                      <p className="text-sm text-vintage-ink font-merriweather">
                        👋 Hi! I'm your AI fashion assistant. Upload a photo of your outfit, 
                        and I'll suggest matching accessories and create 5 complete looks for you!
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 bg-vintage-cream/50 rounded-lg p-3 border border-dashed border-vintage-gold/30 text-center">
                        <Upload className="w-6 h-6 text-vintage-gold mx-auto mb-2" />
                        <p className="text-xs text-vintage-ink/70">Upload Photo</p>
                      </div>
                      <div className="flex-1 bg-vintage-cream/50 rounded-lg p-3 border border-dashed border-vintage-gold/30 text-center">
                        <Camera className="w-6 h-6 text-vintage-gold mx-auto mb-2" />
                        <p className="text-xs text-vintage-ink/70">Take Photo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-vintage-gold/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-vintage-burgundy/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="btn-vintage-gold rounded-full w-16 h-16 shadow-2xl hover:shadow-vintage-gold/20"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Modal Placeholder */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="card-vintage max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-playfair font-semibold text-vintage-ink">AI Fashion Assistant</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  ×
                </Button>
              </div>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-vintage-gold mx-auto mb-4" />
                <p className="text-vintage-ink/80 font-merriweather">
                  AI Stylist interface will be available after Supabase integration for backend functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIStyleAssistant;