import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController.js';

const router = Router();

// Public telemetry tracking endpoint
router.post('/track', (req, res, next) => analyticsController.trackEvent(req, res, next));

export default router;
