import { prisma } from '../../lib/prisma';
import { CreateProductInput, UpdateProductInput } from './products.dto';

export const productsRepository = {
  findAll: () =>
    prisma.product.findMany({
      include: { category: true, vendor: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: { category: true, vendor: true },
    }),

  findBySku: (sku: string) =>
    prisma.product.findUnique({ where: { sku } }),

  create: (data: CreateProductInput) =>
    prisma.product.create({
      data,
      include: { category: true, vendor: true },
    }),

  update: (id: string, data: UpdateProductInput) =>
    prisma.product.update({
      where: { id },
      data,
      include: { category: true, vendor: true },
    }),

  delete: (id: string) =>
    prisma.product.delete({ where: { id } }),

  updateQuantity: (id: string, quantity: number) =>
    prisma.product.update({ where: { id }, data: { quantity } }),
};
