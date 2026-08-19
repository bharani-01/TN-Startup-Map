import { Request, Response, NextFunction } from 'express';
import { districtService } from '../services/DistrictService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class DistrictController {
  async getAllDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const districts = await districtService.getAllDistricts();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(districts));
    } catch (error) {
      next(error);
    }
  }

  async getDistrictBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await districtService.getDistrictBySlug(String(req.params.slug));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getDistrictsGeoJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const geojson = await districtService.getDistrictsGeoJSON();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(geojson));
    } catch (error) {
      next(error);
    }
  }
}

export const districtController = new DistrictController();
