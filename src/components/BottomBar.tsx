
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrayer } from '@/contexts/prayer';

const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackPageVisit } = usePrayer();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/' && location.pathname.startsWith('/mosque/'));
  };
  
  // Updated navigation handlers with navigation state
  const handleNavigate = (path: string) => {
    // Track the visit attempt (for double-tap detection)
    trackPageVisit(path);
    
    // Navigate with state to indicate this came from bottom bar
    navigate(path, { state: { fromBottomBar: true } });
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-card border-t dark:border-islamic-blue/20 flex items-center justify-around z-50">
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-1 h-14 w-full",
          isActive('/') ? "text-islamic-green" : "text-islamic-gray"
        )}
        onClick={() => handleNavigate('/')}
      >
        <Home className={cn(
          "h-5 w-5",
          isActive('/') ? "text-islamic-green" : ""
        )} />
        <span className="text-xs">Home</span>
      </Button>
      
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-1 h-14 w-full",
          isActive('/salah-times') ? "text-islamic-green" : "text-islamic-gray"
        )}
        onClick={() => handleNavigate('/salah-times')}
      >
        <Clock className={cn(
          "h-5 w-5",
          isActive('/salah-times') ? "text-islamic-green" : ""
        )} />
        <span className="text-xs">Prayer Times</span>
      </Button>
      
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-1 h-14 w-full",
          isActive('/favorites') ? "text-islamic-green" : "text-islamic-gray"
        )}
        onClick={() => handleNavigate('/favorites')}
      >
        <Heart className={cn(
          "h-5 w-5",
          isActive('/favorites') ? "text-islamic-green fill-islamic-green" : ""
        )} />
        <span className="text-xs">Favorites</span>
      </Button>
    </div>
  );
};

export default BottomBar;
