import { z } from 'zod';

export const CreateCategoryDto = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

export type CreateCategoryInput = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryDto>;
