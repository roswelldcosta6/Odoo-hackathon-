import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token.util';
import { sendError } from '../utils/response.util';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication Middleware: Verifies Bearer Token in Authorization header
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    return sendError(res, 'Invalid or expired authentication token', 401, error.message);
  }
};
