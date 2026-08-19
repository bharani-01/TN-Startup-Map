import { Router } from 'express';
import { claimController } from '../controllers/ClaimController.js';

const router = Router();

router.post('/', claimController.submitClaim.bind(claimController));

export default router;
