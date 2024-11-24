import { Router } from 'express';
import { USER_TYPES } from '../../types';
import { CareCharacteristicController } from '../controllers/CareCharacteristicController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Rota para criar uma nova característica de cuidado (acesso restrito)
router.post(
  '/',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  CareCharacteristicController.createCareCharacteristic
);

// Rota para listar todas as características de cuidado
router.get(
  '/',
  CareCharacteristicController.getAllCareCharacteristics
);

// Rota para atualizar uma característica de cuidado (acesso restrito)
router.put(
  '/:id',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  CareCharacteristicController.updateCareCharacteristic
);

// Rota para deletar (soft delete) uma característica de cuidado (acesso restrito)
router.delete(
  '/:id',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  CareCharacteristicController.deleteCareCharacteristic
);

export default router;
