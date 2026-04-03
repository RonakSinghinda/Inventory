import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const dashboardController = {
  getStats: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await dashboardService.getStats();
      res.json(new ApiResponse(200, data, 'Dashboard stats fetched'));
    } catch (err) { next(err); }
  },
};
