import { prisma } from '../../lib/prisma';
import { PRODUCT_STATUS } from '../../config/constants';

interface ProductWithQuantity {
  quantity: number;
  minStock: number;
  price: number;
}

export const dashboardService = {
  getStats: async () => {
    const [products, recentActivity] = await Promise.all([
      prisma.product.findMany({ include: { category: true, vendor: true } }),
      prisma.stockEntry.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product:   { select: { name: true, sku: true } },
          updatedBy: { select: { name: true } },
        },
      }),
    ]);

    const totalProducts   = products.length;
    const totalValue      = products.reduce((sum: number, p: ProductWithQuantity) => sum + p.price * p.quantity, 0);
    const outOfStockCount = products.filter((p: ProductWithQuantity) => p.quantity <= 0).length;
    const lowStockCount   = products.filter((p: ProductWithQuantity) => p.quantity > 0 && p.quantity <= p.minStock).length;

    const statusBreakdown = {
      [PRODUCT_STATUS.IN_STOCK]:     products.filter((p: ProductWithQuantity) => p.quantity > p.minStock).length,
      [PRODUCT_STATUS.LOW_STOCK]:    lowStockCount,
      [PRODUCT_STATUS.OUT_OF_STOCK]: outOfStockCount,
    };

    return {
      totalProducts,
      totalValue:     Math.round(totalValue * 100) / 100,
      lowStockCount,
      outOfStockCount,
      statusBreakdown,
      recentActivity,
    };
  },
};
