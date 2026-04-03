import { prisma } from '../../lib/prisma';
import { StockUpdateInput } from './stock.dto';

export const stockRepository = {
  createEntry: (data: StockUpdateInput & { updatedById: string }) =>
    prisma.stockEntry.create({
      data,
      include: {
        product:   { select: { name: true, sku: true } },
        updatedBy: { select: { name: true } },
      },
    }),

  findAll: (filters: { productId?: string; userId?: string; limit?: number }) =>
    prisma.stockEntry.findMany({
      where: {
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.userId    && { updatedById: filters.userId }),
      },
      include: {
        product:   { select: { id: true, name: true, sku: true } },
        updatedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit ?? 100,
    }),
};
