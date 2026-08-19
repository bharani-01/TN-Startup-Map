import { UserRole } from '../utils/constants.js';

export interface User {
  id: string; // Random secure internal UUID/alphanumeric identifier (used internally)
  displayId: string; // Formatted human-readable ID for user reference & receipts (e.g. TN-FND-8492)
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  avatarUrl?: string;
  companyName?: string;
  claimedStartupId?: string;
  claimedStartupIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPublicProfile {
  id: string; // Random internal ID
  displayId: string; // Human-readable reference ID
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
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

// Generate random secure internal user identifier
export function generateInternalUserId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 16; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `usr_${Date.now().toString(36)}_${rand}`;
}

// Generate formatted human-readable reference user code
export function generateDisplayUserId(role: UserRole = UserRole.USER): string {
  const prefix = role === UserRole.ADMIN ? 'TN-ADM' : role === UserRole.FOUNDER ? 'TN-FND' : 'TN-USR';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
