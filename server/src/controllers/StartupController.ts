import { Request, Response, NextFunction } from 'express';
import { startupService } from '../services/StartupService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class StartupController {
  async getStartups(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        district: req.query.district as string,
        sector: req.query.sector as string,
        stage: req.query.stage as string,
        foundedYear: req.query.foundedYear ? Number(req.query.foundedYear) : undefined,
        fundingType: req.query.fundingType as string,
        verificationStatus: req.query.verificationStatus as string,
        isHiring: req.query.isHiring ? req.query.isHiring === 'true' : undefined,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
      };

      const result = await startupService.getStartups(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result.startups, undefined, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }));
    } catch (error) {
      next(error);
    }
  }

  async getStartupBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const startup = await startupService.getStartupBySlug(String(req.params.slug));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startup));
    } catch (error) {
      next(error);
    }
  }

  async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const startups = await startupService.getRecentStartups(limit);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startups));
    } catch (error) {
      next(error);
    }
  }

  async getRecentlyFunded(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const startups = await startupService.getRecentlyFundedStartups(limit);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startups));
    } catch (error) {
      next(error);
    }
  }

  async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const startups = await startupService.getTrendingStartups(limit);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startups));
    } catch (error) {
      next(error);
    }
  }

  async getNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radiusKm = req.query.radius ? parseFloat(req.query.radius as string) : 50;

      const startups = await startupService.getNearbyStartups(lat, lng, radiusKm);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startups, undefined, { radiusKm, count: startups.length }));
    } catch (error) {
      next(error);
    }
  }

  async getMapGeoJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const geojson = await startupService.getMapGeoJSON();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(geojson));
    } catch (error) {
      next(error);
    }
  }

  async createStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const startup = await startupService.createStartup(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(startup, 'Startup created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const startup = await startupService.updateStartup(String(req.params.id), req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startup, 'Startup updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedByUserId = req.user?.id || 'admin';
      await startupService.deleteStartup(String(req.params.id), deletedByUserId);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success({ id: req.params.id }, 'Startup soft-deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async restoreStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const restored = await startupService.restoreStartup(String(req.params.id));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(restored, 'Startup restored successfully'));
    } catch (error) {
      next(error);
    }
  }

  async transferOwnership(req: Request, res: Response, next: NextFunction) {
    try {
      const fromUserId = req.user?.id || '';
      const { targetEmail } = req.body;
      if (!targetEmail) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ApiResponse.error('Target email is required for company transfer'));
      }
      const result = await startupService.transferOwnership(String(req.params.id), fromUserId, targetEmail);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Company ownership transferred successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const startupController = new StartupController();
