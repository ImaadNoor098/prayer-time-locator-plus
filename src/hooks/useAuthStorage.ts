
import { User } from '@/types/auth';

export const useAuthStorage = () => {
  const getCurrentUser = (): User | null => {
    const storedUser = localStorage.getItem('mosque-user');
    if (!storedUser) return null;
    
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('mosque-user');
      return null;
    }
  };

  const setCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('mosque-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mosque-user');
    }
  };

  const getUsers = (): any[] => {
    return JSON.parse(localStorage.getItem('mosque-users') || '[]');
  };

  const setUsers = (users: any[]) => {
    localStorage.setItem('mosque-users', JSON.stringify(users));
  };

  const syncUserData = (userId: string): User | null => {
    const users = getUsers();
    const fullUserData = users.find((u: any) => u.id === userId);
    
    if (fullUserData) {
      const { password: _, ...userWithoutPassword } = fullUserData;
      setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    }
    
    return null;
  };

  const updateUserFavorites = (userId: string, favorites: string[]) => {
    const users = getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].favorites = favorites;
      setUsers(users);
      
      // Update current user storage
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, favorites };
        setCurrentUser(updatedUser);
      }
    }
  };

  return {
    getCurrentUser,
    setCurrentUser,
    getUsers,
    setUsers,
    syncUserData,
    updateUserFavorites
  };
};
