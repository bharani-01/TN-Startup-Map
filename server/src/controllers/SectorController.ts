import { Request, Response, NextFunction } from 'express';
import { sectorService } from '../services/SectorService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class SectorController {
  async getAllSectors(req: Request, res: Response, next: NextFunction) {
    try {
      const sectors = await sectorService.getAllSectors();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(sectors));
    } catch (error) {
      next(error);
    }
  }
}

export const sectorController = new SectorController();
