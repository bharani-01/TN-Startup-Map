import { db, prisma } from '../database/connection.js';
import { User } from '../models/User.js';
import { UserRole } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    let u = Array.from(db.users.values()).find(
      (usr) => usr.email.toLowerCase() === normalizedEmail
    );
    if (u) {
      this.attachOwnedStartups(u);
      return u;
    }

    // Database lookup
    try {
      const dbAcc = await (prisma as any).userAccount?.findUnique({
        where: { email: normalizedEmail },
        include: { profile: true, contact: true },
      });

      if (dbAcc) {
        const userObj: User = {
          id: dbAcc.id,
          publicId: dbAcc.publicId,
          displayId: dbAcc.publicId,
          email: dbAcc.email,
          name: dbAcc.profile?.displayName || dbAcc.email.split('@')[0],
          role: dbAcc.role as any,
          passwordHash: dbAcc.passwordHash || '',
          avatarUrl: dbAcc.profile?.avatarUrl || undefined,
          bio: dbAcc.profile?.bio || undefined,
          companyName: dbAcc.profile?.companyName || undefined,
          phone: dbAcc.contact?.phone || undefined,
          isEmailVerified: dbAcc.isEmailVerified,
          isActive: dbAcc.isActive,
          createdAt: dbAcc.createdAt ? new Date(dbAcc.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: dbAcc.updatedAt ? new Date(dbAcc.updatedAt).toISOString() : new Date().toISOString(),
        };
        this.attachOwnedStartups(userObj);
        db.users.set(userObj.id, userObj);
        return userObj;
      }
    } catch {
      // Prisma error fallback
    }

    return null;
  }

  async findById(id: string): Promise<User | null> {
    let u = db.users.get(id);
    if (!u) {
      u = Array.from(db.users.values()).find((usr) => usr.publicId === id || usr.id === id);
    }
    if (u) {
      this.attachOwnedStartups(u);
      return u;
    }

    try {
      const dbAcc = await (prisma as any).userAccount?.findFirst({
        where: { OR: [{ id }, { publicId: id }] },
        include: { profile: true, contact: true },
      });

      if (dbAcc) {
        const userObj: User = {
          id: dbAcc.id,
          publicId: dbAcc.publicId,
          displayId: dbAcc.publicId,
          email: dbAcc.email,
          name: dbAcc.profile?.displayName || dbAcc.email.split('@')[0],
          role: dbAcc.role as any,
          passwordHash: dbAcc.passwordHash || '',
          avatarUrl: dbAcc.profile?.avatarUrl || undefined,
          bio: dbAcc.profile?.bio || undefined,
          companyName: dbAcc.profile?.companyName || undefined,
          phone: dbAcc.contact?.phone || undefined,
          isEmailVerified: dbAcc.isEmailVerified,
          isActive: dbAcc.isActive,
          createdAt: dbAcc.createdAt ? new Date(dbAcc.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: dbAcc.updatedAt ? new Date(dbAcc.updatedAt).toISOString() : new Date().toISOString(),
        };
        this.attachOwnedStartups(userObj);
        db.users.set(userObj.id, userObj);
        return userObj;
      }
    } catch {
      // Prisma error fallback
    }

    return null;
  }

  private attachOwnedStartups(u: User): void {
    const userEmail = (u.email || '').toLowerCase().trim();
    const owned = Array.from(db.startups.values()).filter(
      (s) =>
        s.claimedByUserId === u.id ||
        s.claimedByUserId === u.publicId ||
        (s.contactEmail && s.contactEmail.toLowerCase().trim() === userEmail) ||
        (s.founders && s.founders.some((f) => f.email && f.email.toLowerCase().trim() === userEmail))
    );

    if (owned.length > 0) {
      const ids = owned.map((s) => s.id);
      u.claimedStartupIds = Array.from(new Set([...(u.claimedStartupIds || []), ...ids]));
      u.claimedStartupId = u.claimedStartupId || ids[0];
      if (u.role !== UserRole.ADMIN && u.role !== UserRole.SUPER_ADMIN) {
        u.role = UserRole.FOUNDER;
      }
    }
  }

  async findByPublicId(publicId: string): Promise<User | null> {
    let u = Array.from(db.users.values()).find((usr) => usr.publicId === publicId);
    if (u) return u;
    return this.findById(publicId);
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
      if (updates.role) {
        await (prisma as any).userAccount?.update({
          where: { id: u.id },
          data: {
            role: updates.role as any,
            updatedAt: new Date(),
          },
        });
      }

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
