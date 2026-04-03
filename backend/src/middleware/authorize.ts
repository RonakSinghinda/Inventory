import { Request, Response, NextFunction } from 'express';
import { Role } from '../config/constants';
import { ApiError } from '../utils/ApiError';

/**
 * Role-based access control middleware.
 * Usage: router.post('/', authorize('admin', 'manager'), controller.create)
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: insufficient permissions'));
    }
    next();
  };
};
