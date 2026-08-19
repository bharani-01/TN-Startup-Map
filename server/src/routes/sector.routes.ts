import { Router } from 'express';
import { sectorController } from '../controllers/SectorController.js';

const router = Router();

router.get('/', sectorController.getAllSectors.bind(sectorController));

export default router;
