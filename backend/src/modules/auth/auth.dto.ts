import { z } from 'zod';

export const LoginDto = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterDto = z.object({
  name:     z.string().min(1, 'Name is required'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['admin', 'manager', 'staff']).default('admin'),
});

export type LoginInput    = z.infer<typeof LoginDto>;
export type RegisterInput = z.infer<typeof RegisterDto>;
