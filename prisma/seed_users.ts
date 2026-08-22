import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generatePublicId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

async function main() {
  console.log('[Seed Users] Seeding standard admin and demo accounts into Supabase...');

  const ADMIN_HASH = await bcrypt.hash('Admin@12345', 10);
  const FOUNDER_HASH = await bcrypt.hash('Founder@12345', 10);
  const USER_HASH = await bcrypt.hash('User@12345', 10);

  const usersToSeed = [
    {
      id: 'usr_adm_9x7k2p8w1m4q3v',
      publicId: 'usr_a1b2c3d4e5f60001',
      email: 'admin@tnstartupmap.in',
      displayName: 'Tamil Nadu Admin',
      role: UserRole.ADMIN,
      passwordHash: ADMIN_HASH,
      companyName: 'TN Startup Ecosystem Mission',
    },
    {
      id: 'usr_fnd_4h8m2n9x6y1v7k',
      publicId: 'usr_a1b2c3d4e5f61001',
      email: 'srinath@agnikul.in',
      displayName: 'Srinath Ravichandran',
      role: UserRole.FOUNDER,
      passwordHash: FOUNDER_HASH,
      companyName: 'AgniKul Cosmos',
    },
    {
      id: 'usr_mbr_2p9x6y1v7k4h8m',
      publicId: 'usr_a1b2c3d4e5f62001',
      email: 'member@tamilnadu.in',
      displayName: 'Ecosystem Explorer',
      role: UserRole.USER,
      passwordHash: USER_HASH,
      companyName: 'Tech TN Enthusiast',
    },
  ];

  for (const u of usersToSeed) {
    const acc = await prisma.userAccount.upsert({
      where: { email: u.email },
      update: {
        role: u.role,
        passwordHash: u.passwordHash,
        isActive: true,
        isEmailVerified: true,
      },
      create: {
        id: u.id,
        publicId: u.publicId,
        email: u.email,
        role: u.role,
        passwordHash: u.passwordHash,
        isActive: true,
        isEmailVerified: true,
      },
    });

    await prisma.userProfile.upsert({
      where: { userAccountId: acc.id },
      update: {
        displayName: u.displayName,
        companyName: u.companyName,
      },
      create: {
        userAccountId: acc.id,
        displayName: u.displayName,
        companyName: u.companyName,
      },
    });

    console.log(`  [OK] Seeded account: ${u.email} (${u.role})`);
  }

  console.log('[Seed Users] Done.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
