import { db } from '../database/connection.js';
import { User } from '../models/User.js';
import { UserRole } from '../utils/constants.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const u = Array.from(db.users.values()).find(
      (usr) => usr.email.toLowerCase() === email.toLowerCase()
    );
    return u || null;
  }

  async findById(id: string): Promise<User | null> {
    const u = db.users.get(id);
    return u || null;
  }

  async create(user: User): Promise<User> {
    db.users.set(user.id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const u = db.users.get(id);
    if (!u) return null;
    const updated = {
      ...u,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.users.set(id, updated);
    return updated;
  }

  async updateRole(id: string, role: UserRole): Promise<User | null> {
    const u = db.users.get(id);
    if (!u) return null;
    u.role = role;
    u.updatedAt = new Date().toISOString();
    db.users.set(id, u);
    return u;
  }

  async findAll(): Promise<User[]> {
    return Array.from(db.users.values()).map((u) => {
      const { passwordHash, ...rest } = u;
      return rest as User;
    });
  }
}

export const userRepository = new UserRepository();
