import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterInput } from './auth.dto';

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: async (data: RegisterInput) => {
    const hashed = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  validatePassword: async (plain: string, hashed: string): Promise<boolean> =>
    bcrypt.compare(plain, hashed),
};
