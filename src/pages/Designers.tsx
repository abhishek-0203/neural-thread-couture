import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Search, Filter, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { DemoDataButton } from '@/components/DemoDataButton';

type Profile = Tables<'profiles'>;

const Designers = () => {
  const { category } = useParams();
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  const categories = [
    'All', 'Ethnic', 'Western', 'Sports', 'Indo-Western', 'Casual', 'Bridal'
  ];

  useEffect(() => {
    fetchDesigners();
  }, [category]);

  const fetchDesigners = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'designer');

      if (category && category !== 'all') {
        query = query.contains('expertise', [category]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDesigners(data || []);
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || designer.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesExperience = experienceFilter === 'all' || !experienceFilter || 
      (experienceFilter === 'junior' && (designer.experience || 0) < 3) ||
      (experienceFilter === 'mid' && (designer.experience || 0) >= 3 && (designer.experience || 0) < 8) ||
      (experienceFilter === 'senior' && (designer.experience || 0) >= 8);
    
    return matchesSearch && matchesLocation && matchesExperience;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold mx-auto mb-4"></div>
          <p className="text-muted-ink">Loading designers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-ink mb-4">
            {category && category !== 'all' 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Designers`
              : 'Fashion Designers'
            }
          </h1>
          <p className="text-lg text-muted-ink max-w-2xl mx-auto mb-4">
            Discover talented fashion designers who can bring your vision to life
          </p>
          <DemoDataButton />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/designers/${cat.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (category === cat.toLowerCase() || (!category && cat === 'All'))
                  ? 'bg-antique-gold text-ink'
                  : 'bg-card text-muted-ink hover:bg-antique-gold/10'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-ink h-4 w-4" />
              <Input
                placeholder="Search designers or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-muted-ink/20"
              />
            </div>
            <Input
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="border-muted-ink/20"
            />
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="border-muted-ink/20">
                <SelectValue placeholder="Experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="junior">Junior (0-3 years)</SelectItem>
                <SelectItem value="mid">Mid-level (3-8 years)</SelectItem>
                <SelectItem value="senior">Senior (8+ years)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setExperienceFilter('all');
              }}
              className="border-muted-ink/20"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Designers Grid */}
        {filteredDesigners.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-ink mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ink mb-2">No designers found</h3>
            <p className="text-muted-ink">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer) => (
              <Card key={designer.id} className="bg-card border-muted-ink/20 hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-ink group-hover:text-antique-gold transition-colors">
                        {designer.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-ink" />
                        <span className="text-sm text-muted-ink">{designer.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-antique-gold fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Experience */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-ink">Experience:</span>
                      <span className="font-medium text-ink">
                        {designer.experience} years
                      </span>
                    </div>

                    {/* Expertise */}
                    {designer.expertise && (
                      <div>
                        <p className="text-sm text-muted-ink mb-2">Specializes in:</p>
                        <div className="flex flex-wrap gap-1">
                          {designer.expertise.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {designer.expertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{designer.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio Preview */}
                    {designer.bio && (
                      <p className="text-sm text-muted-ink line-clamp-2">
                        {designer.bio}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        asChild 
                        className="flex-1 bg-antique-gold hover:bg-antique-gold/90 text-ink"
                      >
                        <Link to={`/provider/${designer.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="border-muted-ink/20">
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Designers;