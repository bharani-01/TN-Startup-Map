import { Router } from 'express';
import { founderController } from '../controllers/FounderController.js';
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

export default router;
