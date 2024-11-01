import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../types'; // ajuste o caminho conforme a estrutura do seu projeto

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      userType: string;
    };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authorize = (allowedRoles: USER_TYPES[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }

    if (!allowedRoles.includes(user.userType)) {
      res.status(403).json({
        message: 'Forbidden: You do not have access to this resource',
      });
      return;
    }

    next(); // Usuário autorizado, continue para o controlador da rota
  };
};
