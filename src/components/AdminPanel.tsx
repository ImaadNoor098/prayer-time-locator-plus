import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminUserRegistry, adminHelpers } from '@/utils/adminStorage';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { isAdminEmail } from '@/utils/adminConfig';
import { Trash2, Shield, ShieldOff, Download, RefreshCw, AlertCircle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [emailToRemove, setEmailToRemove] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if current user is authorized admin
  const isAuthorizedAdmin = user?.email ? isAdminEmail(user.email) : false;

  const loadUsers = () => {
    const allUsers = AdminUserRegistry.getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadUsers();
    }
  }, [isAuthorizedAdmin]);

  // If user is not an authorized admin, show access denied message
  if (!isAuthorizedAdmin) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              You don't have permission to access the admin panel.
            </p>
            <p className="text-sm text-gray-500">
              Only authorized administrators can view this section.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRemoveUser = () => {
    if (!emailToRemove.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const success = AdminUserRegistry.removeUserByEmail(emailToRemove);
    if (success) {
      toast({
        title: "Success",
        description: `User ${emailToRemove} removed. They can now register again.`,
      });
      setEmailToRemove('');
      loadUsers();
    } else {
      toast({
        title: "Error",
        description: `User ${emailToRemove} not found`,
        variant: "destructive",
      });
    }
  };

  const handleToggleBlock = (email: string) => {
    const success = AdminUserRegistry.toggleUserBlock(email);
    if (success) {
      toast({
        title: "Success",
        description: `User block status updated`,
      });
      loadUsers();
    }
  };

  const handleExportData = () => {
    const data = AdminUserRegistry.exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-registry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "User data exported successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-islamic-blue">🔧 Admin User Registry</CardTitle>
          <p className="text-sm text-green-600">
            ✅ Authorized Admin: {user?.email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button onClick={loadUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-remove">Remove User Email (allows re-registration)</Label>
            <div className="flex space-x-2">
              <Input
                id="email-remove"
                value={emailToRemove}
                onChange={(e) => setEmailToRemove(e.target.value)}
                placeholder="Enter email to remove"
              />
              <Button onClick={handleRemoveUser} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-gray-500">No users registered yet</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                    <Button
                      onClick={() => handleToggleBlock(user.email)}
                      variant="outline"
                      size="sm"
                    >
                      {user.isBlocked ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Console Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 font-mono bg-gray-100 p-3 rounded">
            <div><strong>List all users:</strong> adminHelpers.listUsers()</div>
            <div><strong>Remove user:</strong> adminHelpers.removeUser('email@example.com')</div>
            <div><strong>Block/unblock user:</strong> adminHelpers.toggleBlock('email@example.com')</div>
            <div><strong>Export data:</strong> adminHelpers.export()</div>
            <div><strong>Clear all data:</strong> adminHelpers.clearAll()</div>
            <div className="mt-4 pt-2 border-t">
              <div><strong>Add new admin:</strong> adminHelpers.addAdmin('newemail@example.com')</div>
              <div><strong>Remove admin:</strong> adminHelpers.removeAdmin('email@example.com')</div>
              <div><strong>List admins:</strong> adminHelpers.listAdmins()</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
