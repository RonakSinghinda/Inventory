import { Request, Response, NextFunction } from 'express';
import { vendorsService } from './vendors.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const vendorsController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await vendorsService.getAll(), 'Vendors fetched'));
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await vendorsService.getById(req.params.id), 'Vendor fetched'));
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(new ApiResponse(201, await vendorsService.create(req.body), 'Vendor created'));
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(new ApiResponse(200, await vendorsService.update(req.params.id, req.body), 'Vendor updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await vendorsService.delete(req.params.id);
      res.json(new ApiResponse(200, null, 'Vendor deleted'));
    } catch (err) { next(err); }
  },
};
