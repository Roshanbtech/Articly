export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  dob?: string;
  preferences?: string[];
  profileImage?: string;
  blockedArticles?: string[];
  isBlocked?: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string; 
  password: string;
  preferences?: string[]; 
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  message?: string;
}

export interface RegisterResult {
  user: AuthUser;
  message?: string;
}

export interface RefreshResult {
  user: AuthUser;
  accessToken: string;
  message?: string;
}
