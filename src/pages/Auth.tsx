import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CustomerSignupForm } from '@/components/auth/CustomerSignupForm';
import { DesignerSignupForm } from '@/components/auth/DesignerSignupForm';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  if (isLogin) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-antique-gold">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-ink">Welcome Back</CardTitle>
            <CardDescription className="text-muted-ink">
              Sign in to your Neural Threads account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-ink">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-muted-ink focus:border-antique-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-ink">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-muted-ink focus:border-antique-gold"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-antique-gold hover:bg-antique-gold/90 text-ink"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsLogin(false)}
                className="text-muted-ink hover:text-ink"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-antique-gold">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif text-ink">Join Neural Threads</CardTitle>
          <CardDescription className="text-muted-ink">
            Choose your account type to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customer" className="text-ink">Customer</TabsTrigger>
              <TabsTrigger value="designer" className="text-ink">Designer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer">
              <CustomerSignupForm onSuccess={() => navigate('/dashboard')} />
            </TabsContent>
            
            <TabsContent value="designer">
              <DesignerSignupForm onSuccess={() => navigate('/dashboard')} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(true)}
              className="text-muted-ink hover:text-ink"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}