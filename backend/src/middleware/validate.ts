import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware factory that validates req.body against a Zod schema.
 * On success, the parsed (and typed) value replaces req.body.
 * Usage: router.post('/', validate(CreateProductDto), controller.create)
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return next(new ApiError(422, `Validation error — ${message}`));
      }
      next(err);
    }
  };
};
