import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';
import { useAuthStorage } from '@/hooks/useAuthStorage';
import { useOtpVerification } from '@/hooks/useOtpVerification';
import { AuthService, RegisterFormData } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { getCurrentUser, setCurrentUser, getUsers, setUsers, syncUserData } = useAuthStorage();
  const { 
    pendingPhoneVerification, 
    pendingPhone, 
    startVerification, 
    completeVerification 
  } = useOtpVerification();
  
  // Check for existing session on component mount and sync with latest user data
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = getCurrentUser();
      if (storedUser) {
        // Sync with latest data from users list
        const syncedUser = syncUserData(storedUser.id);
        setUser(syncedUser || storedUser);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = getUsers();
      const result = await AuthService.login(email, password, users);
      
      if (result.success && result.user) {
        setUser(result.user);
        setCurrentUser(result.user);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }
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

  const register = async (userData: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = getUsers();
      const result = await AuthService.register(userData, users);
      
      if (result.success) {
        startVerification(userData.phone);
        
        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to ${userData.phone}. For testing, use code: 123456`,
        });
        
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }
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

  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await AuthService.verifyOtp(otp);
      
      if (result.success && result.user && result.newUserData) {
        // Update users list in localStorage
        const users = getUsers();
        users.push(result.newUserData);
        setUsers(users);
        
        // Set current user
        setUser(result.user);
        setCurrentUser(result.user);
        
        completeVerification();
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created and phone verified!",
        });
        
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: result.error,
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

  const resendOtp = async (): Promise<boolean> => {
    try {
      const result = await AuthService.resendOtp(pendingPhone);
      
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: `A new verification code has been sent to ${pendingPhone}. For testing, use code: 123456`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    navigate('/login');
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
