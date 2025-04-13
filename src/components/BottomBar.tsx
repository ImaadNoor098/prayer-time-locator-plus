
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';

const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { previousPath, setPreviousPath } = useNavigation();
  
  useEffect(() => {
    if (location.pathname !== '/favorites' && location.pathname !== '/') {
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, setPreviousPath]);
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/mosques' && location.pathname.startsWith('/mosque/')) ||
           (path === '/salah-times' && location.pathname === '/salah-times');
  };
  
  const handleHomeClick = () => {
    if (location.pathname === '/favorites') {
      navigate(previousPath);
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-card border-t dark:border-islamic-blue/20 flex items-center justify-around z-50">
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-1 h-14 w-full",
          isActive('/') || isActive('/mosques') ? "text-islamic-green" : "text-islamic-gray"
        )}
        onClick={handleHomeClick}
      >
        <Home className={cn(
          "h-5 w-5",
          isActive('/') || isActive('/mosques') ? "text-islamic-green" : ""
        )} />
        <span className="text-xs">Home</span>
      </Button>
      
      <Button
        variant="ghost"
        className={cn(
          "flex flex-col items-center gap-1 h-14 w-full",
          isActive('/salah-times') ? "text-islamic-green" : "text-islamic-gray"
        )}
        onClick={() => navigate('/salah-times')}
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
        onClick={() => navigate('/favorites')}
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
