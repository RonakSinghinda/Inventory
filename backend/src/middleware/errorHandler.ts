import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
    });
    return;
  }

  // Unhandled / unexpected errors
  if (env.NODE_ENV === 'development') {
    console.error('[Unhandled Error]', err);
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
    data: null,
  });
};
