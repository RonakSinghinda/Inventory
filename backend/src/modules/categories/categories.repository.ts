import { prisma } from '../../lib/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.dto';

export const categoriesRepository = {
  findAll: () =>
    prisma.category.findMany({ orderBy: { name: 'asc' } }),

  findById: (id: string) =>
    prisma.category.findUnique({ where: { id } }),

  findByName: (name: string) =>
    prisma.category.findUnique({ where: { name } }),

  create: (data: CreateCategoryInput) =>
    prisma.category.create({ data }),

  update: (id: string, data: UpdateCategoryInput) =>
    prisma.category.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.category.delete({ where: { id } }),
};
