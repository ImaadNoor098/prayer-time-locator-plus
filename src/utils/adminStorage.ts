// Admin utility for managing user registrations
// This file stores user data separately for admin management

import { addAdminEmail, removeAdminEmail, ADMIN_EMAILS } from './adminConfig';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  phone: string;
  registrationDate: string;
  isBlocked: boolean;
}

const ADMIN_USERS_KEY = 'admin-users-registry';

export class AdminUserRegistry {
  // Get all registered users for admin review
  static getAllUsers(): AdminUserRecord[] {
    try {
      const users = localStorage.getItem(ADMIN_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading admin users:', error);
      return [];
    }
  }

  // Add a new user to admin registry
  static addUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): void {
    try {
      const users = this.getAllUsers();
      const newUser: AdminUserRecord = {
        id: `admin_${Date.now()}`,
        ...userData,
        registrationDate: new Date().toISOString(),
        isBlocked: false
      };
      
      users.push(newUser);
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
      
      console.log('🔧 Admin Registry: New user added:', {
        email: userData.email,
        name: userData.name,
        date: newUser.registrationDate
      });
    } catch (error) {
      console.error('Error adding user to admin registry:', error);
    }
  }

  // Remove user email from registry (allows re-registration)
  static removeUserByEmail(email: string): boolean {
    try {
      const users = this.getAllUsers();
      const initialLength = users.length;
      const filteredUsers = users.filter(user => user.email !== email);
      
      if (filteredUsers.length < initialLength) {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(filteredUsers));
        console.log('🔧 Admin Registry: User removed:', email);
        return true;
      }
      
      console.log('🔧 Admin Registry: User not found:', email);
      return false;
    } catch (error) {
      console.error('Error removing user from admin registry:', error);
      return false;
    }
  }

  // Block/unblock user
  static toggleUserBlock(email: string): boolean {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].isBlocked = !users[userIndex].isBlocked;
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
        console.log('🔧 Admin Registry: User block status changed:', {
          email,
          isBlocked: users[userIndex].isBlocked
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling user block:', error);
      return false;
    }
  }

  // Get user by email
  static getUserByEmail(email: string): AdminUserRecord | null {
    try {
      const users = this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Export all data for backup
  static exportUserData(): string {
    try {
      const users = this.getAllUsers();
      return JSON.stringify(users, null, 2);
    } catch (error) {
      console.error('Error exporting user data:', error);
      return '[]';
    }
  }

  // Clear all admin data (use with caution)
  static clearAllData(): void {
    try {
      localStorage.removeItem(ADMIN_USERS_KEY);
      console.log('🔧 Admin Registry: All data cleared');
    } catch (error) {
      console.error('Error clearing admin data:', error);
    }
  }
}

// Admin helper functions for easy console access
export const adminHelpers = {
  // List all users
  listUsers: () => {
    const users = AdminUserRegistry.getAllUsers();
    console.table(users.map(u => ({
      email: u.email,
      name: u.name,
      phone: u.phone,
      date: new Date(u.registrationDate).toLocaleDateString(),
      blocked: u.isBlocked
    })));
    return users;
  },

  // Remove user by email
  removeUser: (email: string) => {
    const success = AdminUserRegistry.removeUserByEmail(email);
    if (success) {
      console.log(`✅ User ${email} removed successfully. They can now register again.`);
    } else {
      console.log(`❌ User ${email} not found.`);
    }
    return success;
  },

  // Block/unblock user
  toggleBlock: (email: string) => {
    const success = AdminUserRegistry.toggleUserBlock(email);
    if (success) {
      const user = AdminUserRegistry.getUserByEmail(email);
      console.log(`✅ User ${email} is now ${user?.isBlocked ? 'BLOCKED' : 'UNBLOCKED'}.`);
    } else {
      console.log(`❌ User ${email} not found.`);
    }
    return success;
  },

  // Export data
  export: () => {
    const data = AdminUserRegistry.exportUserData();
    console.log('📁 User data exported:');
    console.log(data);
    return data;
  },

  // Clear all data
  clearAll: () => {
    AdminUserRegistry.clearAllData();
    console.log('🗑️ All admin data cleared.');
  },

  // New admin management functions
  addAdmin: (email: string) => {
    addAdminEmail(email);
    console.log(`👑 Admin access granted to: ${email}`);
    console.log('💡 User will need to refresh the page to see admin panel access.');
  },

  removeAdmin: (email: string) => {
    removeAdminEmail(email);
    console.log(`👑 Admin access revoked from: ${email}`);
  },

  listAdmins: () => {
    console.log('👑 Current admin emails:');
    console.table(ADMIN_EMAILS.map((email, index) => ({ index: index + 1, email })));
    return ADMIN_EMAILS;
  }
};

// Make admin helpers available globally for console access
if (typeof window !== 'undefined') {
  (window as any).adminHelpers = adminHelpers;
}
