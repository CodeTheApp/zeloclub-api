// src/routes/authRoutes.ts
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true, // Retorna info de rate limit no `RateLimit-*` headers
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    message: 'Too many password reset attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Routes
router.post('/register', loginLimiter, AuthController.register);
router.post('/login', passwordResetLimiter, AuthController.login);
router.post(
  '/request-password-reset',
  passwordResetLimiter,
  AuthController.requestPasswordReset
);
router.post(
  '/reset-password',
  passwordResetLimiter,
  AuthController.resetPassword
);
router.post('/auth0-login', loginLimiter, AuthController.auth0Login);
router.post('/me', AuthController.me);

export default router;
