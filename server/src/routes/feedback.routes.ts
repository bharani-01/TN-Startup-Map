import { Router } from 'express';
import { feedbackController } from '../controllers/FeedbackController.js';

const router = Router();

// POST /api/feedback — Public intake
router.post('/', feedbackController.submitFeedback.bind(feedbackController));

export default router;
