import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { ALL_TN_DISTRICTS } from './data/districts.js';
import { INITIAL_SECTORS } from './data/sectors.js';
import { INITIAL_USERS } from './data/users.js';
import { INITIAL_STARTUPS } from './data/startups.js';
import { INITIAL_BLOGS } from './data/blogs.js';
import { Startup } from '../models/Startup.js';
import { District } from '../models/District.js';
import { Sector } from '../models/Sector.js';
import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { Claim } from '../models/Claim.js';
import { BlogPost } from '../models/BlogPost.js';
import { Investor } from '../models/Investor.js';
import { AuditLog, CreateAuditLogDTO } from '../models/AuditLog.js';
import { Notification } from '../models/Notification.js';
import { generatePublicId } from '../utils/publicId.js';

let dbUrl = process.env.DATABASE_URL?.trim();
if (dbUrl) {
  if ((dbUrl.startsWith('"') && dbUrl.endsWith('"')) || (dbUrl.startsWith("'") && dbUrl.endsWith("'"))) {
    dbUrl = dbUrl.slice(1, -1).trim();
  }
}

export const prisma = new PrismaClient(
  dbUrl
    ? {
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      }
    : undefined
);

class SpatialDatabase {
  private static instance: SpatialDatabase;
  private isConnected: boolean = false;
  private usePrisma: boolean = true;

  // In-memory runtime mirror for high-speed spatial querying and instant filtering
  public startups: Map<string, Startup> = new Map();
  public districts: Map<string, District> = new Map();
  public sectors: Map<string, Sector> = new Map();
  public users: Map<string, User> = new Map();
  public submissions: Map<string, Submission> = new Map();
  public claims: Map<string, Claim> = new Map();
  public blogs: Map<string, BlogPost> = new Map();
  public investors: Map<string, Investor> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public auditLogs: AuditLog[] = [];

  private constructor() {}

  public static getInstance(): SpatialDatabase {
    if (!SpatialDatabase.instance) {
      SpatialDatabase.instance = new SpatialDatabase();
    }
    return SpatialDatabase.instance;
  }

  public async connect(): Promise<void> {
    try {
      await prisma.$connect();
      this.isConnected = true;
      logger.info('Connected to PostgreSQL Database via Prisma ORM (39 Decomposed Models Active)');
      await this.syncFromDatabase();
    } catch (err: any) {
      this.usePrisma = false;
      logger.warn(`PostgreSQL connection failed: ${err.message}. App will serve empty state until DB is available.`);
    }
  }

  public async recordAuditLog(entry: CreateAuditLogDTO): Promise<void> {
    const logItem: AuditLog = {
      id: generatePublicId('aud'),
      actorId: entry.actorId || null,
      actorEmail: entry.actorEmail || null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId || null,
      oldValue: entry.oldValue || null,
      newValue: entry.newValue || null,
      ipAddress: entry.ipAddress || null,
      userAgent: entry.userAgent || null,
      metadata: entry.metadata || null,
      createdAt: new Date().toISOString(),
    };

    this.auditLogs.unshift(logItem);
    if (this.auditLogs.length > 5000) {
      this.auditLogs.pop();
    }

    if (this.isConnected) {
      try {
        await (prisma as any).auditLog?.create({
          data: {
            actorId: entry.actorId,
            actorEmail: entry.actorEmail,
            action: entry.action,
            entityType: entry.entityType,
            entityId: entry.entityId,
            oldValue: entry.oldValue ? (entry.oldValue as any) : undefined,
            newValue: entry.newValue ? (entry.newValue as any) : undefined,
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
            metadata: entry.metadata ? (entry.metadata as any) : undefined,
          },
        });
      } catch (err: any) {
        logger.warn(`Could not persist audit log to DB: ${err.message}`);
      }
    }
  }

