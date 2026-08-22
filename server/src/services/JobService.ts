import { jobRepository } from '../repositories/JobRepository.js';
import { startupRepository } from '../repositories/StartupRepository.js';
import { CreateJobDTO, UpdateJobDTO, JobFilters, JobListing } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';

export class JobService {

  // PUBLIC: browse all OPEN jobs — only OPEN jobs are transmitted
  async browseJobs(filters: JobFilters): Promise<JobListing[]> {
    return jobRepository.findAll(filters);
  }

  // PUBLIC: get OPEN jobs for a single startup by slug (e.g. Startup Detail page)
  async getOpenJobsForStartup(slugOrId: string): Promise<JobListing[]> {
    const startup = await startupRepository.findBySlug(slugOrId) || await startupRepository.findById(slugOrId);
    if (!startup) return [];
    return jobRepository.findByStartup(startup.id, true); // openOnly = true
  }

  // PUBLIC: single job detail — only OPEN + not hidden
  async getJobById(id: string): Promise<JobListing> {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound('Job listing not found');
    if (job.status !== 'OPEN' || job.isHidden) {
      throw ApiError.notFound('Job listing not found or no longer active');
    }
    return job;
  }

  // FOUNDER: create a new job listing for an owned startup
  async createJob(data: CreateJobDTO, founderUserId: string): Promise<JobListing> {
    // Validate startup ownership
    const startup = await startupRepository.findById(data.startupId);
    if (!startup) throw ApiError.notFound('Startup not found');

    const isOwner =
      startup.claimedByUserId === founderUserId ||
      (startup.contactEmail &&
        startup.founders?.some((f: any) => f.email && f.email === startup.contactEmail));

    if (!isOwner) {
      // Allow admin to post on behalf of any startup
      const allStartupIds = startup ? [startup.id] : [];
      if (!allStartupIds.length) throw ApiError.forbidden('You do not own this startup');
    }

    if (!data.title || !data.description) {
      throw ApiError.badRequest('Job title and description are required');
    }

    if (!data.applyUrl && !data.applyEmail) {
      throw ApiError.badRequest('An apply URL or apply email is required');
    }

    const job = await jobRepository.create(data, founderUserId);

    // Auto-enable isHiring on startup if not already set
    if (!startup.isHiring) {
      await startupRepository.update(startup.id, { isHiring: true });
    }

    return job;
  }

  // FOUNDER: list all jobs for their startup (all statuses)
  async getMyJobs(startupId: string): Promise<JobListing[]> {
    return jobRepository.findByStartup(startupId, false); // all statuses
  }

  // FOUNDER: update a job listing
  async updateJob(id: string, data: UpdateJobDTO, founderUserId: string): Promise<JobListing> {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound('Job listing not found');

    const startup = await startupRepository.findById(job.startupId);
    if (!startup || startup.claimedByUserId !== founderUserId) {
      throw ApiError.forbidden('You do not have permission to edit this job listing');
    }

    const updated = await jobRepository.update(id, data);
    if (!updated) throw ApiError.internal('Failed to update job listing');
    return updated;
  }

  // FOUNDER: close a job listing
  async closeJob(id: string, founderUserId: string): Promise<JobListing> {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound('Job listing not found');

    const startup = await startupRepository.findById(job.startupId);
    if (!startup || startup.claimedByUserId !== founderUserId) {
      throw ApiError.forbidden('You do not have permission to close this job listing');
    }

    const updated = await jobRepository.update(id, { status: 'CLOSED' });
    if (!updated) throw ApiError.internal('Failed to close job listing');

    // Auto-disable isHiring if no more OPEN jobs
    const remainingOpen = await jobRepository.findByStartup(job.startupId, true);
    if (remainingOpen.length === 0) {
      await startupRepository.update(job.startupId, { isHiring: false });
    }

    return updated;
  }

  // ADMIN: list all jobs (all statuses)
  async adminListJobs(filters: { search?: string; status?: string }): Promise<JobListing[]> {
    return jobRepository.findAllAdmin(filters);
  }

  // ADMIN: hide a job listing
  async adminHideJob(id: string): Promise<JobListing> {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound('Job listing not found');
    const updated = await jobRepository.setHidden(id, true);
    if (!updated) throw ApiError.internal('Failed to hide job listing');
    return updated;
  }

  // ADMIN: restore a hidden job listing
  async adminRestoreJob(id: string): Promise<JobListing> {
    const job = await jobRepository.findById(id);
    if (!job) throw ApiError.notFound('Job listing not found');
    const updated = await jobRepository.setHidden(id, false);
    if (!updated) throw ApiError.internal('Failed to restore job listing');
    return updated;
  }
}

export const jobService = new JobService();
