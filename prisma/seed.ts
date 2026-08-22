import { PrismaClient } from '@prisma/client';
import { ALL_TN_DISTRICTS } from '../server/src/database/data/districts.js';
import { INITIAL_SECTORS } from '../server/src/database/data/sectors.js';
import { INITIAL_STARTUPS } from '../server/src/database/data/startups.js';
import { INITIAL_USERS } from '../server/src/database/data/users.js';
import { INITIAL_BLOGS } from '../server/src/database/data/blogs.js';
import { generatePublicId } from '../server/src/utils/publicId.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise Normalized Prisma Seed (35 Tables)...');

  // 1. Seed Sectors
  for (let i = 0; i < INITIAL_SECTORS.length; i++) {
    const sec = INITIAL_SECTORS[i];
    await prisma.sector.upsert({
      where: { slug: sec.slug },
      update: {
        name: sec.name,
        icon: sec.icon,
        color: sec.color,
        description: sec.description,
        displayOrder: i,
        isActive: true,
      },
      create: {
        id: sec.id,
        name: sec.name,
        slug: sec.slug,
        icon: sec.icon,
        color: sec.color,
        description: sec.description,
        displayOrder: i,
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_SECTORS.length} Sectors`);

  // 2. Seed Districts + DistrictMetadata
  for (const dist of ALL_TN_DISTRICTS) {
    const districtRecord = await prisma.district.upsert({
      where: { slug: dist.slug },
      update: {
        name: dist.name,
        headquarters: dist.headquarters,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
      create: {
        id: dist.id,
        name: dist.name,
        slug: dist.slug,
        headquarters: dist.headquarters,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
    });

    await prisma.districtMetadata.upsert({
      where: { districtId: districtRecord.id },
      update: {
        description: dist.description,
        keySectors: dist.keySectors || [],
        incubatorsCount: dist.incubatorsCount || 0,
      },
      create: {
        districtId: districtRecord.id,
        description: dist.description,
        keySectors: dist.keySectors || [],
        incubatorsCount: dist.incubatorsCount || 0,
      },
    });
  }
  console.log(`✅ Seeded ${ALL_TN_DISTRICTS.length} Districts with Metadata`);

  // 3. Seed Top Ecosystem Investors
  const seedInvestors = [
    {
      id: 'inv-tansim',
      name: 'StartupTN / TANFUND',
      type: 'GOVERNMENT' as const,
      website: 'https://startuptn.in',
      description: 'Tamil Nadu government seed fund and venture initiative.',
      headquartersCity: 'Chennai',
    },
    {
      id: 'inv-specialinvest',
      name: 'Speciale Invest',
      type: 'VC' as const,
      website: 'https://specialeinvest.com',
      description: 'Pioneering seed-stage DeepTech venture capital firm.',
      headquartersCity: 'Chennai',
    },
    {
      id: 'inv-iitmic',
      name: 'IIT Madras Incubation Cell',
      type: 'ACCELERATOR' as const,
      website: 'https://incubation.iitm.ac.in',
      description: 'Indias premier deep technology business incubator.',
      headquartersCity: 'Chennai',
    },
  ];

  for (const inv of seedInvestors) {
    await prisma.investor.upsert({
      where: { id: inv.id },
      update: {
        name: inv.name,
        type: inv.type,
        website: inv.website,
        description: inv.description,
        headquartersCity: inv.headquartersCity,
      },
      create: {
        id: inv.id,
        publicId: generatePublicId('inv'),
        name: inv.name,
        type: inv.type,
        website: inv.website,
        description: inv.description,
        headquartersCity: inv.headquartersCity,
      },
    });
  }
  console.log(`✅ Seeded ${seedInvestors.length} Ecosystem Investors`);

  // 4. Seed User Accounts + Profiles + Contacts + Preferences
  for (const usr of INITIAL_USERS) {
    const userAccount = await prisma.userAccount.upsert({
      where: { email: usr.email },
      update: {
        role: usr.role as any,
        passwordHash: usr.passwordHash,
        isEmailVerified: true,
        isActive: true,
      },
      create: {
        id: usr.id,
        publicId: (usr as any).publicId || generatePublicId('usr'),
        email: usr.email,
        role: usr.role as any,
        passwordHash: usr.passwordHash,
        isEmailVerified: true,
        isActive: true,
      },
    });

    await prisma.userProfile.upsert({
      where: { userAccountId: userAccount.id },
      update: {
        displayName: usr.name,
        companyName: usr.companyName,
      },
      create: {
        userAccountId: userAccount.id,
        displayName: usr.name,
        companyName: usr.companyName,
      },
    });

    await prisma.userContact.upsert({
      where: { userAccountId: userAccount.id },
      update: {
        state: 'Tamil Nadu',
      },
      create: {
        userAccountId: userAccount.id,
        state: 'Tamil Nadu',
      },
    });

    await prisma.userPreference.upsert({
      where: { userAccountId: userAccount.id },
      update: {
        theme: 'system',
        emailNotifications: true,
      },
      create: {
        userAccountId: userAccount.id,
        theme: 'system',
        emailNotifications: true,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_USERS.length} User Accounts across 4 decomposed tables`);

  // 5. Seed Startups + Details + Location + Financials + Founders + Funding + Sectors
  for (const stp of INITIAL_STARTUPS) {
    const stageMap: Record<string, any> = {
      Idea: 'IDEA',
      'Pre-seed': 'PRE_SEED',
      Seed: 'SEED',
      'Series A': 'SERIES_A',
      'Series B+': 'SERIES_B_PLUS',
      Bootstrapped: 'BOOTSTRAPPED',
      Acquired: 'ACQUIRED',
    };

    const fundingTypeMap: Record<string, any> = {
      Bootstrapped: 'BOOTSTRAPPED',
      Angel: 'ANGEL',
      'Pre-seed': 'PRE_SEED',
      Seed: 'SEED',
      'Venture funded': 'VENTURE_FUNDED',
    };

    const startupRecord = await prisma.startup.upsert({
      where: { slug: stp.slug },
      update: {
        name: stp.name,
        tagline: stp.tagline,
        website: stp.website,
        stage: stageMap[stp.stage] || 'SEED',
        fundingType: fundingTypeMap[stp.fundingType] || 'BOOTSTRAPPED',
        foundedYear: stp.foundedYear,
        teamSize: stp.teamSize,
        trendingScore: stp.trendingScore,
        isHiring: stp.isHiring || false,
        verificationStatus: 'VERIFIED',
      },
      create: {
        id: stp.id,
        publicId: (stp as any).publicId || generatePublicId('stp'),
        slug: stp.slug,
        name: stp.name,
        tagline: stp.tagline,
        website: stp.website,
        stage: stageMap[stp.stage] || 'SEED',
        fundingType: fundingTypeMap[stp.fundingType] || 'BOOTSTRAPPED',
        foundedYear: stp.foundedYear,
        teamSize: stp.teamSize,
        trendingScore: stp.trendingScore,
        isHiring: stp.isHiring || false,
        verificationStatus: 'VERIFIED',
      },
    });

    // Details table
    await prisma.startupDetail.upsert({
      where: { startupId: startupRecord.id },
      update: {
        description: stp.description,
        extendedBio: stp.extendedBio,
        logoUrl: stp.logoUrl,
        bannerUrl: stp.bannerUrl,
        brandColor: stp.brandColor,
        businessModel: stp.businessModel,
        revenueModel: stp.revenueModel,
        revenueRange: stp.revenueRange,
        targetMarket: stp.targetMarket,
        customerSegments: stp.customerSegments || [],
        incubator: stp.incubator,
        accelerator: stp.accelerator,
        dpiitNumber: stp.dpiitNumber,
        demoVideoUrl: stp.demoVideoUrl,
        pitchDeckUrl: stp.pitchDeckUrl,
        competitiveEdge: stp.competitiveEdge,
        isProfitable: stp.isProfitable,
        source: stp.source || 'Platform Verification',
        sourceUrl: stp.sourceUrl,
      },
      create: {
        startupId: startupRecord.id,
        description: stp.description,
        extendedBio: stp.extendedBio,
        logoUrl: stp.logoUrl,
        bannerUrl: stp.bannerUrl,
        brandColor: stp.brandColor,
        businessModel: stp.businessModel,
        revenueModel: stp.revenueModel,
        revenueRange: stp.revenueRange,
        targetMarket: stp.targetMarket,
        customerSegments: stp.customerSegments || [],
        incubator: stp.incubator,
        accelerator: stp.accelerator,
        dpiitNumber: stp.dpiitNumber,
        demoVideoUrl: stp.demoVideoUrl,
        pitchDeckUrl: stp.pitchDeckUrl,
        competitiveEdge: stp.competitiveEdge,
        isProfitable: stp.isProfitable,
        source: stp.source || 'Platform Verification',
        sourceUrl: stp.sourceUrl,
      },
    });

    // Location table
    const matchedDistrict = ALL_TN_DISTRICTS.find(
      (d) => d.slug === stp.districtSlug || d.name.toLowerCase() === stp.district.toLowerCase()
    );

    await prisma.startupLocation.upsert({
      where: { startupId: startupRecord.id },
      update: {
        districtId: matchedDistrict ? matchedDistrict.id : undefined,
        city: stp.city,
        latitude: stp.latitude,
        longitude: stp.longitude,
      },
      create: {
        startupId: startupRecord.id,
        districtId: matchedDistrict ? matchedDistrict.id : undefined,
        city: stp.city,
        latitude: stp.latitude,
        longitude: stp.longitude,
      },
    });

    // Financials table
    await prisma.startupFinancial.upsert({
      where: { startupId: startupRecord.id },
      update: {
        totalFundingInr: stp.totalFundingInr,
        totalFundingUsd: stp.totalFundingUsd,
      },
      create: {
        startupId: startupRecord.id,
        totalFundingInr: stp.totalFundingInr,
        totalFundingUsd: stp.totalFundingUsd,
      },
    });

    // Sector junction table
    if (stp.sectors && stp.sectors.length > 0) {
      for (let i = 0; i < stp.sectors.length; i++) {
        const sectorName = stp.sectors[i];
        const secRecord = INITIAL_SECTORS.find((s) => s.name.toLowerCase() === sectorName.toLowerCase());
        if (secRecord) {
          await prisma.startupSector.upsert({
            where: {
              startupId_sectorId: {
                startupId: startupRecord.id,
                sectorId: secRecord.id,
              },
            },
            update: { isPrimary: i === 0 },
            create: {
              startupId: startupRecord.id,
              sectorId: secRecord.id,
              isPrimary: i === 0,
            },
          });
        }
      }
    }

    // Founders table
    if (stp.founders && Array.isArray(stp.founders)) {
      for (let i = 0; i < stp.founders.length; i++) {
        const f = stp.founders[i] as any;
        const founderId = `fnd-${startupRecord.slug}-${i + 1}`;
        await prisma.founder.upsert({
          where: { id: founderId },
          update: {
            name: f.name,
            roleTitle: f.role || f.roleTitle || 'Founder',
            bio: f.bio,
            avatarUrl: f.avatarUrl,
            education: f.education,
            previousCompanies: f.previousCompanies,
            displayOrder: i,
          },
          create: {
            id: founderId,
            publicId: generatePublicId('fnd'),
            startupId: startupRecord.id,
            name: f.name,
            roleTitle: f.role || f.roleTitle || 'Founder',
            bio: f.bio,
            avatarUrl: f.avatarUrl,
            education: f.education,
            previousCompanies: f.previousCompanies,
            displayOrder: i,
          },
        });

        if (f.linkedin) {
          await prisma.socialLink.upsert({
            where: {
              entityType_entityId_platform: {
                entityType: 'FOUNDER',
                entityId: founderId,
                platform: 'LINKEDIN',
              },
            },
            update: { url: f.linkedin },
            create: {
              entityType: 'FOUNDER',
              entityId: founderId,
              platform: 'LINKEDIN',
              url: f.linkedin,
            },
          });
        }
      }
    }

    // Funding rounds table
    if (stp.fundingRounds && Array.isArray(stp.fundingRounds)) {
      for (let i = 0; i < stp.fundingRounds.length; i++) {
        const r = stp.fundingRounds[i] as any;
        const roundId = `rnd-${startupRecord.slug}-${i + 1}`;
        await prisma.fundingRound.upsert({
          where: { id: roundId },
          update: {
            roundType: r.roundType || 'Seed',
            amountInr: r.amountInr,
            amountUsd: r.amountUsd,
            roundDate: r.date ? new Date(r.date) : new Date(),
          },
          create: {
            id: roundId,
            startupId: startupRecord.id,
            roundType: r.roundType || 'Seed',
            amountInr: r.amountInr,
            amountUsd: r.amountUsd,
            roundDate: r.date ? new Date(r.date) : new Date(),
          },
        });
      }
    }

    // Milestones table
    if (stp.milestones && Array.isArray(stp.milestones)) {
      for (let i = 0; i < stp.milestones.length; i++) {
        const m = stp.milestones[i];
        const milestoneId = `mls-${startupRecord.slug}-${i + 1}`;
        await prisma.startupMilestone.upsert({
          where: { id: milestoneId },
          update: {
            title: m.title,
            description: m.description,
            date: m.date ? new Date(m.date) : new Date(),
            category: m.category,
            displayOrder: i,
          },
          create: {
            id: milestoneId,
            startupId: startupRecord.id,
            title: m.title,
            description: m.description,
            date: m.date ? new Date(m.date) : new Date(),
            category: m.category,
            displayOrder: i,
          },
        });
      }
    }

    // Awards table
    if (stp.awards && Array.isArray(stp.awards)) {
      for (let i = 0; i < stp.awards.length; i++) {
        const a = stp.awards[i];
        const awardId = `awd-${startupRecord.slug}-${i + 1}`;
        await prisma.startupAward.upsert({
          where: { id: awardId },
          update: {
            title: a.title,
            organization: a.organization,
            year: a.year,
            url: a.url,
          },
          create: {
            id: awardId,
            startupId: startupRecord.id,
            title: a.title,
            organization: a.organization,
            year: a.year,
            url: a.url,
          },
        });
      }
    }

    // Key Clients table
    if (stp.keyClients && Array.isArray(stp.keyClients)) {
      for (let i = 0; i < stp.keyClients.length; i++) {
        const c = stp.keyClients[i];
        const clientId = `clt-${startupRecord.slug}-${i + 1}`;
        await prisma.startupClient.upsert({
          where: { id: clientId },
          update: {
            name: c.name,
            logoUrl: c.logoUrl,
            website: c.website,
            displayOrder: i,
          },
          create: {
            id: clientId,
            startupId: startupRecord.id,
            name: c.name,
            logoUrl: c.logoUrl,
            website: c.website,
            displayOrder: i,
          },
        });
      }
    }

    // Press Mentions table
    if (stp.pressMentions && Array.isArray(stp.pressMentions)) {
      for (let i = 0; i < stp.pressMentions.length; i++) {
        const p = stp.pressMentions[i];
        const pressId = `prs-${startupRecord.slug}-${i + 1}`;
        await prisma.startupPress.upsert({
          where: { id: pressId },
          update: {
            title: p.title,
            publication: p.publication,
            url: p.url,
            publishedDate: p.publishedDate ? new Date(p.publishedDate) : undefined,
          },
          create: {
            id: pressId,
            startupId: startupRecord.id,
            title: p.title,
            publication: p.publication,
            url: p.url,
            publishedDate: p.publishedDate ? new Date(p.publishedDate) : undefined,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${INITIAL_STARTUPS.length} Startups across 7 decomposed tables`);

  // 6. Seed Blog Posts + Content + Tags + Engagement
  const categoryEnumMap: Record<string, any> = {
    'Founder Stories': 'FOUNDER_STORIES',
    'Ecosystem News': 'ECOSYSTEM_NEWS',
    'DeepTech Insights': 'DEEPTECH_INSIGHTS',
    'Policy & Grants': 'POLICY_GRANTS',
    'Fundraising': 'FUNDRAISING',
    'Tech Architecture': 'TECH_ARCHITECTURE',
  };

  for (const b of INITIAL_BLOGS) {
    const authorUser = await prisma.userAccount.findFirst({
      where: { email: b.authorEmail },
    });

    const matchedStartup = b.startupSlug
      ? await prisma.startup.findUnique({ where: { slug: b.startupSlug } })
      : null;

    if (authorUser) {
      const blogRecord = await prisma.blogPost.upsert({
        where: { slug: b.slug },
        update: {
          title: b.title,
          subtitle: b.subtitle,
          category: categoryEnumMap[b.category] || 'FOUNDER_STORIES',
          coverImageUrl: b.coverImageUrl,
          authorId: authorUser.id,
          startupId: matchedStartup ? matchedStartup.id : undefined,
          status: 'PUBLISHED',
          isFeatured: b.featured || false,
          readTimeMinutes: b.readTimeMinutes || 5,
          publishedAt: new Date(b.publishedAt),
        },
        create: {
          id: b.id,
          publicId: (b as any).publicId || generatePublicId('blg'),
          slug: b.slug,
          title: b.title,
          subtitle: b.subtitle,
          category: categoryEnumMap[b.category] || 'FOUNDER_STORIES',
          coverImageUrl: b.coverImageUrl,
          authorId: authorUser.id,
          startupId: matchedStartup ? matchedStartup.id : undefined,
          status: 'PUBLISHED',
          isFeatured: b.featured || false,
          readTimeMinutes: b.readTimeMinutes || 5,
          publishedAt: new Date(b.publishedAt),
        },
      });

      // Content table
      await prisma.blogContent.upsert({
        where: { blogPostId: blogRecord.id },
        update: {
          contentMarkdown: b.content,
          wordCount: b.content.split(/\s+/).length,
        },
        create: {
          blogPostId: blogRecord.id,
          contentMarkdown: b.content,
          wordCount: b.content.split(/\s+/).length,
        },
      });

      // Engagement table
      await prisma.blogEngagement.upsert({
        where: { blogPostId: blogRecord.id },
        update: {
          clapsCount: b.clapsCount || 0,
        },
        create: {
          blogPostId: blogRecord.id,
          clapsCount: b.clapsCount || 0,
        },
      });

      // Tags table
      if (b.tags && Array.isArray(b.tags)) {
        for (const tag of b.tags) {
          const tagId = `tag-${blogRecord.id}-${tag.toLowerCase()}`;
          await prisma.blogTag.upsert({
            where: { id: tagId },
            update: { tag },
            create: {
              id: tagId,
              blogPostId: blogRecord.id,
              tag,
            },
          });
        }
      }
    }
  }
  console.log(`✅ Seeded ${INITIAL_BLOGS.length} Blog Posts across 4 decomposed tables`);

  // 7. Seed Initial System Audit Log
  await prisma.auditLog.create({
    data: {
      action: 'system.database.seed',
      entityType: 'system',
      metadata: {
        version: '2.0.0-enterprise',
        tablesCount: 35,
        timestamp: new Date().toISOString(),
      },
    },
  });
  console.log('✅ Recorded initial system seed in audit_logs table');

  console.log('🎉 Enterprise Normalized Prisma Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Error during Prisma seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
