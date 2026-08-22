import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController.js';
import { errorLogController } from '../controllers/ErrorLogController.js';

const router = Router();

// Public telemetry tracking endpoint
router.post('/track', (req, res, next) => analyticsController.trackEvent(req, res, next));

// Public client crash telemetry endpoint
router.post('/error', (req, res, next) => errorLogController.captureClientError(req, res, next));

export default router;
