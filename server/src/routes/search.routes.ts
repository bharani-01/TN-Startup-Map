import { Router } from 'express';
import { searchController } from '../controllers/SearchController.js';

const router = Router();

router.get('/', searchController.search.bind(searchController));

export default router;
