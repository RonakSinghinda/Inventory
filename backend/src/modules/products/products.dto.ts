import { z } from 'zod';

export const CreateProductDto = z.object({
  name:        z.string().min(1, 'Product name is required'),
  sku:         z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  price:       z.number().positive('Price must be positive'),
  quantity:    z.number().int().min(0, 'Quantity cannot be negative'),
  minStock:    z.number().int().min(0, 'Min stock cannot be negative'),
  categoryId:  z.string().min(1, 'Category is required'),
  vendorId:    z.string().min(1, 'Vendor is required'),
});

export const UpdateProductDto = CreateProductDto.partial();

export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
