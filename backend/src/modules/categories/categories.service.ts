import { categoriesRepository } from './categories.repository';
import { ApiError } from '../../utils/ApiError';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.dto';

export const categoriesService = {
  getAll: () => categoriesRepository.findAll(),

  getById: async (id: string) => {
    const cat = await categoriesRepository.findById(id);
    if (!cat) throw new ApiError(404, 'Category not found');
    return cat;
  },

  create: async (data: CreateCategoryInput) => {
    const existing = await categoriesRepository.findByName(data.name);
    if (existing) throw new ApiError(409, `Category "${data.name}" already exists`);
    return categoriesRepository.create(data);
  },

  update: async (id: string, data: UpdateCategoryInput) => {
    await categoriesService.getById(id);
    return categoriesRepository.update(id, data);
  },

  delete: async (id: string) => {
    await categoriesService.getById(id);
    return categoriesRepository.delete(id);
  },
};
