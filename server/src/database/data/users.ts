import bcrypt from 'bcryptjs';
import { User } from '../../models/User.js';
import { UserRole } from '../../utils/constants.js';

// Pre-hashed passwords for 'Admin@12345', 'Founder@12345', 'User@12345'
const ADMIN_HASH = bcrypt.hashSync('Admin@12345', 10);
const FOUNDER_HASH = bcrypt.hashSync('Founder@12345', 10);
const USER_HASH = bcrypt.hashSync('User@12345', 10);

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_adm_9x7k2p8w1m4q3v',
    publicId: 'usr_a1b2c3d4e5f60001',
    displayId: 'TN-ADM-0001',
    email: 'admin@tnstartupmap.in',
    name: 'Tamil Nadu Admin',
    role: UserRole.ADMIN,
    passwordHash: ADMIN_HASH,
    companyName: 'TN Startup Ecosystem Mission',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'usr_fnd_4h8m2n9x6y1v7k',
    publicId: 'usr_a1b2c3d4e5f61001',
    displayId: 'TN-FND-1001',
    email: 'srinath@agnikul.in',
    name: 'Srinath Ravichandran',
    role: UserRole.FOUNDER,
    passwordHash: FOUNDER_HASH,
    companyName: 'AgniKul Cosmos',
    claimedStartupId: 'stp-agnikul',
    claimedStartupIds: ['stp-agnikul', 'stp-freshworks', 'stp-ather'],
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: 'usr_mbr_2p9x6y1v7k4h8m',
    publicId: 'usr_a1b2c3d4e5f62001',
    displayId: 'TN-USR-2001',
    email: 'member@tamilnadu.in',
    name: 'Ecosystem Explorer',
    role: UserRole.USER,
    passwordHash: USER_HASH,
    companyName: 'Tech TN Enthusiast',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
];
