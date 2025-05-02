
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  createdAt: string;
  favorites?: string[];
}

export interface PasswordRequirement {
  id: string;
  description: string;
  validator: (password: string) => boolean;
  met: boolean;
}
