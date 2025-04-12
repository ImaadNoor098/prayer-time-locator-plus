
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('mosque-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('mosque-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (mosqueId: string) => {
    setFavorites(prev => {
      if (prev.includes(mosqueId)) {
        return prev.filter(id => id !== mosqueId);
      } else {
        return [...prev, mosqueId];
      }
    });
  };

  const isFavorite = (mosqueId: string): boolean => {
    return favorites.includes(mosqueId);
  };

  return { favorites, toggleFavorite, isFavorite };
};
