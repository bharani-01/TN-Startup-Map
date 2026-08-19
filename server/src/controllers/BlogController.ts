import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/BlogService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class BlogController {
  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        tag: req.query.tag as string,
        authorId: req.query.authorId as string,
        startupId: req.query.startupId as string,
        status: req.query.status as string,
        featured: req.query.featured ? req.query.featured === 'true' : undefined,
        includeDeleted: req.query.includeDeleted === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
      };

      const result = await blogService.getBlogs(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result.blogs, undefined, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }));
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 3;
      const blogs = await blogService.getFeaturedBlogs(limit);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(blogs));
    } catch (error) {
      next(error);
    }
  }

  async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.getBlogBySlug(String(req.params.slug));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(blog));
    } catch (error) {
      next(error);
    }
  }

  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.createBlog(req.body, req.user as any);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(blog, 'Article published successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.updateBlog(
        String(req.params.id),
        req.body,
        req.user?.id || '',
        req.user?.role as any
      );
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(blog, 'Article updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      await blogService.deleteBlog(
        String(req.params.id),
        req.user?.id || '',
        req.user?.role as any
      );
      res.status(HTTP_STATUS.OK).json(ApiResponse.success({ id: req.params.id }, 'Article soft-deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async restoreBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.restoreBlog(String(req.params.id));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(blog, 'Article restored successfully'));
    } catch (error) {
      next(error);
    }
  }

  async toggleFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.toggleFeature(String(req.params.id));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(blog, 'Article feature status updated'));
    } catch (error) {
      next(error);
    }
  }

  async incrementClap(req: Request, res: Response, next: NextFunction) {
    try {
      const claps = await blogService.incrementClap(String(req.params.id));
      res.status(HTTP_STATUS.OK).json(ApiResponse.success({ clapsCount: claps }, 'Clap recorded'));
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
