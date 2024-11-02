// src/routes/userRoutes.ts
import { Router } from 'express';
import { upload } from '../config/uploadConfig';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { USER_TYPES } from '../types';

const router = Router();

// Endpoint para listar os usuários do tipo backoffice
router.get(
  '/backoffice',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  UserController.getAllBackofficeUsers
);

// Endpoint para criar um usuário de backoffice
router.post(
  '/backoffice',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  UserController.createBackofficeUser
);

// Endpoint para criar um profissional
router.post('/professional', authenticate, UserController.createProfessional);

// Endpoint para obter os dados de um usuário por ID
router.get('/:id', UserController.getUserById);

router.delete(
  '/:id',
  authenticate,
  authorize([USER_TYPES.BACKOFFICE]),
  UserController.deleteUser
);

// Endpoint para buscar todos os users
router.get('/', authenticate, UserController.getAllUsers);

// Endpoint para completar o perfil de um usuário e transformá-lo em profissional
router.patch(
  '/:id/complete-profile',
  authenticate,
  UserController.completeProfile
);

router.patch(
  '/:id/avatar',
  authenticate,
  upload.single('avatar'), // Middleware de upload usando S3
  UserController.uploadAvatar
);

export default router;
