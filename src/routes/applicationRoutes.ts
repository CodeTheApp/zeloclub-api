import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { USER_TYPES } from '../types';

const router = Router();

router.post(
  '/apply',
  authenticate,
  authorize([USER_TYPES.PROFESSIONAL]),
  ApplicationController.applyForService
);

router.get(
  '/service/:serviceId/applications',
  authenticate,
  ApplicationController.getApplicationsForService
);

export default router;
