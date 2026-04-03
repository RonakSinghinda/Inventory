import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const usersController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await usersService.getAll(), 'Users fetched'));
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await usersService.getById(req.params.id), 'User fetched'));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(new ApiResponse(201, await usersService.create(req.body), 'User created'));
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await usersService.update(req.params.id, req.body), 'User updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await usersService.delete(req.params.id);
      res.json(new ApiResponse(200, null, 'User deleted'));
    } catch (err) { next(err); }
  },
};
