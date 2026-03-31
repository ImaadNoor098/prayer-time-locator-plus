
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mapSupabaseUser = (sbUser: SupabaseUser): AppUser => ({
  id: sbUser.id,
  name: sbUser.user_metadata?.name || '',
  email: sbUser.email || '',
  phone: sbUser.user_metadata?.phone || sbUser.phone || '',
  createdAt: sbUser.created_at,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // THEN check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        return false;
      }
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
        toast({ title: "Login Successful", description: `Welcome back, ${data.user.user_metadata?.name || 'User'}!` });
        return true;
      }
      return false;
    } catch {
      toast({ title: "Login Error", description: "An unexpected error occurred.", variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { name: userData.name, phone: userData.phone },
        },
      });
      if (error) {
        toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
        return false;
      }
      if (data.user) {
        setUser(mapSupabaseUser(data.user));
        toast({ title: "Registration Successful", description: "Your account has been created!" });
        return true;
      }
      return false;
    } catch {
      toast({ title: "Registration Error", description: "An unexpected error occurred.", variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      // Delete favorites first
      await supabase.from('favorites').delete().eq('user_id', user.id);
      // Delete profile
      await supabase.from('profiles').delete().eq('id', user.id);
      // Sign out
      await supabase.auth.signOut();
      setUser(null);
      toast({ title: "Account Deleted", description: "Your account data has been removed." });
      return true;
    } catch {
      toast({ title: "Deletion Error", description: "An unexpected error occurred.", variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
