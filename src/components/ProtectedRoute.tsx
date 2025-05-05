
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import BottomBar from './BottomBar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save current path for redirect after login
      sessionStorage.setItem('auth-redirect', window.location.pathname);
      
      toast({
        title: "Authentication Required",
        description: "Please login to continue",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, toast]);
  
  if (isLoading) {
    // Show loading state with bottom bar
    return (
      <div className="min-h-screen islamic-pattern-bg flex items-center justify-center pb-16">
        <p>Loading...</p>
        <BottomBar />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Instead of navigating directly, wrap the redirect in a component that shows the BottomBar
    return (
      <div className="min-h-screen islamic-pattern-bg">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow islamic-card mb-4">
            <p className="text-center mb-4">Please login to access this feature</p>
            <div className="flex justify-center">
              <Navigate to="/login" replace />
            </div>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
