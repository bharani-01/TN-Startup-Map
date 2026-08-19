import { Router } from 'express';
import { statsController } from '../controllers/StatsController.js';

const router = Router();

router.get('/', statsController.getStats.bind(statsController));

export default router;
