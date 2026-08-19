import { PrismaClient } from '@prisma/client';
import { ALL_TN_DISTRICTS } from '../server/src/database/data/districts.js';
import { INITIAL_SECTORS } from '../server/src/database/data/sectors.js';
import { INITIAL_STARTUPS } from '../server/src/database/data/startups.js';
import { INITIAL_USERS } from '../server/src/database/data/users.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seed for TN Startup Map...');

  // 1. Seed Sectors
  for (const sec of INITIAL_SECTORS) {
    await prisma.sector.upsert({
      where: { slug: sec.slug },
      update: { name: sec.name, icon: sec.icon, color: sec.color, description: sec.description },
      create: { id: sec.id, name: sec.name, slug: sec.slug, icon: sec.icon, color: sec.color, description: sec.description },
    });
  }
  console.log(`✅ Seeded ${INITIAL_SECTORS.length} Sectors`);

  // 2. Seed Districts
  for (const dist of ALL_TN_DISTRICTS) {
    await prisma.district.upsert({
      where: { slug: dist.slug },
      update: {
        name: dist.name,
        headquarters: dist.headquarters,
        latitude: dist.latitude,
        longitude: dist.longitude,
        description: dist.description,
        keySectors: dist.keySectors || [],
        incubatorsCount: dist.incubatorsCount || 0,
      },
      create: {
        id: dist.id,
        name: dist.name,
        slug: dist.slug,
        headquarters: dist.headquarters,
        latitude: dist.latitude,
        longitude: dist.longitude,
        description: dist.description,
        keySectors: dist.keySectors || [],
        incubatorsCount: dist.incubatorsCount || 0,
      },
    });
  }
  console.log(`✅ Seeded ${ALL_TN_DISTRICTS.length} Districts`);

  // 3. Seed Users
  for (const usr of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { email: usr.email },
      update: {
        name: usr.name,
        role: usr.role as any,
        passwordHash: usr.passwordHash,
        companyName: usr.companyName,
        claimedStartupId: usr.claimedStartupId,
      },
      create: {
        id: usr.id,
        email: usr.email,
        name: usr.name,
        role: usr.role as any,
        passwordHash: usr.passwordHash,
        companyName: usr.companyName,
        claimedStartupId: usr.claimedStartupId,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_USERS.length} Initial Users`);

  // 4. Seed Startups
  for (const stp of INITIAL_STARTUPS) {
    await prisma.startup.upsert({
      where: { slug: stp.slug },
      update: {
        name: stp.name,
        tagline: stp.tagline,
        description: stp.description,
        website: stp.website,
        linkedin: stp.linkedin,
        twitter: stp.twitter,
        github: stp.github,
        foundedYear: stp.foundedYear,
        stage: stp.stage,
        fundingType: stp.fundingType,
        totalFundingInr: stp.totalFundingInr,
        totalFundingUsd: stp.totalFundingUsd,
        teamSize: stp.teamSize,
        districtName: stp.district,
        districtSlug: stp.districtSlug,
        city: stp.city,
        latitude: stp.latitude,
        longitude: stp.longitude,
        sectors: stp.sectors,
        founders: stp.founders as any,
        fundingRounds: stp.fundingRounds as any,
        verificationStatus: stp.verificationStatus as any,
        source: stp.source,
        sourceUrl: stp.sourceUrl,
        trendingScore: stp.trendingScore,
        isHiring: stp.isHiring || false,
      },
      create: {
        id: stp.id,
        slug: stp.slug,
        name: stp.name,
        tagline: stp.tagline,
        description: stp.description,
        website: stp.website,
        linkedin: stp.linkedin,
        twitter: stp.twitter,
        github: stp.github,
        foundedYear: stp.foundedYear,
        stage: stp.stage,
        fundingType: stp.fundingType,
        totalFundingInr: stp.totalFundingInr,
        totalFundingUsd: stp.totalFundingUsd,
        teamSize: stp.teamSize,
        districtName: stp.district,
        districtSlug: stp.districtSlug,
        city: stp.city,
        latitude: stp.latitude,
        longitude: stp.longitude,
        sectors: stp.sectors,
        founders: stp.founders as any,
        fundingRounds: stp.fundingRounds as any,
        verificationStatus: stp.verificationStatus as any,
        source: stp.source,
        sourceUrl: stp.sourceUrl,
        trendingScore: stp.trendingScore,
        isHiring: stp.isHiring || false,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_STARTUPS.length} Startups across Tamil Nadu`);

  console.log('🎉 Prisma Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Error during Prisma seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
