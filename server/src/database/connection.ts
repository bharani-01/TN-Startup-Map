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

export const prisma = new PrismaClient();

class SpatialDatabase {
  private static instance: SpatialDatabase;
  private isConnected: boolean = false;
  private usePrisma: boolean = true;

  // In-memory runtime mirror for high-speed spatial querying
  public startups: Map<string, Startup> = new Map();
  public districts: Map<string, District> = new Map();
  public sectors: Map<string, Sector> = new Map();
  public users: Map<string, User> = new Map();
  public submissions: Map<string, Submission> = new Map();
  public claims: Map<string, Claim> = new Map();
  public blogs: Map<string, BlogPost> = new Map();

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
      logger.info('🐘 Connected to PostgreSQL Database via Prisma ORM');
      await this.syncFromDatabase();
    } catch (err: any) {
      this.usePrisma = false;
      logger.warn(`PostgreSQL direct connection fallback: ${err.message}. Initializing in-memory spatial cache.`);
      this.seedInMemory();
    }
  }

  private async syncFromDatabase(): Promise<void> {
    try {
      const [dbDistricts, dbSectors, dbUsers, dbStartups, dbSubmissions, dbClaims] = await Promise.all([
        prisma.district.findMany(),
        prisma.sector.findMany(),
        prisma.user.findMany(),
        prisma.startup.findMany(),
        prisma.submission.findMany(),
        prisma.claim.findMany(),
      ]);

      if (dbStartups.length === 0) {
        logger.info('Database empty. Seeding initial data via Prisma...');
        this.seedInMemory();
        return;
      }

      this.districts.clear();
      dbDistricts.forEach((d: any) => {
        this.districts.set(d.id, {
          id: d.id,
          name: d.name,
          slug: d.slug,
          headquarters: d.headquarters,
          latitude: d.latitude,
          longitude: d.longitude,
          description: d.description,
          keySectors: d.keySectors,
          incubatorsCount: d.incubatorsCount,
          startupsCount: 0,
        });
      });

      this.sectors.clear();
      dbSectors.forEach((s: any) => {
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

      this.users.clear();
      dbUsers.forEach((u: any) => {
        this.users.set(u.id, {
          id: u.id,
          displayId: u.displayId || 'TN-USR-1000',
          email: u.email,
          name: u.name,
          role: u.role as any,
          passwordHash: u.passwordHash || '',
          avatarUrl: u.avatarUrl || undefined,
          companyName: u.companyName || undefined,
          claimedStartupId: u.claimedStartupId || undefined,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        });
      });

      this.startups.clear();
      dbStartups.forEach((st: any) => {
        const initialMatch = INITIAL_STARTUPS.find((i) => i.slug === st.slug || i.id === st.id);
        this.startups.set(st.id, {
          id: st.id,
          slug: st.slug,
          name: st.name,
          tagline: st.tagline,
          description: st.description,
          logoUrl: st.logoUrl || initialMatch?.logoUrl || undefined,
          brandColor: st.brandColor || undefined,
          website: st.website,
          linkedin: st.linkedin || undefined,
          twitter: st.twitter || undefined,
          github: st.github || undefined,
          foundedYear: st.foundedYear,
          stage: st.stage as any,
          fundingType: st.fundingType as any,
          totalFundingInr: st.totalFundingInr || undefined,
          totalFundingUsd: st.totalFundingUsd || undefined,
          teamSize: st.teamSize,
          district: st.districtName,
          districtSlug: st.districtSlug,
          city: st.city,
          latitude: st.latitude,
          longitude: st.longitude,
          sectors: st.sectors,
          founders: (st.founders as any) || [],
          fundingRounds: (st.fundingRounds as any) || [],
          verificationStatus: st.verificationStatus as any,
          source: st.source,
          sourceUrl: st.sourceUrl || undefined,
          lastVerifiedAt: st.lastVerifiedAt.toISOString(),
          trendingScore: st.trendingScore,
          claimedByUserId: st.claimedByUserId || undefined,
          isHiring: st.isHiring,
          createdAt: st.createdAt.toISOString(),
          updatedAt: st.updatedAt.toISOString(),
        });
      });

      this.submissions.clear();
      dbSubmissions.forEach((sub: any) => {
        this.submissions.set(sub.id, {
          id: sub.id,
          data: sub.data as any,
          status: sub.status as any,
          submittedByEmail: sub.submittedByEmail,
          submittedByUserId: sub.submittedByUserId || undefined,
          reviewedByUserId: sub.reviewedByUserId || undefined,
          adminNotes: sub.adminNotes || undefined,
          createdAt: sub.createdAt.toISOString(),
          updatedAt: sub.updatedAt.toISOString(),
        });
      });

      this.claims.clear();
      dbClaims.forEach((cl: any) => {
        this.claims.set(cl.id, {
          id: cl.id,
          startupId: cl.startupId,
          startupSlug: cl.startupSlug,
          startupName: cl.startupName,
          claimantName: cl.claimantName,
          claimantEmail: cl.claimantEmail,
          claimantRole: cl.claimantRole,
          claimantLinkedin: cl.claimantLinkedin || undefined,
          proofDetails: cl.proofDetails,
          status: cl.status as any,
          userId: cl.userId || undefined,
          reviewedByUserId: cl.reviewedByUserId || undefined,
          adminNotes: cl.adminNotes || undefined,
          createdAt: cl.createdAt.toISOString(),
          updatedAt: cl.updatedAt.toISOString(),
        });
      });

      // Always populate blogs
      this.blogs.clear();
      INITIAL_BLOGS.forEach((b) => this.blogs.set(b.id, { ...b }));

      // If submissions queue is empty, populate test submissions
      if (this.submissions.size === 0) {
        this.submissions.set('sub-test-01', {
          id: 'sub-test-01',
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

        this.submissions.set('sub-test-02', {
          id: 'sub-test-02',
          data: {
            name: 'Pandya AI Agritech',
            tagline: 'Hyper-local precision soil intelligence and drip-fertigation IoT for delta farmers',
            description: 'Pandya AI deploys low-cost optical spectroscopy soil sensors and automated micro-valves to reduce water usage by 40% across Madurai and Thanjavur paddy basins.',
            website: 'https://pandyaagri.ai',
            founderName: 'Meenakshi Sundaram',
            founderEmail: 'meenakshi@pandyaagri.ai',
            district: 'Madurai',
            city: 'Madurai (Kappalur Industrial Estate)',
            sectors: ['Agritech', 'AI', 'IoT'],
            stage: 'Pre-seed',
            fundingType: 'Angel',
            teamSize: '10-20',
            foundedYear: 2024,
          },
          status: 'PENDING_REVIEW' as any,
          submittedByEmail: 'meenakshi@pandyaagri.ai',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      this.recomputeCounts();
      logger.info(`✅ Loaded ${this.startups.size} startups, ${this.blogs.size} stories, ${this.districts.size} districts, ${this.sectors.size} sectors from PostgreSQL cache`);
    } catch (err: any) {
      logger.error(`Error syncing from database: ${err.message}`);
      this.seedInMemory();
    }
  }

  private seedInMemory(): void {
    ALL_TN_DISTRICTS.forEach((d) => this.districts.set(d.id, { ...d, startupsCount: 0 }));
    INITIAL_SECTORS.forEach((s) => this.sectors.set(s.id, { ...s, startupsCount: 0 }));
    INITIAL_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    INITIAL_STARTUPS.forEach((st) => this.startups.set(st.id, { ...st }));
    INITIAL_BLOGS.forEach((b) => this.blogs.set(b.id, { ...b }));

    // Seed test pending submissions for Admin review testing
    this.submissions.set('sub-test-01', {
      id: 'sub-test-01',
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

    this.submissions.set('sub-test-02', {
      id: 'sub-test-02',
      data: {
        name: 'Pandya AI Agritech',
        tagline: 'Hyper-local precision soil intelligence and drip-fertigation IoT for delta farmers',
        description: 'Pandya AI deploys low-cost optical spectroscopy soil sensors and automated micro-valves to reduce water usage by 40% across Madurai and Thanjavur paddy basins.',
        website: 'https://pandyaagri.ai',
        founderName: 'Meenakshi Sundaram',
        founderEmail: 'meenakshi@pandyaagri.ai',
        district: 'Madurai',
        city: 'Madurai (Kappalur Industrial Estate)',
        sectors: ['Agritech', 'AI', 'IoT'],
        stage: 'Pre-seed',
        fundingType: 'Angel',
        teamSize: '10-20',
        foundedYear: 2024,
      },
      status: 'PENDING_REVIEW' as any,
      submittedByEmail: 'meenakshi@pandyaagri.ai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed test pending founder claim for Admin verification testing
    this.claims.set('clm-test-01', {
      id: 'clm-test-01',
      startupId: 'stp-ather',
      startupSlug: 'ather-energy',
      startupName: 'Ather Energy',
      claimantName: 'Tarun Mehta',
      claimantEmail: 'tarun@atherenergy.com',
      claimantRole: 'Co-Founder & CEO',
      claimantLinkedin: 'https://linkedin.com/in/tarunmehta',
      proofDetails: 'Official corporate domain email & IIT Madras incubation verification document reference.',
      status: 'PENDING' as any,
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
      if (startup.verificationStatus !== 'REJECTED') {
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
