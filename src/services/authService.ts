
import { User } from '@/types/auth';
import { AdminUserRegistry } from '@/utils/adminStorage';
import { sendRegistrationNotification } from './emailService';

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class AuthService {
  static async login(email: string, password: string, users: any[]): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find((u: any) => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: "User not found. Please check your email." };
    }
    
    if (foundUser.password !== password) {
      return { success: false, error: "Incorrect password." };
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    return { success: true, user: userWithoutPassword };
  }

  static async register(userData: RegisterFormData, users: any[]): Promise<{ success: boolean; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (users.some((u: any) => u.email === userData.email)) {
      return { success: false, error: "Email already exists. Please use another email or login." };
    }
    
    if (users.some((u: any) => u.phone === userData.phone)) {
      return { success: false, error: "Phone number already exists. Please use another phone number." };
    }

    // Store user in admin registry for management
    AdminUserRegistry.addUser(userData);
    
    // Store user data temporarily (will be completed after OTP verification)
    sessionStorage.setItem('pending-user', JSON.stringify(userData));
    
    return { success: true };
  }

  static async verifyOtp(otp: string): Promise<{ success: boolean; user?: User; newUserData?: any; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, any 6-digit number is accepted, with 123456 being highlighted as a test code
    if (otp === '123456' || (otp.length === 6 && /^\d+$/.test(otp))) {
      // Get pending user data
      const pendingUserData = JSON.parse(sessionStorage.getItem('pending-user') || '{}');
      if (!pendingUserData.email) {
        return { success: false, error: "User registration data not found" };
      }
      
      // Create verified user
      const newUser = {
        ...pendingUserData,
        id: `user_${Date.now()}`,
        phoneVerified: true,
        createdAt: new Date().toISOString(),
        favorites: []
      };
      
      // Remove sensitive data before returning
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Send email notification
      await sendRegistrationNotification(pendingUserData);
      
      // Clean up
      sessionStorage.removeItem('pending-user');
      
      return { success: true, user: userWithoutPassword, newUserData: newUser };
    } else {
      return { success: false, error: "Invalid OTP. Please try again or request a new code." };
    }
  }

  static async resendOtp(pendingPhone: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to resend OTP. Please try again." };
    }
  }
}
