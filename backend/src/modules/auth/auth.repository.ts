import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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

  /** Create a user from Google sign-in (no password provided) */
  createGoogleUser: async (data: { name: string; email: string }) => {
    // Google users don't have a local password — store a random unusable hash
    const randomPw = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
    return prisma.user.create({
      data: { name: data.name, email: data.email, password: randomPw, role: 'admin' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  validatePassword: async (plain: string, hashed: string): Promise<boolean> =>
    bcrypt.compare(plain, hashed),
};

