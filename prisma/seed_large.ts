import { PrismaClient, UserRole } from '@prisma/client';
import crypto from 'crypto';
import { ALL_TN_DISTRICTS } from '../server/src/database/data/districts.js';
import { INITIAL_SECTORS } from '../server/src/database/data/sectors.js';
import { STORIES_DATA } from '../server/src/database/data/stories.js';
import { generateAllStartups } from '../server/src/database/scripts/generateLargeDataset.js';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

function generatePublicId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

async function main() {
  console.log('[Seed] Starting High-Performance Large Scale Database Seeding...');
  const startTime = Date.now();

  // 1. Clear existing relational data safely
  console.log('[Seed] Resetting existing records...');
  await prisma.startupSector.deleteMany({});
  await prisma.startupMilestone.deleteMany({});
  await prisma.startupAward.deleteMany({});
  await prisma.startupClient.deleteMany({});
  await prisma.startupPress.deleteMany({});
  await prisma.startupLocation.deleteMany({});
  await prisma.startupDetail.deleteMany({});
  await prisma.startupFinancial.deleteMany({});
  await prisma.founder.deleteMany({});
  await prisma.fundingRoundInvestor.deleteMany({});
  await prisma.fundingRound.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.customSection.deleteMany({});
  await prisma.startup.deleteMany({});
  
  await prisma.blogEngagement.deleteMany({});
  await prisma.blogTag.deleteMany({});
  await prisma.blogContent.deleteMany({});
  await prisma.blogPost.deleteMany({});

  // 2. Seed Sectors (17)
  console.log('[Seed] Seeding 17 Industry Sectors...');
  for (let i = 0; i < INITIAL_SECTORS.length; i++) {
    const s = INITIAL_SECTORS[i];
    await prisma.sector.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        icon: s.icon,
        color: s.color,
        description: s.description,
        displayOrder: i,
        isActive: true,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        icon: s.icon,
        color: s.color,
        description: s.description,
        displayOrder: i,
        isActive: true,
      },
    });
  }

  // 3. Seed Districts (38)
  console.log('[Seed] Seeding 38 Districts with Spatial Metadata...');
  for (const d of ALL_TN_DISTRICTS) {
    const districtRecord = await prisma.district.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        headquarters: d.headquarters,
        latitude: d.latitude,
        longitude: d.longitude,
      },
      create: {
        id: d.id,
        name: d.name,
        slug: d.slug,
        headquarters: d.headquarters,
        latitude: d.latitude,
        longitude: d.longitude,
      },
    });

    await prisma.districtMetadata.upsert({
      where: { districtId: districtRecord.id },
      update: {
        description: d.description || `${d.name} District Industrial and Technology Cluster.`,
        keySectors: d.keySectors || [],
        incubatorsCount: d.incubatorsCount || 2,
      },
      create: {
        districtId: districtRecord.id,
        description: d.description || `${d.name} District Industrial and Technology Cluster.`,
        keySectors: d.keySectors || [],
        incubatorsCount: d.incubatorsCount || 2,
      },
    });
  }

  // 4. Seed Ecosystem User & Author
  console.log('[Seed] Seeding Admin and Editorial Accounts...');
  const authorAccount = await prisma.userAccount.upsert({
    where: { email: 'editorial@tnstartupmap.org' },
    update: { role: UserRole.ADMIN, isActive: true },
    create: {
      publicId: generatePublicId('usr'),
      email: 'editorial@tnstartupmap.org',
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  });

  await prisma.userProfile.upsert({
    where: { userAccountId: authorAccount.id },
    update: { displayName: 'Tamil Nadu Startup Map Editorial Bureau', companyName: 'StartupTN Ecosystem' },
    create: {
      userAccountId: authorAccount.id,
      displayName: 'Tamil Nadu Startup Map Editorial Bureau',
      companyName: 'StartupTN Ecosystem',
    },
  });

  // 5. Seed Stories & Ecosystem Articles (Domain 4)
  console.log('[Seed] Seeding In-Depth Founder Stories & Regional Case Studies...');
  for (let i = 0; i < STORIES_DATA.length; i++) {
    const st = STORIES_DATA[i];
    const postRecord = await prisma.blogPost.upsert({
      where: { slug: st.slug },
      update: {
        title: st.title,
        subtitle: st.excerpt,
        coverImageUrl: st.coverImage,
        category: 'FOUNDER_STORIES',
        isFeatured: i < 3,
        status: 'PUBLISHED',
        readTimeMinutes: st.readTimeMinutes,
        publishedAt: new Date(Date.now() - i * 86400000 * 3),
      },
      create: {
        publicId: generatePublicId('pst'),
        authorId: authorAccount.id,
        title: st.title,
        subtitle: st.excerpt,
        slug: st.slug,
        coverImageUrl: st.coverImage,
        category: 'FOUNDER_STORIES',
        isFeatured: i < 3,
        status: 'PUBLISHED',
        readTimeMinutes: st.readTimeMinutes,
        publishedAt: new Date(Date.now() - i * 86400000 * 3),
      },
    });

    await prisma.blogContent.upsert({
      where: { blogPostId: postRecord.id },
      update: {
        contentMarkdown: st.content,
        wordCount: st.content.split(/\s+/).length,
      },
      create: {
        blogPostId: postRecord.id,
        contentMarkdown: st.content,
        wordCount: st.content.split(/\s+/).length,
      },
    });

    for (const tag of st.tags) {
      await prisma.blogTag.create({
        data: {
          blogPostId: postRecord.id,
          tag: tag,
        },
      });
    }

    await prisma.blogEngagement.upsert({
      where: { blogPostId: postRecord.id },
      update: {
        clapsCount: 65 + i * 18,
      },
      create: {
        blogPostId: postRecord.id,
        clapsCount: 65 + i * 18,
      },
    });
  }

  // 6. Generate 1,200+ Startups
  console.log('[Seed] Generating comprehensive ~1,250 startup dataset...');
  const allStartups = generateAllStartups();
  console.log(`[Seed] Total startups compiled: ${allStartups.length}`);

  // Fetch district and sector mappings for foreign keys
  const dbDistricts = await prisma.district.findMany();
  const districtMap = new Map(dbDistricts.map((d) => [d.slug.toLowerCase(), d.id]));
  const districtNameMap = new Map(dbDistricts.map((d) => [d.name.toLowerCase(), d.id]));

  const dbSectors = await prisma.sector.findMany();
  const sectorMap = new Map(dbSectors.map((s) => [s.name.toLowerCase(), s.id]));

  // 7. Bulk Chunked Insertion (Batches of 100)
  const CHUNK_SIZE = 75;
  const totalChunks = Math.ceil(allStartups.length / CHUNK_SIZE);
  const stageMap: Record<string, any> = {
    Idea: 'IDEA',
    'Pre-seed': 'PRE_SEED',
    Seed: 'SEED',
    'Pre-Series A': 'SEED',
    'Series A': 'SERIES_A',
    'Series B': 'SERIES_B_PLUS',
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

  for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
    const chunk = allStartups.slice(chunkIdx * CHUNK_SIZE, (chunkIdx + 1) * CHUNK_SIZE);
    console.log(`[Seed] Inserting batch ${chunkIdx + 1} of ${totalChunks} (${chunk.length} startups)...`);

    for (const stp of chunk) {
      const distId = districtMap.get(stp.districtSlug?.toLowerCase() || '') || districtNameMap.get(stp.district?.toLowerCase() || '') || dbDistricts[0].id;
      
      const startupRecord = await prisma.startup.upsert({
        where: { slug: stp.slug },
        update: {
          name: stp.name,
          tagline: stp.tagline,
          website: stp.website,
          stage: stageMap[stp.stage] || 'SEED',
          fundingType: fundingTypeMap[stp.fundingType] || 'BOOTSTRAPPED',
          foundedYear: stp.foundedYear || 2022,
          teamSize: stp.teamSize,
          isHiring: stp.isHiring || false,
          verificationStatus: 'VERIFIED',
        },
        create: {
          id: stp.id,
          publicId: generatePublicId('stp'),
          slug: stp.slug,
          name: stp.name,
          tagline: stp.tagline,
          website: stp.website,
          stage: stageMap[stp.stage] || 'SEED',
          fundingType: fundingTypeMap[stp.fundingType] || 'BOOTSTRAPPED',
          foundedYear: stp.foundedYear || 2022,
          teamSize: stp.teamSize,
          isHiring: stp.isHiring || false,
          verificationStatus: 'VERIFIED',
        },
      });

      // Startup Location
      await prisma.startupLocation.upsert({
        where: { startupId: startupRecord.id },
        update: {
          districtId: distId,
          city: stp.city || stp.district,
          latitude: stp.latitude,
          longitude: stp.longitude,
          address: stp.address,
          pincode: stp.pincode,
        },
        create: {
          startupId: startupRecord.id,
          districtId: distId,
          city: stp.city || stp.district,
          latitude: stp.latitude,
          longitude: stp.longitude,
          address: stp.address,
          pincode: stp.pincode,
        },
      });

      // Startup Detail
      await prisma.startupDetail.upsert({
        where: { startupId: startupRecord.id },
        update: {
          description: stp.description,
          extendedBio: stp.extendedBio,
          logoUrl: stp.logoUrl,
          bannerUrl: stp.bannerUrl,
          businessModel: stp.businessModel,
          revenueModel: stp.revenueModel,
          revenueRange: stp.revenueRange,
          targetMarket: stp.targetMarket,
          customerSegments: stp.customerSegments || [],
          incubator: stp.incubator,
          accelerator: stp.accelerator,
          dpiitNumber: stp.dpiitNumber,
          competitiveEdge: stp.competitiveEdge,
          isProfitable: stp.isProfitable,
          source: stp.source || 'StartupTN Registry & Verified Research',
        },
        create: {
          startupId: startupRecord.id,
          description: stp.description,
          extendedBio: stp.extendedBio,
          logoUrl: stp.logoUrl,
          bannerUrl: stp.bannerUrl,
          businessModel: stp.businessModel,
          revenueModel: stp.revenueModel,
          revenueRange: stp.revenueRange,
          targetMarket: stp.targetMarket,
          customerSegments: stp.customerSegments || [],
          incubator: stp.incubator,
          accelerator: stp.accelerator,
          dpiitNumber: stp.dpiitNumber,
          competitiveEdge: stp.competitiveEdge,
          isProfitable: stp.isProfitable,
          source: stp.source || 'StartupTN Registry & Verified Research',
        },
      });

      // Startup Financials
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

      // Sectors
      if (stp.sectors && Array.isArray(stp.sectors)) {
        for (let i = 0; i < stp.sectors.length; i++) {
          const secName = stp.sectors[i];
          const secId = sectorMap.get(secName.toLowerCase());
          if (secId) {
            await prisma.startupSector.upsert({
              where: {
                startupId_sectorId: {
                  startupId: startupRecord.id,
                  sectorId: secId,
                },
              },
              update: { isPrimary: i === 0 },
              create: {
                startupId: startupRecord.id,
                sectorId: secId,
                isPrimary: i === 0,
              },
            });
          }
        }
      }

      // Founders
      if (stp.founders && Array.isArray(stp.founders)) {
        for (let i = 0; i < stp.founders.length; i++) {
          const f = stp.founders[i];
          const founderId = `fnd-${startupRecord.slug}-${i + 1}`;
          await prisma.founder.upsert({
            where: { id: founderId },
            update: {
              name: f.name,
              roleTitle: f.role || 'Founder',
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
              roleTitle: f.role || 'Founder',
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

      // Milestones
      if (stp.milestones && Array.isArray(stp.milestones)) {
        for (let i = 0; i < stp.milestones.length; i++) {
          const m = stp.milestones[i];
          const milestoneId = `mls-${startupRecord.slug}-${i + 1}`;
          const milestoneDate = m.date ? (m.date.length === 7 ? new Date(`${m.date}-01`) : new Date(m.date)) : new Date();
          await prisma.startupMilestone.upsert({
            where: { id: milestoneId },
            update: {
              title: m.title,
              date: milestoneDate,
              category: m.category || 'MILESTONE',
              description: m.description,
              displayOrder: i,
            },
            create: {
              id: milestoneId,
              startupId: startupRecord.id,
              title: m.title,
              date: milestoneDate,
              category: m.category || 'MILESTONE',
              description: m.description,
              displayOrder: i,
            },
          });
        }
      }

      // Awards
      if (stp.awards && Array.isArray(stp.awards)) {
        for (let i = 0; i < stp.awards.length; i++) {
          const a = stp.awards[i];
          const awardId = `awd-${startupRecord.slug}-${i + 1}`;
          const awardYear = typeof a.year === 'number' ? a.year : parseInt(a.year, 10) || 2023;
          await prisma.startupAward.upsert({
            where: { id: awardId },
            update: {
              title: a.title,
              organization: a.organization,
              year: awardYear,
              url: a.url,
            },
            create: {
              id: awardId,
              startupId: startupRecord.id,
              title: a.title,
              organization: a.organization,
              year: awardYear,
              url: a.url,
            },
          });
        }
      }

      // Clients
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

      // Press
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
  }

  // Record audit log
  await prisma.auditLog.create({
    data: {
      publicId: generatePublicId('aud'),
      entityType: 'DATABASE_SEED',
      entityId: 'SYSTEM',
      action: 'BULK_SEED_ALL_DISTRICTS',
      changes: {
        totalStartups: allStartups.length,
        districts: 38,
        sectors: 17,
        stories: STORIES_DATA.length,
        durationSeconds: ((Date.now() - startTime) / 1000).toFixed(1),
      },
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n======================================================`);
  console.log(`[Seed Complete] Successfully seeded ${allStartups.length} Startups & ${STORIES_DATA.length} Stories across all 38 Districts in ${duration}s.`);
  console.log(`======================================================\n`);
}

main()
  .catch((e) => {
    console.error('[Seed Error] Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
