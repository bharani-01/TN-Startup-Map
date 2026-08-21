import { db, prisma } from '../database/connection.js';
import { User } from '../models/User.js';
import { UserRole } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const u = Array.from(db.users.values()).find(
      (usr) => usr.email.toLowerCase() === email.toLowerCase()
    );
    return u || null;
  }

  async findById(id: string): Promise<User | null> {
    // Check direct ID or public ID
    let u = db.users.get(id);
    if (!u) {
      u = Array.from(db.users.values()).find((usr) => usr.publicId === id || usr.id === id);
    }
    return u || null;
  }

  async findByPublicId(publicId: string): Promise<User | null> {
    const u = Array.from(db.users.values()).find((usr) => usr.publicId === publicId);
    return u || null;
  }

  async create(user: User): Promise<User> {
    const publicId = user.publicId || generatePublicId('usr');
    const userToSave: User = {
      ...user,
      publicId,
      displayId: publicId,
    };

    db.users.set(userToSave.id, userToSave);

    // Persist to Prisma if active
    try {
      await (prisma as any).userAccount?.create({
        data: {
          id: userToSave.id,
          publicId: publicId || userToSave.id,
          email: userToSave.email,
          role: userToSave.role,
          passwordHash: userToSave.passwordHash || '',
          isEmailVerified: true,
          isActive: true,
          profile: {
            create: {
              displayName: userToSave.name,
              avatarUrl: userToSave.avatarUrl,
              companyName: userToSave.companyName,
              bio: userToSave.bio,
            },
          },
          contact: {
            create: {
              phone: userToSave.phone,
              state: 'Tamil Nadu',
            },
          },
          preferences: {
            create: {
              theme: 'system',
              emailNotifications: true,
            },
          },
        },
      });
    } catch {
      // Memory fallback active
    }

    return userToSave;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const u = await this.findById(id);
    if (!u) return null;

    const updated: User = {
      ...u,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.users.set(u.id, updated);

    try {
      await (prisma as any).userProfile?.updateMany({
        where: { userAccountId: u.id },
        data: {
          displayName: updates.name,
          avatarUrl: updates.avatarUrl,
          companyName: updates.companyName,
          bio: updates.bio,
        },
      });
    } catch {
      // Memory fallback active
    }

    return updated;
  }

  async updateRole(id: string, role: UserRole): Promise<User | null> {
    const u = await this.findById(id);
    if (!u) return null;

    u.role = role;
    u.updatedAt = new Date().toISOString();
    db.users.set(u.id, u);

    try {
      await (prisma as any).userAccount?.update({
        where: { id: u.id },
        data: { role },
      });
    } catch {
      // Memory fallback active
    }

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
