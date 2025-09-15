import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, Users, AlertCircle, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyTailors, useNearbyDesigners } from '@/hooks/useNearbyProviders';
import { ProfileCard } from './ProfileCard';

interface LocationBasedProvidersProps {
  onChatWithProvider?: (userId: string) => void;
}

export const LocationBasedProviders = ({ onChatWithProvider }: LocationBasedProvidersProps) => {
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();
  const { tailors, loading: tailorsLoading, error: tailorsError } = useNearbyTailors(location);
  const { designers, loading: designersLoading, error: designersError } = useNearbyDesigners(location);

  const hasRequestedLocation = location || locationError;

  return (
    <Card className="bg-canvas border-muted-ink/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ink">
          <MapPin className="h-5 w-5 text-antique-gold" />
          Nearby Fashion Professionals
        </CardTitle>
        <p className="text-sm text-muted-ink">
          Find talented designers and tailors in your area
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasRequestedLocation && (
          <div className="text-center py-8">
            <Navigation className="h-12 w-12 text-antique-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink mb-2">
              Enable Location Services
            </h3>
            <p className="text-sm text-muted-ink mb-4">
              We'll use your location to find the best fashion professionals near you
            </p>
            <Button 
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="bg-antique-gold hover:bg-antique-gold/90 text-ink"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Professionals Near Me
                </>
              )}
            </Button>
          </div>
        )}

        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locationError.message}. Please enable location services or try again.
            </AlertDescription>
          </Alert>
        )}

        {location && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-antique-gold/10 text-antique-gold border-antique-gold/20">
                <MapPin className="h-3 w-3 mr-1" />
                Location Detected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={locationLoading}
              >
                Refresh
              </Button>
            </div>

            <Tabs defaultValue="tailors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tailors" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tailors ({tailors.length})
                </TabsTrigger>
                <TabsTrigger value="designers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Designers ({designers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tailors" className="mt-4">
                {tailorsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-antique-gold mb-2" />
                    <p className="text-sm text-muted-ink">Finding nearby tailors...</p>
                  </div>
                ) : tailorsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{tailorsError}</AlertDescription>
                  </Alert>
                ) : tailors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-ink mx-auto mb-4" />
                    <p className="text-sm text-muted-ink">
                      No tailors found in your area. Try increasing the search radius.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tailors.map((tailor) => (
                      <ProfileCard
                        key={tailor.id}
                        profile={tailor}
                        showDistance={true}
                        showChatButton={!!onChatWithProvider}
                        onChatClick={onChatWithProvider}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="designers" className="mt-4">
                {designersLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-antique-gold mb-2" />
                    <p className="text-sm text-muted-ink">Finding nearby designers...</p>
                  </div>
                ) : designersError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{designersError}</AlertDescription>
                  </Alert>
                ) : designers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-ink mx-auto mb-4" />
                    <p className="text-sm text-muted-ink">
                      No designers found in your area. Try increasing the search radius.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {designers.map((designer) => (
                      <ProfileCard
                        key={designer.id}
                        profile={designer}
                        showDistance={true}
                        showChatButton={!!onChatWithProvider}
                        onChatClick={onChatWithProvider}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};