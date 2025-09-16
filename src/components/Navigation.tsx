import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Palette, Users, Scissors, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    }
  };

  const navItems = [
    { name: 'Designers', href: '/designers', icon: Palette },
    { name: 'Tailors', href: '/tailors', icon: Scissors },
    { name: 'Dashboard', href: '/dashboard', icon: MessageCircle },
    { name: 'Community', href: '/community', icon: Users },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <h1 className="text-2xl font-playfair font-bold text-vintage-ink text-shadow-elegant">
                Neural <span className="text-vintage-gold">Threads</span>
              </h1>
              <p className="text-xs text-vintage-ink/70 font-merriweather">Cognitive Couture</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-vintage-ink/80 hover:text-vintage-gold px-3 py-2 text-sm font-merriweather transition-colors duration-200 flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-vintage-ink">
                    Welcome back!
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/auth')}
                    className="btn-vintage-gold"
                  >
                    Join Now
                  </Button>
                </>
              )
            )}
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
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-vintage-ink/80 hover:text-vintage-gold block px-3 py-2 text-sm font-merriweather transition-colors duration-200 flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-2">
                {!loading && (
                  user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-vintage-ink px-3">
                        Welcome back!
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSignOut}
                        className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/auth')}
                        className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10"
                      >
                        Sign In
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => navigate('/auth')}
                        className="btn-vintage-gold"
                      >
                        Join Now
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;