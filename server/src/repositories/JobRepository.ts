import { prisma } from '../database/connection.js';
import { generatePublicId } from '../utils/publicId.js';
import { JobListing, jobsCache, CreateJobDTO, UpdateJobDTO, JobFilters } from '../models/Job.js';

export class JobRepository {

  private mapDbJob(dbJob: any): JobListing {
    return {
      id: dbJob.id,
      publicId: dbJob.publicId,
      startupId: dbJob.startupId,
      startupSlug: dbJob.startup?.slug,
      startupName: dbJob.startup?.name,
      startupLogoUrl: dbJob.startup?.details?.logoUrl,
      startupSectors: dbJob.startup?.sectors?.map((s: any) => s.sector?.name).filter(Boolean) || [],
      postedById: dbJob.postedById || undefined,
      title: dbJob.title,
      department: dbJob.department || undefined,
      jobType: dbJob.jobType as JobListing['jobType'],
      experience: dbJob.experience as JobListing['experience'],
      location: dbJob.location || undefined,
      isRemote: dbJob.isRemote,
      salaryMin: dbJob.salaryMin || undefined,
      salaryMax: dbJob.salaryMax || undefined,
      description: dbJob.description,
      skills: dbJob.skills || [],
      applyUrl: dbJob.applyUrl || undefined,
      applyEmail: dbJob.applyEmail || undefined,
      status: dbJob.status as JobListing['status'],
      isHidden: dbJob.isHidden,
      expiresAt: dbJob.expiresAt ? new Date(dbJob.expiresAt).toISOString() : undefined,
      createdAt: new Date(dbJob.createdAt).toISOString(),
      updatedAt: new Date(dbJob.updatedAt).toISOString(),
    };
  }

  async create(data: CreateJobDTO, postedById?: string): Promise<JobListing> {
    const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const publicId = generatePublicId('job');

    const dbJob = await (prisma as any).jobListing.create({
      data: {
        id,
        publicId,
        startupId: data.startupId,
        postedById: postedById || undefined,
        title: data.title,
        department: data.department,
        jobType: data.jobType || 'FULL_TIME',
        experience: data.experience || 'JUNIOR',
        location: data.location,
        isRemote: data.isRemote || false,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        description: data.description,
        skills: data.skills || [],
        applyUrl: data.applyUrl,
        applyEmail: data.applyEmail,
        status: 'OPEN',
        isHidden: false,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
    });

    const job = this.mapDbJob(dbJob);
    jobsCache.set(job.id, job);
    return job;
  }

  // PUBLIC: only OPEN + not hidden + not expired
  async findAll(filters: JobFilters = {}): Promise<JobListing[]> {
    const now = new Date();
    const where: any = {
      status: 'OPEN',
      isHidden: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    };

    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.experience) where.experience = filters.experience;
    if (filters.isRemote === true) where.isRemote = true;
    if (filters.search) {
      where.AND = [
        {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { department: { contains: filters.search, mode: 'insensitive' } },
            { startup: { name: { contains: filters.search, mode: 'insensitive' } } },
          ],
        },
      ];
    }
    if (filters.startupSlug) {
      where.startup = { slug: filters.startupSlug };
    }

    const dbJobs = await (prisma as any).jobListing.findMany({
      where,
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    const jobs = dbJobs.map(this.mapDbJob.bind(this));
    jobs.forEach((j: JobListing) => jobsCache.set(j.id, j));
    return jobs;
  }

  // FOUNDER: all statuses for their startup
  async findByStartup(startupId: string, openOnly = false): Promise<JobListing[]> {
    const where: any = { startupId };
    if (openOnly) {
      const now = new Date();
      where.status = 'OPEN';
      where.isHidden = false;
      where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }];
    }

    const dbJobs = await (prisma as any).jobListing.findMany({
      where,
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return dbJobs.map(this.mapDbJob.bind(this));
  }

  // ADMIN: all statuses, all startups
  async findAllAdmin(filters: { search?: string; status?: string } = {}): Promise<JobListing[]> {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { startup: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const dbJobs = await (prisma as any).jobListing.findMany({
      where,
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return dbJobs.map(this.mapDbJob.bind(this));
  }

  async findById(id: string): Promise<JobListing | null> {
    // Check cache first
    const cached = jobsCache.get(id);
    if (cached) return cached;

    const dbJob = await (prisma as any).jobListing.findFirst({
      where: { OR: [{ id }, { publicId: id }] },
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
    });

    if (!dbJob) return null;
    const job = this.mapDbJob(dbJob);
    jobsCache.set(job.id, job);
    return job;
  }

  async update(id: string, data: UpdateJobDTO): Promise<JobListing | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.jobType !== undefined) updateData.jobType = data.jobType;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.isRemote !== undefined) updateData.isRemote = data.isRemote;
    if (data.salaryMin !== undefined) updateData.salaryMin = data.salaryMin;
    if (data.salaryMax !== undefined) updateData.salaryMax = data.salaryMax;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.applyUrl !== undefined) updateData.applyUrl = data.applyUrl;
    if (data.applyEmail !== undefined) updateData.applyEmail = data.applyEmail;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    if (data.status !== undefined) updateData.status = data.status;

    const dbJob = await (prisma as any).jobListing.update({
      where: { id },
      data: updateData,
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
    });

    const job = this.mapDbJob(dbJob);
    jobsCache.set(job.id, job);
    return job;
  }

  async setHidden(id: string, isHidden: boolean): Promise<JobListing | null> {
    const dbJob = await (prisma as any).jobListing.update({
      where: { id },
      data: { isHidden },
      include: {
        startup: {
          include: {
            details: { select: { logoUrl: true } },
            sectors: { include: { sector: { select: { name: true } } } },
          },
        },
      },
    });

    const job = this.mapDbJob(dbJob);
    jobsCache.set(job.id, job);
    return job;
  }
}

export const jobRepository = new JobRepository();
