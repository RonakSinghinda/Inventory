import { usersRepository } from './users.repository';
import { ApiError } from '../../utils/ApiError';
import { CreateUserInput, UpdateUserInput } from './users.dto';

export const usersService = {
  getAll: () => usersRepository.findAll(),

  getById: async (id: string) => {
    const user = await usersRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  create: async (data: CreateUserInput) => {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw new ApiError(409, 'Email already in use');
    return usersRepository.create(data);
  },

  update: async (id: string, data: UpdateUserInput) => {
    await usersService.getById(id);
    return usersRepository.update(id, data);
  },

  delete: async (id: string) => {
    await usersService.getById(id);
    return usersRepository.delete(id);
  },
};
