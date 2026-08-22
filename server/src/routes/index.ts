import { Router } from 'express';
import authRoutes from './auth.routes.js';
import startupRoutes from './startup.routes.js';
import districtRoutes from './district.routes.js';
import sectorRoutes from './sector.routes.js';
import searchRoutes from './search.routes.js';
import submissionRoutes from './submission.routes.js';
import claimRoutes from './claim.routes.js';
import statsRoutes from './stats.routes.js';
import adminRoutes from './admin.routes.js';
import blogRoutes from './blog.routes.js';
import founderRoutes from './founder.routes.js';
import jobRoutes from './job.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/startups', startupRoutes);
router.use('/founder', founderRoutes);
router.use('/districts', districtRoutes);
router.use('/sectors', sectorRoutes);
router.use('/search', searchRoutes);
router.use('/submissions', submissionRoutes);
router.use('/claims', claimRoutes);
router.use('/stats', statsRoutes);
router.use('/admin', adminRoutes);
router.use('/blogs', blogRoutes);
router.use('/jobs', jobRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TN Startup Map Enterprise API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
