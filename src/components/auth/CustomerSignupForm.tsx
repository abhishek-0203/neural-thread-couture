import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const customerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  age: z.number().min(13).max(120),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100).max(250), // cm
  waist: z.number().min(50).max(200), // cm
  weight: z.number().min(30).max(300), // kg
  bodyShape: z.enum(['apple', 'pear', 'hourglass', 'rectangle', 'inverted_triangle']),
  fashionInterests: z.array(z.string()).min(1, 'Select at least one interest'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const fashionInterestOptions = [
  'Ethnic', 'Western', 'Sports', 'Indo-Western', 'Casual', 'Bridal'
];

interface CustomerSignupFormProps {
  onSuccess: () => void;
}

export function CustomerSignupForm({ onSuccess }: CustomerSignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [fashionInterests, setFashionInterests] = useState<string[]>([]);
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
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
            user_type: 'customer',
            name: data.name,
            location: data.location,
            age: data.age,
            gender: data.gender,
            height: data.height,
            waist: data.waist,
            weight: data.weight,
            body_shape: data.bodyShape,
            fashion_interests: data.fashionInterests,
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
        description: "Your customer account has been created successfully.",
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

  const handleInterestChange = (interest: string, checked: boolean) => {
    const updated = checked
      ? [...fashionInterests, interest]
      : fashionInterests.filter(i => i !== interest);
    
    setFashionInterests(updated);
    setValue('fashionInterests', updated);
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

      <div className="grid grid-cols-3 gap-4">
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
          <Label className="text-ink">Gender</Label>
          <Select onValueChange={(value) => setValue('gender', value as any)}>
            <SelectTrigger className="border-muted-ink focus:border-antique-gold">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label className="text-ink">Body Shape</Label>
          <Select onValueChange={(value) => setValue('bodyShape', value as any)}>
            <SelectTrigger className="border-muted-ink focus:border-antique-gold">
              <SelectValue placeholder="Select body shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="pear">Pear</SelectItem>
              <SelectItem value="hourglass">Hourglass</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="inverted_triangle">Inverted Triangle</SelectItem>
            </SelectContent>
          </Select>
          {errors.bodyShape && <p className="text-sm text-red-600">{errors.bodyShape.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-ink">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            {...register('height', { valueAsNumber: true })}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.height && <p className="text-sm text-red-600">{errors.height.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="waist" className="text-ink">Waist (cm)</Label>
          <Input
            id="waist"
            type="number"
            {...register('waist', { valueAsNumber: true })}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.waist && <p className="text-sm text-red-600">{errors.waist.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-ink">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            {...register('weight', { valueAsNumber: true })}
            className="border-muted-ink focus:border-antique-gold"
          />
          {errors.weight && <p className="text-sm text-red-600">{errors.weight.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-ink">Fashion Interests</Label>
        <div className="grid grid-cols-3 gap-2">
          {fashionInterestOptions.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={fashionInterests.includes(interest)}
                onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
              />
              <Label htmlFor={interest} className="text-sm text-muted-ink">
                {interest}
              </Label>
            </div>
          ))}
        </div>
        {errors.fashionInterests && <p className="text-sm text-red-600">{errors.fashionInterests.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-antique-gold hover:bg-antique-gold/90 text-ink"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Customer Account'}
      </Button>
    </form>
  );
}