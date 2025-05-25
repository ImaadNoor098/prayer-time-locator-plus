
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Initialize favorites when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load favorites from user object (which comes from localStorage)
      if (user.favorites && Array.isArray(user.favorites)) {
        setFavorites(user.favorites);
      } else {
        setFavorites([]);
      }
    } else {
      // Clear favorites if not authenticated
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  // Save favorites to user data whenever favorites change
  useEffect(() => {
    if (isAuthenticated && user) {
      // Update the users list in localStorage
      const users = JSON.parse(localStorage.getItem('mosque-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].favorites = favorites;
        localStorage.setItem('mosque-users', JSON.stringify(users));
      }
      
      // Update current user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('mosque-user') || '{}');
      if (currentUser.id === user.id) {
        currentUser.favorites = favorites;
        localStorage.setItem('mosque-user', JSON.stringify(currentUser));
      }
    }
  }, [favorites, isAuthenticated, user]);

  const toggleFavorite = (mosqueId: string) => {
    if (!isAuthenticated) return; // Don't toggle if not authenticated
    
    setFavorites(prev => {
      if (prev.includes(mosqueId)) {
        return prev.filter(id => id !== mosqueId);
      } else {
        return [...prev, mosqueId];
      }
    });
  };

  const isFavorite = (mosqueId: string): boolean => {
    if (!isAuthenticated) return false; // Always return false if not authenticated
    return favorites.includes(mosqueId);
  };

  return { favorites, toggleFavorite, isFavorite };
};
