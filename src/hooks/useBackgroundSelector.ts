
import { useState, useEffect } from 'react';

const BACKGROUND_STORAGE_KEY = 'selected-background';
const DEFAULT_BACKGROUND = 'islamic-pattern';

export const useBackgroundSelector = () => {
  const [selectedBackground, setSelectedBackground] = useState<string>(() => {
    const saved = localStorage.getItem(BACKGROUND_STORAGE_KEY);
    return saved || DEFAULT_BACKGROUND;
  });

  useEffect(() => {
    localStorage.setItem(BACKGROUND_STORAGE_KEY, selectedBackground);
  }, [selectedBackground]);

  const getBackgroundClassName = (backgroundId: string) => {
    const backgroundMap: Record<string, string> = {
      'islamic-pattern': 'islamic-pattern-bg',
      'geometric': 'geometric-bg',
      'mosque-silhouette': 'mosque-silhouette-bg',
      'gradient-waves': 'gradient-waves-bg',
      'luxury-gold': 'luxury-gold-bg',
      'starry-night': 'starry-night-bg',
      'marble-texture': 'marble-texture-bg',
      'sunset-gradient': 'sunset-gradient-bg'
    };
    
    return backgroundMap[backgroundId] || 'islamic-pattern-bg';
  };

  const currentBackgroundClass = getBackgroundClassName(selectedBackground);

  return {
    selectedBackground,
    setSelectedBackground,
    currentBackgroundClass,
    getBackgroundClassName
  };
};
