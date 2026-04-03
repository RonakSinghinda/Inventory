import { vendorsRepository } from './vendors.repository';
import { ApiError } from '../../utils/ApiError';
import { CreateVendorInput, UpdateVendorInput } from './vendors.dto';

export const vendorsService = {
  getAll: () => vendorsRepository.findAll(),

  getById: async (id: string) => {
    const vendor = await vendorsRepository.findById(id);
    if (!vendor) throw new ApiError(404, 'Vendor not found');
    return vendor;
  },

  create: async (data: CreateVendorInput) => {
    const existing = await vendorsRepository.findByName(data.name);
    if (existing) throw new ApiError(409, `Vendor "${data.name}" already exists`);
    return vendorsRepository.create(data);
  },

  update: async (id: string, data: UpdateVendorInput) => {
    await vendorsService.getById(id);
    return vendorsRepository.update(id, data);
  },

  delete: async (id: string) => {
    await vendorsService.getById(id);
    return vendorsRepository.delete(id);
  },
};
