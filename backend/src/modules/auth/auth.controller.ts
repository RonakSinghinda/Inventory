import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      res.json(new ApiResponse(200, result, 'Login successful'));
    } catch (err) { next(err); }
  },

  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(new ApiResponse(201, result, 'Registration successful'));
    } catch (err) { next(err); }
  },

  googleLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      if (!token) { res.status(400).json(new ApiResponse(400, null, 'Token is required')); return; }
      const result = await authService.googleLogin(token);
      res.json(new ApiResponse(200, result, 'Google login successful'));
    } catch (err) { next(err); }
  },

  me: (req: Request, res: Response): void => {
    res.json(new ApiResponse(200, req.user, 'Authenticated user'));
  },
};
