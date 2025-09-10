import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Phone, Clock, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Tailors = () => {
  const cities = [
    {
      name: 'Mumbai',
      tailors: 24,
      featured: [
        {
          name: 'Rajesh Kumar Tailoring',
          specialties: ['Suits', 'Shirts', 'Alterations'],
          rating: 4.8,
          reviews: 156,
          experience: '15 years',
          location: 'Bandra West',
          contact: '+91 98765 43210'
        },
        {
          name: 'Master Stitch Studio',
          specialties: ['Ethnic Wear', 'Designer Outfits'],
          rating: 4.9,
          reviews: 203,
          experience: '20 years',
          location: 'Andheri East',
          contact: '+91 98765 43211'
        }
      ]
    },
    {
      name: 'Delhi',
      tailors: 32,
      featured: [
        {
          name: 'Capital Couture',
          specialties: ['Wedding Wear', 'Lehengas'],
          rating: 4.7,
          reviews: 89,
          experience: '12 years',
          location: 'Connaught Place',
          contact: '+91 98765 43212'
        },
        {
          name: 'Heritage Tailors',
          specialties: ['Traditional Wear', 'Sherwanis'],
          rating: 4.9,
          reviews: 267,
          experience: '25 years',
          location: 'Chandni Chowk',
          contact: '+91 98765 43213'
        }
      ]
    },
    {
      name: 'Bangalore',
      tailors: 18,
      featured: [
        {
          name: 'Tech City Tailoring',
          specialties: ['Formal Wear', 'Corporate Attire'],
          rating: 4.6,
          reviews: 134,
          experience: '10 years',
          location: 'Koramangala',
          contact: '+91 98765 43214'
        },
        {
          name: 'Silk Route Stitches',
          specialties: ['Sarees', 'Blouses', 'Silk Wear'],
          rating: 4.8,
          reviews: 178,
          experience: '18 years',
          location: 'Commercial Street',
          contact: '+91 98765 43215'
        }
      ]
    },
    {
      name: 'Jaipur',
      tailors: 15,
      featured: [
        {
          name: 'Royal Rajasthani Tailors',
          specialties: ['Traditional Rajasthani', 'Bandhani'],
          rating: 4.9,
          reviews: 245,
          experience: '30 years',
          location: 'Pink City Market',
          contact: '+91 98765 43216'
        }
      ]
    },
    {
      name: 'Chennai',
      tailors: 21,
      featured: [
        {
          name: 'South Silk Specialists',
          specialties: ['Silk Sarees', 'Traditional South Indian'],
          rating: 4.7,
          reviews: 167,
          experience: '22 years',
          location: 'T. Nagar',
          contact: '+91 98765 43217'
        }
      ]
    },
    {
      name: 'Kolkata',
      tailors: 19,
      featured: [
        {
          name: 'Bengal Boutique Tailoring',
          specialties: ['Bengali Traditional', 'Formal Wear'],
          rating: 4.8,
          reviews: 198,
          experience: '16 years',
          location: 'Park Street',
          contact: '+91 98765 43218'
        }
      ]
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-vintage-paper">
        {/* Header */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-vintage-gold/10 border border-vintage-gold/20 text-vintage-gold text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Skilled Artisan Network
              </div>

              <h1 className="text-5xl md:text-6xl font-playfair font-bold text-vintage-ink mb-6 text-shadow-elegant">
                Expert <span className="text-vintage-gold">Tailors</span>
              </h1>
              
              <p className="text-xl text-vintage-ink/80 font-merriweather max-w-3xl mx-auto">
                Connect with master craftsmen across India. From traditional wear to contemporary designs, 
                find skilled tailors who bring your fashion vision to life with precision and artistry.
              </p>
            </div>
          </div>
        </section>

      {/* Cities Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {cities.map((city, index) => (
              <div key={index} className="space-y-6">
                {/* City Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-playfair font-bold text-vintage-ink">
                    {city.name}
                  </h2>
                  <Badge className="bg-vintage-gold/10 text-vintage-gold border-vintage-gold/20">
                    {city.tailors} Tailors
                  </Badge>
                </div>

                {/* Featured Tailors */}
                <div className="space-y-4">
                  {city.featured.map((tailor, tailorIndex) => (
                    <Card key={tailorIndex} className="card-vintage hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-playfair font-semibold text-vintage-ink mb-1">
                              {tailor.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-vintage-ink/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              {tailor.location}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-vintage-gold fill-current" />
                              <span className="text-sm font-medium text-vintage-ink">{tailor.rating}</span>
                              <span className="text-xs text-vintage-ink/60">({tailor.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-vintage-ink/60">
                              <Clock className="w-3 h-3" />
                              {tailor.experience}
                            </div>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <p className="text-sm text-vintage-gold font-medium mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-2">
                            {tailor.specialties.map((specialty, specIndex) => (
                              <Badge 
                                key={specIndex} 
                                variant="outline" 
                                className="border-vintage-gold/30 text-vintage-ink text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button size="sm" className="btn-vintage-gold flex-1">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" className="border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Show More Button */}
                <Button 
                  variant="outline" 
                  className="w-full border-vintage-gold/30 text-vintage-ink hover:bg-vintage-gold/10"
                >
                  View All Tailors in {city.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
};

export default Tailors;