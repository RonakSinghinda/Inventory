import { z } from 'zod';

export const StockUpdateDto = z.object({
  productId:       z.string().min(1, 'Product is required'),
  action:          z.enum(['Add', 'Remove', 'Adjust']),
  quantityChanged: z.number().int().refine((n) => n !== 0, { message: 'Quantity changed cannot be zero' }),
  notes:           z.string().optional(),
});

export type StockUpdateInput = z.infer<typeof StockUpdateDto>;