  private async syncFromDatabase(): Promise<void> {
    try {
      const p = prisma as any;
      const [
        dbDistricts,
        dbSectors,
        dbUsers,
        dbStartups,
        dbSubmissions,
        dbClaims,
        dbBlogs,
        dbInvestors,
      ] = await Promise.all([
        p.district?.findMany ? p.district.findMany({ include: { metadata: true } }).catch(() => []) : [],
        p.sector?.findMany ? p.sector.findMany().catch(() => []) : [],
        p.userAccount?.findMany ? p.userAccount.findMany({ include: { profile: true, contact: true } }).catch(() => []) : [],
        p.startup?.findMany ? p.startup.findMany({
          include: {
            details: true,
            location: { include: { district: true } },
            financials: true,
            media: true,
            sectors: { include: { sector: true } },
            techStack: true,
            founders: true,
            fundingRounds: { include: { investors: { include: { investor: true } } } },
            customSections: true,
            milestones: true,
            awards: true,
            clients: true,
            pressMentions: true,
          },
        }).catch(() => []) : [],
        p.submission?.findMany ? p.submission.findMany({ include: { reviews: true } }).catch(() => []) : [],
        p.claim?.findMany ? p.claim.findMany({ include: { evidence: true } }).catch(() => []) : [],
        p.blogPost?.findMany ? p.blogPost.findMany({
          include: {
            content: true,
            engagement: true,
            tags: true,
            author: { include: { profile: true } },
            startup: true,
          },
        }).catch(() => []) : [],
        p.investor?.findMany ? p.investor.findMany().catch(() => []) : [],
      ]);

      if (!dbStartups || dbStartups.length === 0) {
        logger.info('Database is empty. Serving empty state — seed the database to populate startup data.');
        return;
      }

      this.districts.clear();
      (dbDistricts || []).forEach((d: any) => {
        this.districts.set(d.id, {
          id: d.id,
          name: d.name,
          slug: d.slug,
          headquarters: d.headquarters,
          latitude: d.latitude,
          longitude: d.longitude,
          description: d.metadata?.description || `${d.name} district, Tamil Nadu`,
          keySectors: d.metadata?.keySectors || [],
          incubatorsCount: d.metadata?.incubatorsCount || 0,
          startupsCount: 0,
        });
      });

      this.sectors.clear();
      (dbSectors || []).forEach((s: any) => {
        this.sectors.set(s.id, {
          id: s.id,
          name: s.name,
          slug: s.slug,
          icon: s.icon,
          color: s.color,
          description: s.description,
          startupsCount: 0,
        });
      });

      this.investors.clear();
      (dbInvestors || []).forEach((inv: any) => {
        this.investors.set(inv.id, {
          id: inv.id,
          publicId: inv.publicId,
          name: inv.name,
          type: inv.type,
          website: inv.website || undefined,
          logoUrl: inv.logoUrl || undefined,
          description: inv.description || undefined,
          headquartersCity: inv.headquartersCity || undefined,
          createdAt: inv.createdAt.toISOString(),
          updatedAt: inv.updatedAt.toISOString(),
        });
      });

      this.users.clear();
      (dbUsers || []).forEach((u: any) => {
        this.users.set(u.id, {
          id: u.id,
          publicId: u.publicId,
          email: u.email,
          name: u.profile?.displayName || u.email.split('@')[0],
          role: u.role as any,
          passwordHash: u.passwordHash || '',
          avatarUrl: u.profile?.avatarUrl || undefined,
          bio: u.profile?.bio || undefined,
          companyName: u.profile?.companyName || undefined,
          phone: u.contact?.phone || undefined,
          isEmailVerified: u.isEmailVerified,
          isActive: u.isActive,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        });
      });

      this.startups.clear();
      (dbStartups || []).forEach((st: any) => {
        const detail = st.details;
        const loc = st.location;
        const fin = st.financials;
        const sectorsList = (st.sectors || []).map((s: any) => s.sector?.name || '');

        const foundersList = (st.founders || []).map((f: any) => ({
          id: f.id,
          publicId: f.publicId,
          name: f.name,
          role: f.roleTitle,
          roleTitle: f.roleTitle,
          bio: f.bio || undefined,
          email: f.email || undefined,
          avatarUrl: f.avatarUrl || undefined,
          education: f.education || undefined,
          previousCompanies: f.previousCompanies || undefined,
        }));

        const roundsList = (st.fundingRounds || []).map((r: any) => ({
          id: r.id,
          roundType: r.roundType,
          amountInr: r.amountInr || undefined,
          amountUsd: r.amountUsd || undefined,
          date: r.roundDate ? r.roundDate.toISOString() : new Date().toISOString(),
          roundDate: r.roundDate ? r.roundDate.toISOString() : new Date().toISOString(),
          investors: r.investors ? r.investors.map((i: any) => i.investor?.name || '') : [],
          sourceUrl: r.sourceUrl || undefined,
        }));

        this.startups.set(st.id, {
          id: st.id,
          publicId: st.publicId,
          slug: st.slug,
          name: st.name,
          tagline: st.tagline,
          description: detail?.description || '',
          extendedBio: detail?.extendedBio || undefined,
          logoUrl: detail?.logoUrl || undefined,
          bannerUrl: detail?.bannerUrl || undefined,
          brandColor: detail?.brandColor || undefined,
          website: st.website,
          foundedYear: st.foundedYear,
          stage: st.stage as any,
          fundingType: st.fundingType as any,
          totalFundingInr: fin?.totalFundingInr || undefined,
          totalFundingUsd: fin?.totalFundingUsd || undefined,
          teamSize: st.teamSize,
          district: loc?.district?.name || 'Chennai',
          districtId: loc?.districtId || undefined,
          districtSlug: loc?.district?.slug || 'chennai',
          city: loc?.city || 'Chennai',
          latitude: loc?.latitude || 13.0827,
          longitude: loc?.longitude || 80.2707,
          sectors: sectorsList,
          founders: foundersList,
          fundingRounds: roundsList,
          businessModel: detail?.businessModel || undefined,
          revenueModel: detail?.revenueModel || undefined,
          revenueRange: detail?.revenueRange || undefined,
          targetMarket: detail?.targetMarket || undefined,
          customerSegments: detail?.customerSegments || [],
          incubator: detail?.incubator || undefined,
          accelerator: detail?.accelerator || undefined,
          dpiitNumber: detail?.dpiitNumber || undefined,
          demoVideoUrl: detail?.demoVideoUrl || undefined,
          pitchDeckUrl: detail?.pitchDeckUrl || undefined,
          competitiveEdge: detail?.competitiveEdge || undefined,
          isProfitable: detail?.isProfitable ?? undefined,
          milestones: (st.milestones || []).map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description || undefined,
            date: m.date ? m.date.toISOString() : new Date().toISOString(),
            category: m.category || undefined,
          })),
          awards: (st.awards || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            organization: a.organization || undefined,
            year: a.year || undefined,
            url: a.url || undefined,
          })),
          keyClients: (st.clients || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            logoUrl: c.logoUrl || undefined,
            website: c.website || undefined,
          })),
          pressMentions: (st.pressMentions || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            publication: p.publication,
            url: p.url,
            publishedDate: p.publishedDate ? p.publishedDate.toISOString() : undefined,
          })),
          contactEmail: loc?.contactEmail || detail?.contactEmail || foundersList.find((f: any) => f.email)?.email || undefined,
          contactPhone: loc?.contactPhone || undefined,
          address: loc?.address || undefined,
          pincode: loc?.pincode || undefined,
          linkedin: loc?.linkedin || undefined,
          twitter: loc?.twitter || undefined,
          github: loc?.github || undefined,
          verificationStatus: st.verificationStatus as any,
          source: detail?.source || 'Platform Verification',
          sourceUrl: detail?.sourceUrl || undefined,
          lastVerifiedAt: detail?.lastVerifiedAt ? detail.lastVerifiedAt.toISOString() : st.updatedAt.toISOString(),
          trendingScore: st.trendingScore,
          claimedByUserId: st.claimedByUserId || undefined,
          isHiring: st.isHiring,
          isDeleted: Boolean(st.deletedAt),
          deletedAt: st.deletedAt ? st.deletedAt.toISOString() : null,
          deletedByUserId: st.deletedByUserId || null,
          createdAt: st.createdAt.toISOString(),
          updatedAt: st.updatedAt.toISOString(),
        });
      });

      // Cross-link user claimed startups from startup entity ownership
      this.startups.forEach((s) => {
        if (s.claimedByUserId) {
          const u = this.users.get(s.claimedByUserId) || Array.from(this.users.values()).find((usr) => usr.publicId === s.claimedByUserId);
          if (u) {
            u.claimedStartupId = u.claimedStartupId || s.id;
            u.claimedStartupIds = Array.from(new Set([...(u.claimedStartupIds || []), s.id]));
          }
        }
        if (s.contactEmail) {
          const normEmail = s.contactEmail.toLowerCase().trim();
          const u = Array.from(this.users.values()).find((usr) => usr.email.toLowerCase() === normEmail);
          if (u) {
            u.claimedStartupId = u.claimedStartupId || s.id;
            u.claimedStartupIds = Array.from(new Set([...(u.claimedStartupIds || []), s.id]));
          }
        }
      });

      this.blogs.clear();
      (dbBlogs || []).forEach((b: any) => {
        const catMap: Record<string, any> = {
          FOUNDER_STORIES: 'Founder Stories',
          ECOSYSTEM_NEWS: 'Ecosystem News',
          DEEPTECH_INSIGHTS: 'DeepTech Insights',
          POLICY_GRANTS: 'Policy & Grants',
          FUNDRAISING: 'Fundraising',
          TECH_ARCHITECTURE: 'Tech Architecture',
        };

        this.blogs.set(b.id, {
          id: b.id,
          publicId: b.publicId,
          slug: b.slug,
          title: b.title,
          subtitle: b.subtitle || undefined,
          content: b.content?.contentMarkdown || '',
          category: catMap[b.category] || 'Founder Stories',
          coverImageUrl: b.coverImageUrl || undefined,
          tags: b.tags ? b.tags.map((t: any) => t.tag) : [],
          authorId: b.authorId,
          authorPublicId: b.author?.publicId,
          authorName: b.author?.profile?.displayName || b.author?.email || 'Contributor',
          authorRole: b.author?.role || 'Contributor',
          authorEmail: b.author?.email || '',
          authorAvatarUrl: b.author?.profile?.avatarUrl || undefined,
          isFounder: b.author?.role === 'FOUNDER',
          startupId: b.startupId || undefined,
          startupName: b.startup?.name || undefined,
          startupSlug: b.startup?.slug || undefined,
          status: b.status as any,
          featured: b.isFeatured,
          clapsCount: b.engagement?.clapsCount || 0,
          viewsCount: b.engagement?.viewsCount || 0,
          sharesCount: b.engagement?.sharesCount || 0,
          readTimeMinutes: b.readTimeMinutes,
          publishedAt: b.publishedAt.toISOString(),
          isDeleted: Boolean(b.deletedAt),
          deletedAt: b.deletedAt ? b.deletedAt.toISOString() : null,
          deletedByUserId: b.deletedByUserId || null,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
        });
      });

      this.submissions.clear();
      (dbSubmissions || []).forEach((sub: any) => {
        this.submissions.set(sub.id, {
          id: sub.id,
          publicId: sub.publicId,
          data: sub.data as any,
          status: sub.status as any,
          submittedByEmail: sub.submittedByEmail,
          submittedByUserId: sub.submittedByUserId || undefined,
          createdAt: sub.createdAt.toISOString(),
          updatedAt: sub.updatedAt.toISOString(),
        });
      });

      this.claims.clear();
      (dbClaims || []).forEach((cl: any) => {
        this.claims.set(cl.id, {
          id: cl.id,
          publicId: cl.publicId,
          startupId: cl.startupId,
          startupSlug: '',
          startupName: '',
          claimantName: cl.claimantName,
          claimantEmail: cl.claimantEmail,
          claimantRole: cl.claimantRole,
          proofDetails: cl.evidence?.[0]?.description || '',
          status: cl.status as any,
          userId: cl.userAccountId || undefined,
          userAccountId: cl.userAccountId || undefined,
          createdAt: cl.createdAt.toISOString(),
          updatedAt: cl.updatedAt.toISOString(),
        });
      });

      this.recomputeCounts();
      logger.info(`Loaded ${this.startups.size} startups, ${this.blogs.size} stories, ${this.districts.size} districts, ${this.sectors.size} sectors, ${this.investors.size} investors from PostgreSQL 39-table database.`);
    } catch (err: any) {
      logger.error(`Error syncing from database: ${err.message}`);
      this.seedInMemory();
    }
  }

  public seedInMemory(): void {
    ALL_TN_DISTRICTS.forEach((d) => this.districts.set(d.id, { ...d, startupsCount: 0 }));
    INITIAL_SECTORS.forEach((s) => this.sectors.set(s.id, { ...s, startupsCount: 0 }));

    INITIAL_USERS.forEach((u) => {
      this.users.set(u.id, {
        ...u,
        publicId: (u as any).publicId || generatePublicId('usr'),
        name: u.name,
      });
    });

    INITIAL_STARTUPS.forEach((st) => {
      this.startups.set(st.id, {
        ...st,
        publicId: (st as any).publicId || generatePublicId('stp'),
        districtId: `dist-${st.districtSlug}`,
      });
    });

    INITIAL_BLOGS.forEach((b) => {
      this.blogs.set(b.id, {
        ...b,
        publicId: (b as any).publicId || generatePublicId('blg'),
      });
    });

    // Seed top ecosystem investors
    const initialInvestors: Investor[] = [
      {
        id: 'inv-tansim',
        publicId: generatePublicId('inv'),
        name: 'StartupTN / TANFUND (Govt. of Tamil Nadu)',
        type: 'GOVERNMENT',
        website: 'https://startuptn.in',
        description: 'Tamil Nadu government seed fund and venture debt initiative empowering regional deeptech & grassroots startups.',
        headquartersCity: 'Chennai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv-specialinvest',
        publicId: generatePublicId('inv'),
        name: 'Speciale Invest',
        type: 'VC',
        website: 'https://specialeinvest.com',
        description: 'Pioneering seed-stage DeepTech venture capital firm investing across SpaceTech, Quantum, AI, and Semiconductors.',
        headquartersCity: 'Chennai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inv-iitm-incubator',
        publicId: generatePublicId('inv'),
        name: 'IIT Madras Incubation Cell (IITMIC)',
        type: 'ACCELERATOR',
        website: 'https://incubation.iitm.ac.in',
        description: 'Indias premier deep technology business incubator nurturing hardware, aerospace, AI, and green mobility startups.',
        headquartersCity: 'Chennai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    initialInvestors.forEach((inv) => this.investors.set(inv.id, inv));

    // Seed test pending submissions with public IDs
    this.submissions.set('sub-test-01', {
      id: 'sub-test-01',
      publicId: generatePublicId('sub'),
      data: {
        name: 'Kongu Robotics & Precision AGV',
        tagline: 'Autonomous guided industrial robots for smart textile and auto warehouses',
        description: 'Kongu Robotics builds high-payload autonomous mobile robots and precision AGVs engineered for heavy industrial environments in Coimbatore and Tiruppur.',
        website: 'https://kongurobotics.in',
        founderName: 'Karthik Shanmugam',
        founderEmail: 'karthik@kongurobotics.in',
        district: 'Coimbatore',
        city: 'Coimbatore (Peelamedu Tech Hub)',
        sectors: ['Robotics', 'Manufacturing', 'DeepTech'],
        stage: 'Seed',
        fundingType: 'Venture funded',
        teamSize: '25-50',
        foundedYear: 2023,
      },
      status: 'PENDING_REVIEW' as any,
      submittedByEmail: 'karthik@kongurobotics.in',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.claims.set('clm-test-01', {
      id: 'clm-test-01',
      publicId: generatePublicId('clm'),
      startupId: 'stp-ather',
      startupSlug: 'ather-energy',
      startupName: 'Ather Energy',
      claimantName: 'Tarun Mehta',
      claimantEmail: 'tarun@atherenergy.com',
      claimantRole: 'Co-Founder & CEO',
      proofDetails: 'Official corporate domain email & IIT Madras incubation verification document reference.',
      status: 'PENDING_REVIEW' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.recomputeCounts();
  }

  public recomputeCounts(): void {
    for (const district of this.districts.values()) {
      district.startupsCount = 0;
    }
    for (const sector of this.sectors.values()) {
      sector.startupsCount = 0;
    }

    for (const startup of this.startups.values()) {
      if (startup.verificationStatus !== 'REJECTED' && !startup.isDeleted) {
        const dist = Array.from(this.districts.values()).find(
          (d) => d.slug === startup.districtSlug || d.name.toLowerCase() === startup.district.toLowerCase()
        );
        if (dist) {
          dist.startupsCount = (dist.startupsCount || 0) + 1;
        }

        startup.sectors.forEach((secName) => {
          const sec = Array.from(this.sectors.values()).find(
            (s) => s.name.toLowerCase() === secName.toLowerCase()
          );
          if (sec) {
            sec.startupsCount = (sec.startupsCount || 0) + 1;
          }
        });
      }
    }
  }

  public calculateHaversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }
}

export const db = SpatialDatabase.getInstance();
