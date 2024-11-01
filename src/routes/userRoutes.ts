// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// Endpoint para criar um profissional
router.post('/professional', UserController.createProfessional);

// Endpoint para criar um usuário de backoffice
router.post('/backoffice', UserController.createBackofficeUser);

// Endpoint para obter os dados de um usuário por ID
router.get('/:id', UserController.getUserById);

// Endpoint para buscar todos os users
router.get('/', UserController.getAllUsers);

export default router;
