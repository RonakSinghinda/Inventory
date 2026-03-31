import { authRepository } from './auth.repository';
import { generateToken } from '../../utils/generateToken';
import { ApiError } from '../../utils/ApiError';
import { LoginInput, RegisterInput } from './auth.dto';
import { Role } from '../../config/constants';

export const authService = {
  login: async (input: LoginInput) => {
    const user = await authRepository.findByEmail(input.email);
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isValid = await authRepository.validatePassword(input.password, user.password);
    if (!isValid) throw new ApiError(401, 'Invalid email or password');

    const token = generateToken({ userId: user.id, email: user.email, role: user.role as Role });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  register: async (input: RegisterInput) => {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ApiError(409, 'Email already in use');

    const user = await authRepository.create(input);
    const token = generateToken({ userId: user.id, email: user.email, role: user.role as Role });

    return { token, user };
  },
};
