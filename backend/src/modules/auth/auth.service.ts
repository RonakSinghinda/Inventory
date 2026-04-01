import { authRepository } from './auth.repository';
import { generateToken } from '../../utils/generateToken';
import { ApiError } from '../../utils/ApiError';
import { LoginInput, RegisterInput } from './auth.dto';
import { Role } from '../../config/constants';
import { firebaseAuth } from '../../lib/firebaseAdmin';

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

  /** Verify a Firebase ID token and find/create user in our DB */
  googleLogin: async (idToken: string) => {
    // 1. Verify the Firebase ID token
    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch {
      throw new ApiError(401, 'Invalid or expired Google token');
    }

    const { email, name } = decoded;
    if (!email) throw new ApiError(400, 'Google account has no email');

    // 2. Find existing user or create a new one
    let user = await authRepository.findByEmail(email);
    if (!user) {
      // Auto-register Google users as 'staff' (admin can upgrade later)
      const created = await authRepository.createGoogleUser({
        name: name || email.split('@')[0],
        email,
      });
      // 3. Generate our own JWT
      const token = generateToken({ userId: created.id, email: created.email, role: created.role as Role });
      return { token, user: { id: created.id, name: created.name, email: created.email, role: created.role } };
    }

    // 3. Generate our own JWT
    const token = generateToken({ userId: user.id, email: user.email, role: user.role as Role });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },
};
