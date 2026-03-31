import { z } from 'zod';

export const CreateVendorDto = z.object({
  name:    z.string().min(1, 'Vendor name is required'),
  email:   z.string().email().optional(),
  phone:   z.string().optional(),
  address: z.string().optional(),
});

export const UpdateVendorDto = CreateVendorDto.partial();

export type CreateVendorInput = z.infer<typeof CreateVendorDto>;
export type UpdateVendorInput = z.infer<typeof UpdateVendorDto>;
