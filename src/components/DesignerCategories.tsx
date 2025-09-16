import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users } from 'lucide-react';

const DesignerCategories = () => {
  const categories = [
    {
      name: 'Ethnic',
      description: 'Traditional Indian wear with contemporary touches',
      designers: 24,
      featured: 'Priya Sharma',
      rating: 4.8,
      location: 'Mumbai',
      image: '/api/placeholder/300/200',
      specialty: 'Lehengas & Sarees'
    },
    {
      name: 'Western',
      description: 'Modern western fashion with global appeal',
      designers: 18,
      featured: 'Arjun Menon',
      rating: 4.9,
      location: 'Bangalore',
      image: '/api/placeholder/300/200',
      specialty: 'Formal & Casual'
    },
    {
      name: 'Indo-Western',
      description: 'Perfect fusion of traditional and modern styles',
      designers: 15,
      featured: 'Kavya Patel',
      rating: 4.7,
      location: 'Delhi',
      image: '/api/placeholder/300/200',
      specialty: 'Fusion Wear'
    },
    {
      name: 'Bridal',
      description: 'Exquisite bridal couture for special occasions',
      designers: 12,
      featured: 'Rohit Kumar',
      rating: 4.9,
      location: 'Jaipur',
      image: '/api/placeholder/300/200',
      specialty: 'Wedding Ensembles'
    },
    {
      name: 'Sports',
      description: 'Athletic wear designed for performance and style',
      designers: 8,
      featured: 'Sneha Reddy',
      rating: 4.6,
      location: 'Chennai',
      image: '/api/placeholder/300/200',
      specialty: 'Activewear'
    },
    {
      name: 'Casual',
      description: 'Comfortable everyday wear with style',
      designers: 22,
      featured: 'Vikram Singh',
      rating: 4.5,
      location: 'Pune',
      image: '/api/placeholder/300/200',
      specialty: 'Daily Wear'
    },
  ];

  return (
    <section className="py-20 bg-vintage-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-vintage-ink mb-6 text-shadow-elegant">
            Designer <span className="text-vintage-gold">Categories</span>
          </h2>
          <p className="text-lg text-vintage-ink/80 font-merriweather max-w-2xl mx-auto">
            Discover talented designers across diverse fashion categories, each bringing unique expertise and creative vision
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="card-vintage hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
              onClick={() => window.location.href = `/designers/${category.name.toLowerCase()}`}
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-vintage-gold/20 to-vintage-burgundy/20 flex items-center justify-center">
                  <div className="text-6xl font-playfair font-bold text-vintage-gold/30 group-hover:text-vintage-gold/50 transition-colors duration-300">
                    {category.name[0]}
                  </div>
                </div>
                <Badge className="absolute top-4 right-4 bg-vintage-gold text-vintage-ink">
                  {category.designers} Designers
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-vintage-ink mb-2 group-hover:text-vintage-gold transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-vintage-ink/70 font-merriweather text-sm mb-4">
                  {category.description}
                </p>

                {/* Featured Designer */}
                <div className="border-t border-vintage-gold/20 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-vintage-gold font-medium uppercase tracking-wider">
                      Featured Designer
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-vintage-gold fill-current" />
                      <span className="text-xs text-vintage-ink/80">{category.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-merriweather font-semibold text-vintage-ink text-sm">
                        {category.featured}
                      </h4>
                      <p className="text-xs text-vintage-ink/60">{category.specialty}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-vintage-ink/60">
                      <MapPin className="w-3 h-3" />
                      {category.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            className="btn-vintage-outline px-8 py-3 text-lg font-merriweather rounded-lg"
            onClick={() => window.location.href = '/designers'}
          >
            Explore All Designers
          </button>
        </div>
      </div>
    </section>
  );
};

export default DesignerCategories;