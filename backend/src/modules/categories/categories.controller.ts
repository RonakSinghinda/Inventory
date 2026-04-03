import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const categoriesController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await categoriesService.getAll(), 'Categories fetched'));
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await categoriesService.getById(req.params.id), 'Category fetched'));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(new ApiResponse(201, await categoriesService.create(req.body), 'Category created'));
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await categoriesService.update(req.params.id, req.body), 'Category updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await categoriesService.delete(req.params.id);
      res.json(new ApiResponse(200, null, 'Category deleted'));
    } catch (err) { next(err); }
  },
};
