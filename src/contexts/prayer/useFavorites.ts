
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from database
  useEffect(() => {
    if (isAuthenticated && user) {
      supabase
        .from('favorites')
        .select('mosque_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setFavorites(data.map(f => f.mosque_id));
          }
        });
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  const toggleFavorite = useCallback(async (mosqueId: string) => {
    if (!isAuthenticated || !user) return;
    
    const isFav = favorites.includes(mosqueId);
    
    if (isFav) {
      // Optimistic update
      setFavorites(prev => prev.filter(id => id !== mosqueId));
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('mosque_id', mosqueId);
    } else {
      setFavorites(prev => [...prev, mosqueId]);
      await supabase.from('favorites').insert({ user_id: user.id, mosque_id: mosqueId });
    }
  }, [isAuthenticated, user, favorites]);

  const isFavorite = useCallback((mosqueId: string): boolean => {
    if (!isAuthenticated) return false;
    return favorites.includes(mosqueId);
  }, [isAuthenticated, favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
