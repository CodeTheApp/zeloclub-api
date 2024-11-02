import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { USER_TYPES } from '../types';

const router = Router();

// Rota para criar um serviço (somente para usuários do tipo Backoffice)
router.post(
  '/',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  ServiceController.createService
);

// Rota para listar todos os serviços (somente visível para usuários do tipo Professional e Backoffice)
router.get(
  '/',
  authenticate,
  authorize([USER_TYPES.PROFESSIONAL, USER_TYPES.BACKOFFICE]),
  ServiceController.getAllServices
);

router.delete(
  '/:id',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  ServiceController.deleteService
);

export default router;
