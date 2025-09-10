import { Palette, Users, Scissors, MessageCircle, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const navigation = {
    services: [
      { name: 'Designer Portfolios', href: '/designers' },
      { name: 'AI Fashion Assistant', href: '/stylist' },
      { name: 'Expert Tailors', href: '/tailors' },
      { name: 'Community Hub', href: '/community' },
    ],
    categories: [
      { name: 'Ethnic Wear', href: '/designers?category=ethnic' },
      { name: 'Western Fashion', href: '/designers?category=western' },
      { name: 'Indo-Western', href: '/designers?category=indo-western' },
      { name: 'Bridal Couture', href: '/designers?category=bridal' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Contact Us', href: '/contact' },
    ],
  };

  return (
    <footer className="bg-vintage-sepia text-vintage-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-playfair font-bold mb-4 text-vintage-gold">
              Neural Threads
            </h2>
            <p className="text-vintage-parchment/80 font-merriweather text-sm mb-6 leading-relaxed">
              Revolutionizing fashion through AI technology. Connecting designers, 
              customers, and artisans in India's digital fashion ecosystem.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-vintage-parchment/70">
                <Mail className="w-4 h-4 text-vintage-gold" />
                hello@neuralthreads.in
              </div>
              <div className="flex items-center gap-3 text-sm text-vintage-parchment/70">
                <Phone className="w-4 h-4 text-vintage-gold" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-sm text-vintage-parchment/70">
                <MapPin className="w-4 h-4 text-vintage-gold" />
                Mumbai, India
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-playfair font-semibold text-vintage-gold mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-vintage-parchment/80 hover:text-vintage-gold transition-colors duration-200 text-sm font-merriweather"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-playfair font-semibold text-vintage-gold mb-6">
              Categories
            </h3>
            <ul className="space-y-3">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-vintage-parchment/80 hover:text-vintage-gold transition-colors duration-200 text-sm font-merriweather"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-playfair font-semibold text-vintage-gold mb-6">
              Support
            </h3>
            <ul className="space-y-3 mb-6">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-vintage-parchment/80 hover:text-vintage-gold transition-colors duration-200 text-sm font-merriweather"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language Support Note */}
            <div className="bg-vintage-gold/10 border border-vintage-gold/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-vintage-gold mb-2">
                Multilingual Support
              </h4>
              <p className="text-xs text-vintage-parchment/70 font-merriweather">
                Available in Hindi, Tamil, Telugu, Bengali, Marathi, and more regional languages.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-vintage-gold/20 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-vintage-parchment/70 font-merriweather mb-4 md:mb-0">
              <span>© 2024 Neural Threads. Made with</span>
              <Heart className="w-4 h-4 text-vintage-gold fill-current" />
              <span>in India</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-xs text-vintage-parchment/60">
                <span className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  Designers
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  AI Styling
                </span>
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3" />
                  Tailors
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Community
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;