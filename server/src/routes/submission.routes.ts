import { Router } from 'express';
import { submissionController } from '../controllers/SubmissionController.js';

const router = Router();

router.post('/', submissionController.submitStartup.bind(submissionController));

export default router;
