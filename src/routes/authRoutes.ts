import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

export default router;
