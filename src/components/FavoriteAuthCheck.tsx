
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface FavoriteAuthCheckProps {
  onAuthenticated: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteAuthCheck: React.FC<FavoriteAuthCheckProps> = ({ onAuthenticated, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // Store the redirect path (favorites page)
    sessionStorage.setItem('auth-redirect', '/favorites');
    navigate('/login');
    onClose();
  };
  
  const handleRegister = () => {
    // Store the redirect path (favorites page)
    sessionStorage.setItem('auth-redirect', '/favorites');
    navigate('/register');
    onClose();
  };
  
  // If already authenticated, just call the callback
  React.useEffect(() => {
    if (isAuthenticated && isOpen) {
      onAuthenticated();
      onClose();
    }
  }, [isAuthenticated, isOpen, onAuthenticated, onClose]);
  
  if (!isOpen || isAuthenticated) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In to View Favorites</DialogTitle>
          <DialogDescription>
            Create an account or sign in to view and manage your favorite mosques. Your favorites will be available on all your devices.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleLogin}
            className="flex-1 bg-islamic-blue hover:bg-islamic-blue/90"
          >
            Sign In
          </Button>
          <Button
            onClick={handleRegister}
            variant="outline"
            className="flex-1 border-islamic-green text-islamic-green hover:bg-islamic-green/10"
          >
            Create Account
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button 
            variant="ghost" 
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteAuthCheck;
