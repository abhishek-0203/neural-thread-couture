import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
  onSuccess: () => void;
}

export function BookingDialog({ open, onOpenChange, providerId, providerName, onSuccess }: BookingDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !date || !time || !serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: providerId,
          service_type: serviceType,
          booking_date: date.toISOString().split('T')[0],
          booking_time: time,
          notes,
          status: 'pending',
        });

      if (error) throw error;

      onSuccess();
      
      // Reset form
      setDate(undefined);
      setTime('');
      setServiceType('');
      setNotes('');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
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
          <DialogTitle className="text-ink">Book Appointment with {providerName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-ink">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="border-muted-ink/20">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Initial Consultation</SelectItem>
                <SelectItem value="fitting">Fitting Session</SelectItem>
                <SelectItem value="alteration">Alterations</SelectItem>
                <SelectItem value="custom">Custom Design</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-ink">Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border border-muted-ink/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-ink">Preferred Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border-muted-ink/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-ink">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements or details..."
              className="border-muted-ink/20"
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
              disabled={loading || !date || !time || !serviceType}
              className="flex-1 bg-antique-gold hover:bg-antique-gold/90 text-ink"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
