import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Tailors from "./pages/Tailors";
import Designers from "./pages/Designers";
import DesignerProfile from "./pages/DesignerProfile";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-gold"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-canvas">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tailors" 
            element={
              <ProtectedRoute>
                <Tailors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/designers" 
            element={
              <ProtectedRoute>
                <Designers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/designers/:category" 
            element={
              <ProtectedRoute>
                <Designers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/designer/:id" 
            element={
              <ProtectedRoute>
                <DesignerProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!user && <Footer />}
      <Toaster />
      <Sonner />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
