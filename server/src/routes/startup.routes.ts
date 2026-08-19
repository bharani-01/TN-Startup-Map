import { Router } from 'express';
import { startupController } from '../controllers/StartupController.js';
import { requireAuth } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../utils/constants.js';

const router = Router();

router.get('/', startupController.getStartups.bind(startupController));
router.get('/recent', startupController.getRecent.bind(startupController));
router.get('/funded', startupController.getRecentlyFunded.bind(startupController));
router.get('/trending', startupController.getTrending.bind(startupController));
router.get('/nearby', startupController.getNearby.bind(startupController));
router.get('/map-geojson', startupController.getMapGeoJSON.bind(startupController));
router.get('/:slug', startupController.getStartupBySlug.bind(startupController));

// Protected startup mutations (admin or founder)
router.post('/', requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), startupController.createStartup.bind(startupController));
router.put('/:id', requireAuth, startupController.updateStartup.bind(startupController));
router.post('/:id/transfer', requireAuth, startupController.transferOwnership.bind(startupController));
router.post('/:id/restore', requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), startupController.restoreStartup.bind(startupController));
router.delete('/:id', requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), startupController.deleteStartup.bind(startupController));

export default router;
