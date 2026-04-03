import { productsRepository } from './products.repository';
import { ApiError } from '../../utils/ApiError';
import { CreateProductInput, UpdateProductInput } from './products.dto';
import { PRODUCT_STATUS } from '../../config/constants';

const computeStatus = (quantity: number, minStock: number): string => {
  if (quantity <= 0) return PRODUCT_STATUS.OUT_OF_STOCK;
  if (quantity <= minStock) return PRODUCT_STATUS.LOW_STOCK;
  return PRODUCT_STATUS.IN_STOCK;
};

export const productsService = {
  getAll: async () => {
    const products = await productsRepository.findAll();
    return products.map((p: any) => ({ ...p, status: computeStatus(p.quantity, p.minStock) }));
  },

  getById: async (id: string) => {
    const product = await productsRepository.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');
    return { ...product, status: computeStatus(product.quantity, product.minStock) };
  },

  create: async (data: CreateProductInput) => {
    const existing = await productsRepository.findBySku(data.sku);
    if (existing) throw new ApiError(409, `SKU "${data.sku}" already exists`);
    const product = await productsRepository.create(data);
    return { ...product, status: computeStatus(product.quantity, product.minStock) };
  },

  update: async (id: string, data: UpdateProductInput) => {
    await productsService.getById(id);
    const product = await productsRepository.update(id, data);
    return { ...product, status: computeStatus(product.quantity, product.minStock) };
  },

  delete: async (id: string) => {
    await productsService.getById(id);
    return productsRepository.delete(id);
  },
};
