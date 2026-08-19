import { Router } from 'express';
import { blogController } from '../controllers/BlogController.js';
import { requireAuth } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../utils/constants.js';

const router = Router();

// Public Read & Engagement Endpoints
router.get('/', blogController.getBlogs.bind(blogController));
router.get('/featured', blogController.getFeatured.bind(blogController));
router.get('/:slug', blogController.getBlogBySlug.bind(blogController));
router.post('/:id/clap', blogController.incrementClap.bind(blogController));

// Protected Authoring: Restricted to Verified Founders & Admins
router.post(
  '/',
  requireAuth,
  authorize(UserRole.FOUNDER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  blogController.createBlog.bind(blogController)
);

// Protected Mutation & Moderation
router.put('/:id', requireAuth, blogController.updateBlog.bind(blogController));
router.delete('/:id', requireAuth, blogController.deleteBlog.bind(blogController));

// Admin Moderation & Restores
router.post('/:id/restore', requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), blogController.restoreBlog.bind(blogController));
router.patch('/:id/feature', requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), blogController.toggleFeature.bind(blogController));

export default router;
