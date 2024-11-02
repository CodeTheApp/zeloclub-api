import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { MoreThan } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { sendPasswordResetEmail } from '../services/emailService';

export class AuthController {
  public static readonly requestPasswordReset = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.body;

    try {
      const user = await UserRepository.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const token =
        crypto.randomBytes(3).toString('hex') +
        '-' +
        crypto.randomBytes(3).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

      await UserRepository.save(user);

      // Enviar email com o token
      await sendPasswordResetEmail(user.email, token);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public static readonly resetPassword = async (
    req: Request,
    res: Response
  ) => {
    const { token, newPassword } = req.body;

    try {
      const user = await UserRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(new Date()),
        },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid or expired token' });
        return;
      }

      // Atualizar a senha e limpar os campos de recuperação
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await UserRepository.save(user);

      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public static readonly register = async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        userType,
        description,
        gender,
      } = req.body;

      const user = await AuthService.register(
        name,
        email,
        password,
        phoneNumber,
        userType,
        description,
        gender
      );

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
