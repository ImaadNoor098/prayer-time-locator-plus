
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Check, User, Mail, Phone, LogOut } from 'lucide-react';
import BottomBar from '@/components/BottomBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return (
      <div className="min-h-screen islamic-pattern-bg flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };
  
  const confirmLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen islamic-pattern-bg pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-islamic-blue mb-6">Account Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-islamic-green" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email Address
              </p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
                {user.phoneVerified && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
              </p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={handleLogout}
          variant="outline" 
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomBar />
    </div>
  );
};

export default UserProfile;
