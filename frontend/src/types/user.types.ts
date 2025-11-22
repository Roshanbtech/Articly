export type UserRole = 'user' | 'admin';

export interface ArticlyUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    dob?: string | null;
    preferences?: string[];
    profileImage?: string | null;
    blockedArticles?: string[];
    isBlocked?: boolean;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    profileImageFile?: File | null;
}

export interface UpdatePreferencesPayload {
    preferences: string[];
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}