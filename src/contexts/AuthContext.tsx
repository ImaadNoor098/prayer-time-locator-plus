
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  pendingPhoneVerification: boolean;
  pendingPhone: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingPhoneVerification, setPendingPhoneVerification] = useState<boolean>(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');
  const { toast } = useToast();
  
  // Check for existing session on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('mosque-user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('mosque-user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Mock login function - in a real app this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage (mock database)
      const users = JSON.parse(localStorage.getItem('mosque-users') || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        toast({
          title: "Login Failed",
          description: "User not found. Please check your email.",
          variant: "destructive",
        });
        return false;
      }
      
      if (foundUser.password !== password) {
        toast({
          title: "Login Failed",
          description: "Incorrect password.",
          variant: "destructive",
        });
        return false;
      }
      
      // Login successful
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('mosque-user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock registration function
  const register = async (userData: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('mosque-users') || '[]');
      if (users.some((u: any) => u.email === userData.email)) {
        toast({
          title: "Registration Failed",
          description: "Email already exists. Please use another email or login.",
          variant: "destructive",
        });
        return false;
      }
      
      if (users.some((u: any) => u.phone === userData.phone)) {
        toast({
          title: "Registration Failed",
          description: "Phone number already exists. Please use another phone number.",
          variant: "destructive",
        });
        return false;
      }
      
      // Store the pending phone verification
      setPendingPhone(userData.phone);
      setPendingPhoneVerification(true);
      
      // Store user data temporarily (will be completed after OTP verification)
      sessionStorage.setItem('pending-user', JSON.stringify(userData));
      
      // Send OTP (mock)
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${userData.phone}. For testing, use code: 123456`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock OTP verification
  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any 6-digit number is accepted, with 123456 being highlighted as a test code
      if (otp === '123456' || (otp.length === 6 && /^\d+$/.test(otp))) {
        // Get pending user data
        const pendingUserData = JSON.parse(sessionStorage.getItem('pending-user') || '{}');
        if (!pendingUserData.email) {
          throw new Error("User registration data not found");
        }
        
        // Create verified user
        const newUser = {
          ...pendingUserData,
          id: `user_${Date.now()}`,
          phoneVerified: true,
          createdAt: new Date().toISOString(),
          favorites: []
        };
        
        // Remove sensitive data before storing in user state
        const { password: _, ...userWithoutPassword } = newUser;
        
        // Update users list in localStorage
        const users = JSON.parse(localStorage.getItem('mosque-users') || '[]');
        users.push(newUser);
        localStorage.setItem('mosque-users', JSON.stringify(users));
        
        // Set current user
        setUser(userWithoutPassword);
        localStorage.setItem('mosque-user', JSON.stringify(userWithoutPassword));
        
        // Clean up
        sessionStorage.removeItem('pending-user');
        setPendingPhoneVerification(false);
        setPendingPhone('');
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created and phone verified!",
        });
        
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid OTP. Please try again or request a new code.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock resend OTP
  const resendOtp = async (): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${pendingPhone}. For testing, use code: 123456`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mosque-user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        pendingPhoneVerification,
        pendingPhone
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
