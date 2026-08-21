import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepository.js';
import { 
  RegisterDTO, 
  LoginDTO, 
  UserPublicProfile, 
  User, 
  generateInternalUserId 
} from '../models/User.js';
import { UserRole } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';
import { generatePublicId } from '../utils/publicId.js';

export class AuthService {
  async register(data: RegisterDTO): Promise<{ user: UserPublicProfile; token: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcryptRounds);
    const role = data.roleIntent === 'FOUNDER' ? UserRole.FOUNDER : UserRole.USER;
    const publicId = generatePublicId('usr');

    const newUser: User = {
      id: generateInternalUserId(),
      publicId,
      displayId: publicId,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      role,
      passwordHash,
      companyName: data.companyName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRepository.create(newUser);

    const token = this.generateToken(newUser);
    const { passwordHash: _, ...publicUser } = newUser;

    return {
      user: {
        ...publicUser,
        displayName: publicUser.name,
      } as UserPublicProfile,
      token,
    };
  }

  async login(data: LoginDTO): Promise<{ user: UserPublicProfile; token: string }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...publicUser } = user;

    return {
      user: {
        ...publicUser,
        displayName: publicUser.name,
      } as UserPublicProfile,
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<UserPublicProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User session not found');
    }

    const { passwordHash: _, ...publicUser } = user;
    return {
      ...publicUser,
      displayName: publicUser.name,
    } as UserPublicProfile;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
