import { Router } from 'express';
import { districtController } from '../controllers/DistrictController.js';

const router = Router();

router.get('/', districtController.getAllDistricts.bind(districtController));
router.get('/boundaries-geojson', districtController.getDistrictsGeoJSON.bind(districtController));
router.get('/:slug', districtController.getDistrictBySlug.bind(districtController));

export default router;
