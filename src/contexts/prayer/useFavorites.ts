
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    // If authenticated, get favorites from user object, otherwise empty array
    if (user && user.favorites) {
      return user.favorites;
    } else if (isAuthenticated) {
      // User is authenticated but no favorites yet
      return [];
    } else {
      // Not authenticated, don't show any favorites
      return [];
    }
  });

  useEffect(() => {
    // If authenticated, update the favorites in user data
    if (isAuthenticated && user) {
      // Save to local storage for current session
      localStorage.setItem('mosque-favorites', JSON.stringify(favorites));
      
      // In a real app, this would update the user's favorites in the backend
      // For this demo, we'll update the user in localStorage
      const users = JSON.parse(localStorage.getItem('mosque-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].favorites = favorites;
        localStorage.setItem('mosque-users', JSON.stringify(users));
      }
      
      // Update user in current session
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
