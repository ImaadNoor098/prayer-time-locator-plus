import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Heart, Clock, Settings, Trash2 } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import AdminPanel from '@/components/AdminPanel';
import { useBackgroundSelector } from '@/hooks/useBackgroundSelector';
import { isAdminEmail } from '@/utils/adminConfig';
import LogoutConfirmationDialog from '@/components/LogoutConfirmationDialog';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

const UserProfile: React.FC = () => {
  const { user, logout, deleteAccount, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { currentBackgroundClass } = useBackgroundSelector();

  // Check if current user is an admin
  const isUserAdmin = user?.email ? isAdminEmail(user.email) : false;

  if (!user) {
    return (
      <div className={`min-h-screen ${currentBackgroundClass} flex flex-col`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto max-w-md px-4">
            <Card className="w-full bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="text-center">Please log in to view your profile.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutDialog(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      setShowDeleteDialog(false);
      navigate('/login?deleted=true');
    }
  };

  return (
    <div className={`min-h-screen ${currentBackgroundClass} flex flex-col`}>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-2xl px-3 sm:px-4 py-4 pb-6">
          <Card className="mb-4 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="flex items-center text-islamic-blue text-lg sm:text-xl">
                <User className="h-5 w-5 mr-2" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium text-sm">Name:</span>
                  <span className="text-sm break-words">{user.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium text-sm">Email:</span>
                  <span className="text-sm break-all text-right sm:text-left">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium text-sm">Phone:</span>
                  <div className="flex items-center justify-start sm:justify-end space-x-2">
                    <span className="text-sm">{user.phone}</span>
                    {user.phoneVerified && (
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
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
                {/* Admin section with better responsive layout */}
                {isUserAdmin && (
                  <div className="space-y-2">
                    <div className="text-xs text-green-600 font-medium p-2 bg-green-50 rounded-lg border border-green-200">
                      ✅ Admin Access: {user?.email}
                    </div>
                    <Button 
                      onClick={() => setShowAdminPanel(!showAdminPanel)} 
                      variant="outline" 
                      className="w-full text-sm"
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full text-sm"
                  size="sm"
                >
                  Logout
                </Button>

                <Button 
                  onClick={handleDeleteAccount} 
                  variant="destructive" 
                  className="w-full text-sm bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {showAdminPanel && isUserAdmin && (
            <div className="mb-4">
              <AdminPanel />
            </div>
          )}
        </div>
      </div>
      
      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />

      <DeleteAccountDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteAccount}
        isLoading={isLoading}
      />
      
      <BottomBar />
    </div>
  );
};

export default UserProfile;
