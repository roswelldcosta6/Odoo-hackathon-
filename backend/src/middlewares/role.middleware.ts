import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

/**
 * Role Authorization Middleware
 * Usage: router.use(authorizeRoles('ADMIN', 'HR_OFFICER'))
 * Attach AFTER authenticate() middleware so req.user is populated.
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized access', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};
