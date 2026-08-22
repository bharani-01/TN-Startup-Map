import { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/JobService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class JobController {

  // GET /api/jobs — public, OPEN only
  async browseJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.browseJobs({
        search: req.query.search as string,
        jobType: req.query.jobType as string,
        experience: req.query.experience as string,
        isRemote: req.query.isRemote === 'true',
        startupSlug: req.query.startupSlug as string,
        sector: req.query.sector as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(jobs));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/jobs/:id — public, OPEN only
  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const job = await jobService.getJobById(id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(job));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/jobs/startup/:slug — public, OPEN only
  async getJobsForStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const jobs = await jobService.getOpenJobsForStartup(slug);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(jobs));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/founder/jobs — FOUNDER only
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await jobService.createJob(req.body, req.user!.id);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(job, 'Job listing published successfully'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/founder/jobs/:startupId — FOUNDER only
  async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const startupId = Array.isArray(req.params.startupId) ? req.params.startupId[0] : req.params.startupId;
      const jobs = await jobService.getMyJobs(startupId);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(jobs));
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/founder/jobs/:id — FOUNDER only
  async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const job = await jobService.updateJob(id, req.body, req.user!.id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(job, 'Job listing updated'));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/founder/jobs/:id/close — FOUNDER only
  async closeJob(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const job = await jobService.closeJob(id, req.user!.id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(job, 'Job listing closed'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/jobs — ADMIN only
  async adminListJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.adminListJobs({
        search: req.query.search as string,
        status: req.query.status as string,
      });
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(jobs));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/admin/jobs/:id/hide — ADMIN only
  async adminHideJob(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const job = await jobService.adminHideJob(id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(job, 'Job listing hidden'));
    } catch (error) {
      next(error);
    }
  }

  // POST /api/admin/jobs/:id/restore — ADMIN only
  async adminRestoreJob(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const job = await jobService.adminRestoreJob(id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(job, 'Job listing restored'));
    } catch (error) {
      next(error);
    }
  }
}

export const jobController = new JobController();
