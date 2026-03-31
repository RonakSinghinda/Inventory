import { Request, Response, NextFunction } from 'express';
import { productsService } from './products.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const productsController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await productsService.getAll();
      res.json(new ApiResponse(200, data, 'Products fetched'));
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await productsService.getById(req.params.id);
      res.json(new ApiResponse(200, data, 'Product fetched'));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await productsService.create(req.body);
      res.status(201).json(new ApiResponse(201, data, 'Product created'));
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await productsService.update(req.params.id, req.body);
      res.json(new ApiResponse(200, data, 'Product updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await productsService.delete(req.params.id);
      res.json(new ApiResponse(200, null, 'Product deleted'));
    } catch (err) { next(err); }
  },
};
