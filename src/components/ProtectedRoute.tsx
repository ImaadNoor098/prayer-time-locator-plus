
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

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
    // Show loading state
    return (
      <div className="min-h-screen islamic-pattern-bg flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
