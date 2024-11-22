import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger/winston';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.http({
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
};
