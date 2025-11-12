import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type Review = Tables<'reviews'>;

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [reviewerName, setReviewerName] = useState('Anonymous');

  useEffect(() => {
    fetchReviewerName();
  }, [review.reviewer_id]);

  const fetchReviewerName = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', review.reviewer_id)
        .single();

      if (data) {
        setReviewerName(data.name);
      }
    } catch (error) {
      console.error('Error fetching reviewer name:', error);
    }
  };

  return (
    <Card className="bg-card border-muted-ink/20">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 bg-antique-gold/10">
            <AvatarFallback className="bg-antique-gold/10 text-antique-gold">
              {reviewerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-ink">{reviewerName}</p>
                <p className="text-sm text-muted-ink">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-antique-gold fill-current'
                        : 'text-muted-ink/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {review.comment && (
              <p className="text-muted-ink">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
