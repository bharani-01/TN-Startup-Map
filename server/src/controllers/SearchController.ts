import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/SearchService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string || '';
      const results = await searchService.search(q);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(results));
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
