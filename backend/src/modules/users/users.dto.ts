import { z } from 'zod';

export const CreateUserDto = z.object({
  name:     z.string().min(1, 'Name is required'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['admin', 'manager', 'staff']).default('staff'),
});

export const UpdateUserDto = CreateUserDto.omit({ password: true }).partial();

export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;
