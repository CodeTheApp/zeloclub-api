import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { logger } from '../lib/logger/winston';
import { prisma } from '../lib/prisma';
import { AuthService } from '../services/AuthService';
import { sendPasswordResetEmail } from '../services/emailService';

export class AuthController {
  public static readonly requestPasswordReset = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      logger.info('Request password reset', { email });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const token =
        crypto.randomBytes(3).toString('hex') +
        '-' +
        crypto.randomBytes(3).toString('hex');

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hora
        },
      });

      await sendPasswordResetEmail(user.email, token);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      logger.error('Error requesting password reset', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public static readonly resetPassword = async (
    req: Request,
    res: Response
  ) => {
    const { token, newPassword } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid or expired token' });
        return;
      }

      // Atualizar a senha e limpar os campos de recuperação
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(newPassword, 10),
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

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

      logger.info('User registered', { email: email });

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error(error);
      logger.error('Error registering user', { error });
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      logger.info('Login user', { email: email });

      const token = await AuthService.login(email, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      logger.error('Error login', { error });
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly me = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is missing or invalid' });
      }
      const token = authHeader.split(' ')[1];
      const user = await AuthService.getUserFromToken(token);
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly auth0Login = async (req: Request, res: Response) => {
    try {
      const { access_token } = req.body;

      const userInfo = await axios.get(`${process.env.AUTH0_ISSUER_BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const auth0User = userInfo.data;

      const user = await prisma.user.findUnique({
        where: { email: auth0User.email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        message: 'Login successful',
        user: auth0User,
      });
    } catch (error) {
      console.error('Auth0 login error:', error);
      res.status(400).json({
        message:
          error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };
}
