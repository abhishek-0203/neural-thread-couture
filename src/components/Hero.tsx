import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-fashion-workspace.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-vintage-parchment/85 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 text-vintage-gold text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Fashion Revolution
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-vintage-ink mb-6 text-shadow-elegant">
            Neural <span className="text-vintage-gold">Threads</span>
            <br />
            <span className="text-4xl md:text-5xl text-vintage-burgundy">Cognitive Couture</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-vintage-ink/80 font-merriweather max-w-3xl mx-auto mb-8 leading-relaxed">
            Where traditional craftsmanship meets artificial intelligence. 
            Connecting designers, customers, and skilled artisans in India's digital fashion ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-vintage-gold text-lg px-8 py-4">
              Discover Designers
            </Button>
            <Button variant="outline" size="lg" className="border-vintage-gold/50 text-vintage-ink hover:bg-vintage-gold/10 text-lg px-8 py-4">
              Try AI Stylist
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 mb-4">
                <Palette className="w-8 h-8 text-vintage-gold" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-vintage-ink mb-2">Designer Portfolios</h3>
              <p className="text-vintage-ink/70 font-merriweather">
                Showcase your creative work and connect with fashion enthusiasts
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 mb-4">
                <Zap className="w-8 h-8 text-vintage-gold" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-vintage-ink mb-2">AI-Powered Styling</h3>
              <p className="text-vintage-ink/70 font-merriweather">
                Personalized outfit recommendations based on your unique style
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 mb-4">
                <Users className="w-8 h-8 text-vintage-gold" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-vintage-ink mb-2">Artisan Network</h3>
              <p className="text-vintage-ink/70 font-merriweather">
                Connect with skilled tailors and craftsmen across India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-vintage-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-vintage-burgundy/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;