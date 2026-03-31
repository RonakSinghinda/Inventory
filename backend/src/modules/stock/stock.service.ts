import { stockRepository } from './stock.repository';
import { productsRepository } from '../products/products.repository';
import { ApiError } from '../../utils/ApiError';
import { StockUpdateInput } from './stock.dto';

export const stockService = {
  update: async (input: StockUpdateInput, updatedById: string) => {
    const product = await productsRepository.findById(input.productId);
    if (!product) throw new ApiError(404, 'Product not found');

    // Calculate new quantity
    let newQty = product.quantity;
    if (input.action === 'Add')    newQty += input.quantityChanged;
    if (input.action === 'Remove') newQty -= Math.abs(input.quantityChanged);
    if (input.action === 'Adjust') newQty  = product.quantity + input.quantityChanged;

    if (newQty < 0) throw new ApiError(400, 'Stock cannot go below zero');

    // Update product quantity and create history entry
    await productsRepository.updateQuantity(input.productId, newQty);
    return stockRepository.createEntry({ ...input, updatedById });
  },

  getHistory: (filters: { productId?: string; userId?: string; limit?: number }) =>
    stockRepository.findAll(filters),
};
