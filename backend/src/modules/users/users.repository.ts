import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { CreateUserInput, UpdateUserInput } from './users.dto';

export const usersRepository = {
  findAll: () =>
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: async (data: CreateUserInput) => {
    const hashed = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  update: (id: string, data: UpdateUserInput) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
