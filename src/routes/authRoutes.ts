import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Configura um limitador de taxa para a rota de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 requisições por IP a cada 15 minutos
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
});

// Configura um limitador de taxa para a rota de solicitação de redefinição de senha
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Limite de 3 requisições por IP a cada 1 hora
  message: {
    message: 'Too many password reset attempts. Please try again later.',
  },
});

router.post('/register', loginLimiter, AuthController.register);
router.post('/login', passwordResetLimiter, AuthController.login);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

export default router;
