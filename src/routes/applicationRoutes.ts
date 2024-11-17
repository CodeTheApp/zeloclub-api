import { Router } from 'express';
import { USER_TYPES } from '../../types';
import { ApplicationController } from '../controllers/ApplicationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

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

router.patch(
  '/:applicationId/status',
  authenticate,
  authorize([USER_TYPES.CUSTOMER, USER_TYPES.BACKOFFICE]),
  ApplicationController.updateApplicationStatus
);

export default router;
