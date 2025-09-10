import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Palette, Users, Scissors, MessageCircle, User } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Designers', href: '/designers', icon: Palette },
    { name: 'Tailors', href: '/tailors', icon: Scissors },
    { name: 'AI Stylist', href: '/stylist', icon: MessageCircle },
    { name: 'Community', href: '/community', icon: Users },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-playfair font-bold text-vintage-ink text-shadow-elegant">
              Neural <span className="text-vintage-gold">Threads</span>
            </h1>
            <p className="text-xs text-vintage-ink/70 font-merriweather">Cognitive Couture</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-vintage-ink/80 hover:text-vintage-gold px-3 py-2 text-sm font-merriweather transition-colors duration-200 flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10">
              Sign In
            </Button>
            <Button size="sm" className="btn-vintage-gold">
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-vintage-ink"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card/90 backdrop-blur-sm rounded-lg mb-4 border border-border/30">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-vintage-ink/80 hover:text-vintage-gold block px-3 py-2 text-sm font-merriweather transition-colors duration-200 flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline" size="sm" className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10">
                  Sign In
                </Button>
                <Button size="sm" className="btn-vintage-gold">
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;