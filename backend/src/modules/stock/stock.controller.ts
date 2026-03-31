import { Request, Response, NextFunction } from 'express';
import { stockService } from './stock.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const stockController = {
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const entry  = await stockService.update(req.body, userId);
      res.status(201).json(new ApiResponse(201, entry, 'Stock updated'));
    } catch (err) { next(err); }
  },

  getHistory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId, userId, limit } = req.query;
      const data = await stockService.getHistory({
        productId: productId ? String(productId) : undefined,
        userId:    userId    ? String(userId)    : undefined,
        limit:     limit     ? Number(limit)     : undefined,
      });
      res.json(new ApiResponse(200, data, 'Stock history fetched'));
    } catch (err) { next(err); }
  },
};
