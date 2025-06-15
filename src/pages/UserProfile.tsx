
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Heart, Clock, Settings } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import AdminPanel from '@/components/AdminPanel';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { currentBackgroundClass } = useBackgroundSelector();

  if (!user) {
    return (
      <div className={`min-h-screen ${currentBackgroundClass} flex items-center justify-center`}>
        <div className="container mx-auto max-w-md px-4 pb-20">
          <Card className="w-full bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-center">Please log in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
        <BottomBar />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen ${currentBackgroundClass}`}>
      <div className="container mx-auto max-w-2xl px-3 py-4 pb-20">
        <Card className="mb-4 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-islamic-blue text-lg">
              <User className="h-5 w-5 mr-2" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Name:</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Email:</span>
                <span className="text-sm break-all">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Phone:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{user.phone}</span>
                  {user.phoneVerified && (
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Member since:</span>
                <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-islamic-green" />
                <span className="font-medium text-sm">Favorite Mosques:</span>
                <Badge variant="outline" className="text-xs">
                  {user.favorites?.length || 0}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button 
                onClick={() => setShowAdminPanel(!showAdminPanel)} 
                variant="outline" 
                className="w-full text-sm"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
              </Button>
              
              <Button 
                onClick={handleLogout} 
                variant="destructive" 
                className="w-full text-sm"
                size="sm"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {showAdminPanel && (
          <div className="mb-4">
            <AdminPanel />
          </div>
        )}
      </div>
      
      <BottomBar />
    </div>
  );
};

export default UserProfile;
