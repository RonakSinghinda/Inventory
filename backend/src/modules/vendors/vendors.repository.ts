import { prisma } from '../../lib/prisma';
import { CreateVendorInput, UpdateVendorInput } from './vendors.dto';

export const vendorsRepository = {
  findAll: () =>
    prisma.vendor.findMany({ orderBy: { name: 'asc' } }),

  findById: (id: string) =>
    prisma.vendor.findUnique({ where: { id } }),

  findByName: (name: string) =>
    prisma.vendor.findUnique({ where: { name } }),

  create: (data: CreateVendorInput) =>
    prisma.vendor.create({ data }),

  update: (id: string, data: UpdateVendorInput) =>
    prisma.vendor.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.vendor.delete({ where: { id } }),
};
