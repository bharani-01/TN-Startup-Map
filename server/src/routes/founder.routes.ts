import { Router } from 'express';
import { founderController } from '../controllers/FounderController.js';
import { jobController } from '../controllers/JobController.js';
import { analyticsController } from '../controllers/AnalyticsController.js';
import { requireAuth } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { requireStartupOwner } from '../middleware/checkStartupOwnership.js';
import { UserRole } from '../utils/constants.js';

const router = Router();

// All founder routes require authentication and role FOUNDER or ADMIN
router.use(requireAuth, authorize(UserRole.FOUNDER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

// 1. Get all startups owned / claimed by current authenticated founder
router.get('/my-startups', founderController.getMyStartups.bind(founderController));

// 2. Get specific startup owned by founder (ownership verified by middleware)
router.get('/startup/:id', requireStartupOwner, founderController.getMyStartupDetail.bind(founderController));

// 3. Update specific startup owned by founder (ownership verified by middleware)
router.put('/startup/:id', requireStartupOwner, founderController.updateMyStartup.bind(founderController));

// 4. Job listings management (founder manages own startup's jobs)
router.post('/jobs', jobController.createJob.bind(jobController));
router.get('/jobs/:startupId', jobController.getMyJobs.bind(jobController));
router.put('/jobs/:id', jobController.updateJob.bind(jobController));
router.post('/jobs/:id/close', jobController.closeJob.bind(jobController));

export default router;
