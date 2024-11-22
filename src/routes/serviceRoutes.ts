import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { USER_TYPES } from '../../types';
import { ServiceController } from '../controllers/ServiceController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

const serviceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true, // Retorna info de rate limit no `RateLimit-*` headers
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Rota para criar um serviço (somente para usuários do tipo Backoffice)
router.post(
  '/',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  serviceLimiter,
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
