import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { config } from '../config';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = config.nodeEnv === 'development' ? err.stack : undefined;

  return sendError(res, message, statusCode, details);
};
