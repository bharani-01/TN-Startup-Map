import { UserRole } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export interface UserAccount {
  id: string; // Internal UUID primary key
  publicId: string; // Cryptographic 16-hex public ID (e.g. usr_9f8a3c2e1b4d7e05)
  email: string;
  passwordHash?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface UserProfile {
  id: string;
  userAccountId: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  companyName?: string | null;
  updatedAt: string;
}

export interface UserContact {
  id: string;
  userAccountId: string;
  phone?: string | null;
  secondaryEmail?: string | null;
  city?: string | null;
  state?: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userAccountId: string;
  theme: string;
  emailNotifications: boolean;
  newsletterOptIn: boolean;
  locale: string;
  updatedAt: string;
}

// Composite full User entity used in application layers
export interface User {
  id: string;
  publicId?: string;
  displayId?: string; // Backwards-compatible alias for public reference
  email: string;
  name: string; // Derived from profile.displayName
  role: UserRole;
  passwordHash?: string;
  avatarUrl?: string;
  bio?: string;
  companyName?: string;
  phone?: string;
  claimedStartupId?: string;
  claimedStartupIds?: string[];
  isEmailVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Public representation sent over API (no password hashes or sensitive internal keys)
export interface UserPublicProfile {
  id: string; // Internal UUID
  publicId?: string; // Cryptographic public reference (usr_...)
  displayId?: string; // Backwards-compatible alias
  email: string;
  name: string;
  displayName?: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  companyName?: string;
  phone?: string;
  claimedStartupId?: string;
  claimedStartupIds?: string[];
  createdAt: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  roleIntent?: 'USER' | 'FOUNDER' | 'INVESTOR';
  companyName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export function generateInternalUserId(): string {
  return generatePublicId('usr');
}

export function generateDisplayUserId(role: UserRole = UserRole.USER): string {
  return generatePublicId('usr');
}
