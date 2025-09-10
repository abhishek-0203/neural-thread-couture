import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-vintage-paper flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-playfair font-bold text-vintage-gold mb-4 text-shadow-elegant">404</h1>
          <h2 className="text-2xl font-playfair font-semibold text-vintage-ink mb-4">Page Not Found</h2>
          <p className="text-vintage-ink/70 font-merriweather mb-8">
            The page you're looking for seems to have wandered off into the digital atelier. 
            Let's get you back to the main collection.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="border-vintage-gold/50 text-vintage-ink hover:bg-vintage-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = "/"} 
            className="btn-vintage-gold"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
