import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
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
