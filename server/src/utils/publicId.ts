import crypto from 'crypto';

export type PublicIdPrefix = 
  | 'usr' // User accounts
  | 'stp' // Startups
  | 'fnd' // Founders
  | 'inv' // Investors
  | 'blg' // Blog posts
  | 'sub' // Submissions
  | 'clm' // Claims
  | 'ntf' // Notifications
  | 'ses' // Sessions
  | 'sec' // Sectors
  | 'dst' // Districts
  | 'med' // Media
  | 'fndr' // Funding rounds
  | 'aud' // Audit logs
  | 'rev' // Reviews
  | 'evd' // Evidence
  | 'job'; // Job listings

/**
 * Generate a cryptographically secure, 16-hex-character public identifier
 * with domain prefix (e.g., usr_9f8a3c2e1b4d7e05).
 * Total length: prefix (3-4 chars) + "_" + 16 chars = 20-21 characters.
 */
export function generatePublicId(prefix: PublicIdPrefix): string {
  const randomHex = crypto.randomBytes(8).toString('hex'); // 8 bytes = 16 hex chars
  return `${prefix}_${randomHex}`;
}

/**
 * Validates if an input string is a valid prefixed public ID.
 */
export function isValidPublicId(id: string, expectedPrefix?: PublicIdPrefix): boolean {
  if (!id || typeof id !== 'string') return false;
  const parts = id.split('_');
  if (parts.length !== 2) return false;
  if (expectedPrefix && parts[0] !== expectedPrefix) return false;
  return /^[a-f0-9]{16}$/i.test(parts[1]);
}
