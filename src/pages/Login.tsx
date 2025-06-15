
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import ForgotPasswordPopup from '@/components/ForgotPasswordPopup';
import AccountDeletedMessage from '@/components/AccountDeletedMessage';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [showAccountDeletedMessage, setShowAccountDeletedMessage] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const { currentBackgroundClass } = useBackgroundSelector();
  
  // Check for account deletion message from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('deleted') === 'true') {
      setShowAccountDeletedMessage(true);
      // Clean up URL
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if we have a redirect path stored
      const redirectPath = sessionStorage.getItem('auth-redirect') || '/';
      sessionStorage.removeItem('auth-redirect');
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setShowAccountDeletedMessage(false);
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      // Check if we have a redirect path stored
      const redirectPath = sessionStorage.getItem('auth-redirect') || '/';
      sessionStorage.removeItem('auth-redirect');
      navigate(redirectPath);
    } else {
      // Check if error is due to account deletion
      if (formError.includes('deleted by an administrator')) {
        setShowAccountDeletedMessage(true);
      }
    }
  };
  
  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPasswordPopup(true);
  };
  
  return (
    <div className={`min-h-screen ${currentBackgroundClass} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pb-20`}>
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-islamic-blue">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your favorite mosques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountDeletedMessage show={showAccountDeletedMessage} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm mb-4">
                {formError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-islamic-blue hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-islamic-blue hover:bg-islamic-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            Don't have an account?{' '}
            <Link to="/register" className="text-islamic-blue font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <ForgotPasswordPopup 
        isOpen={showForgotPasswordPopup}
        onClose={() => setShowForgotPasswordPopup(false)}
      />
      
      {/* Always show bottom bar */}
      <BottomBar />
    </div>
  );
};

export default Login;
