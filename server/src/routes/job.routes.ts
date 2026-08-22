import { Router } from 'express';
import { jobController } from '../controllers/JobController.js';

const router = Router();

// Public routes — only OPEN + not hidden + not expired jobs are served
router.get('/', jobController.browseJobs.bind(jobController));
router.get('/startup/:slug', jobController.getJobsForStartup.bind(jobController));
router.get('/:id', jobController.getJobById.bind(jobController));

export default router;
