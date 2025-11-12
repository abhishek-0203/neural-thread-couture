import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AddReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewedUserId: string;
  onSuccess: () => void;
}

export function AddReviewDialog({ open, onOpenChange, reviewedUserId, onSuccess }: AddReviewDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          reviewed_user_id: reviewedUserId,
          rating,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      onSuccess();
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error('Review error:', error);
      toast({
        title: "Review Failed",
        description: error.message || "Failed to post review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-canvas">
        <DialogHeader>
          <DialogTitle className="text-ink">Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-ink">Your Rating</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoveredRating || rating) > i
                        ? 'text-antique-gold fill-current'
                        : 'text-muted-ink/30'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-ink font-medium">{rating} / 5</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-ink">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="border-muted-ink/20 min-h-[120px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-muted-ink/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-antique-gold hover:bg-antique-gold/90 text-ink"
            >
              {loading ? 'Posting...' : 'Post Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
