import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const designerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  age: z.number().min(18).max(120),
  experience: z.number().min(0).max(50),
  expertise: z.array(z.string()).min(1, 'Select at least one expertise'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
});

type DesignerFormData = z.infer<typeof designerSchema>;

const expertiseOptions = [
  'Ethnic', 'Western', 'Sports', 'Indo-Western', 'Casual', 'Bridal'
];

interface DesignerSignupFormProps {
  onSuccess: () => void;
}

export function DesignerSignupForm({ onSuccess }: DesignerSignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DesignerFormData>({
    resolver: zodResolver(designerSchema),
  });

  const onSubmit = async (data: DesignerFormData) => {
    setLoading(true);
    
    try {
      // Sign up the user
      const { error: signUpError } = await signUp(data.email, data.password);
      
      if (signUpError) {
        toast({
          title: "Signup Failed",
          description: signUpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Get the current user after signup
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            user_type: 'designer',
            name: data.name,
            location: data.location,
            age: data.age,
            experience: data.experience,
            expertise: data.expertise,
            bio: data.bio,
          });

        if (profileError) {
          toast({
            title: "Profile Creation Failed",
            description: profileError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      toast({
        title: "Welcome to Neural Threads!",
        description: "Your designer account has been created successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExpertiseChange = (skill: string, checked: boolean) => {
    const updated = checked
      ? [...expertise, skill]
      : expertise.filter(s => s !== skill);
    
    setExpertise(updated);
    setValue('expertise', updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-ink">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-ink">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-ink">Full Name</Label>
          <Input
            id="name"
            {...register('name')}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="text-ink">Location</Label>
          <Input
            id="location"
            {...register('location')}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-ink">Age</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-ink">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            {...register('experience', { valueAsNumber: true })}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.experience && <p className="text-sm text-red-600">{errors.experience.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-ink">Expertise & Specialization</Label>
        <div className="grid grid-cols-3 gap-2">
          {expertiseOptions.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={expertise.includes(skill)}
                onCheckedChange={(checked) => handleExpertiseChange(skill, checked as boolean)}
              />
              <Label htmlFor={skill} className="text-sm text-muted-ink">
                {skill}
              </Label>
            </div>
          ))}
        </div>
        {errors.expertise && <p className="text-sm text-red-600">{errors.expertise.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-ink">Bio</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Tell us about your design philosophy, experience, and what makes you unique..."
          className="border-muted-ink focus:border-antique-gold min-h-[100px]"
        />
        {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-antique-gold hover:bg-antique-gold/90 text-ink"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Designer Account'}
      </Button>
    </form>
  );
}