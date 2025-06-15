import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { PasswordRequirement } from '@/types/auth';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const Register: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { currentBackgroundClass } = useBackgroundSelector();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    {
      id: 'length',
      description: 'At least 8 characters',
      validator: (password) => password.length >= 8,
      met: false
    },
    {
      id: 'uppercase',
      description: 'At least one uppercase letter',
      validator: (password) => /[A-Z]/.test(password),
      met: false
    },
    {
      id: 'lowercase',
      description: 'At least one lowercase letter',
      validator: (password) => /[a-z]/.test(password),
      met: false
    },
    {
      id: 'number',
      description: 'At least one number',
      validator: (password) => /[0-9]/.test(password),
      met: false
    },
    {
      id: 'special',
      description: 'At least one special character',
      validator: (password) => /[^A-Za-z0-9]/.test(password),
      met: false
    }
  ]);
  
  // Update password requirements when password changes
  useEffect(() => {
    const updatedRequirements = passwordRequirements.map(req => ({
      ...req,
      met: req.validator(password)
    }));
    setPasswordRequirements(updatedRequirements);
  }, [password]);
  
  const allRequirementsMet = passwordRequirements.every(req => req.met);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!name || !email || !phone || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Check if password meets all requirements
    if (!allRequirementsMet) {
      setFormError('Password does not meet all requirements');
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Basic phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setFormError('Please enter a valid phone number');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    const success = await register({
      name,
      email,
      phone,
      password
    });
    
    if (success) {
      // Navigate to OTP verification page
      navigate('/verify-otp');
    }
  };
  
  return (
    <div className={`min-h-screen ${currentBackgroundClass} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-islamic-blue">Create an account</CardTitle>
          <CardDescription className="text-center">
            Sign up to save your favorite mosques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm mb-4">
                {formError}
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Full Name (Eg. Aslam)"
                required
              />
            </div>
            
            <div className="space-y-1">
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
            
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Eg. 8734567890"
                autoComplete="tel"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll receive a verification code on this number
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
            
            {/* Password requirements */}
            <div className="space-y-1 border rounded-md p-3 bg-white/50">
              <p className="text-sm font-medium">Password Requirements:</p>
              <ul className="space-y-1">
                {passwordRequirements.map((req) => (
                  <li key={req.id} className="flex items-center text-sm">
                    {req.met ? (
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 mr-2 text-gray-300" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                      {req.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-islamic-blue hover:bg-islamic-blue/90"
              disabled={isLoading || !allRequirementsMet || password !== confirmPassword}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            Already have an account?{' '}
            <Link to="/login" className="text-islamic-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
