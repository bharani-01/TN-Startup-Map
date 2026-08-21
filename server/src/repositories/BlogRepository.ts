import { db, prisma } from '../database/connection.js';
import { BlogPost, BlogFilterQuery } from '../models/BlogPost.js';
import { generatePublicId } from '../utils/publicId.js';

export class BlogRepository {
  async findAll(filters: BlogFilterQuery = {}): Promise<{ blogs: BlogPost[]; total: number; page: number; limit: number; totalPages: number }> {
    let result = Array.from(db.blogs.values());

    // Soft delete filtering
    if (!filters.includeDeleted) {
      result = result.filter((b) => !b.isDeleted);
    } else {
      result = result.filter((b) => b.isDeleted === true);
    }

    // Status filtering (default: PUBLISHED only for public queries unless explicitly filtering)
    if (filters.status && filters.status !== 'all') {
      result = result.filter((b) => b.status === filters.status);
    } else if (!filters.includeDeleted && !filters.authorId && filters.status !== 'all') {
      result = result.filter((b) => b.status === 'PUBLISHED');
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((b) => b.category.toLowerCase() === filters.category!.toLowerCase());
    }

    // Tag filter
    if (filters.tag && filters.tag !== 'all') {
      const targetTag = filters.tag.toLowerCase();
      result = result.filter((b) => b.tags.some((t) => t.toLowerCase() === targetTag));
    }

    // Author filter
    if (filters.authorId) {
      result = result.filter((b) => b.authorId === filters.authorId || b.authorPublicId === filters.authorId);
    }

    // Startup filter
    if (filters.startupId) {
      result = result.filter((b) => b.startupId === filters.startupId || b.startupSlug === filters.startupId || b.startupPublicId === filters.startupId);
    }

    // Featured filter
    if (filters.featured !== undefined) {
      result = result.filter((b) => b.featured === filters.featured);
    }

    // Search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
          b.content.toLowerCase().includes(q) ||
          b.authorName.toLowerCase().includes(q) ||
          (b.startupName && b.startupName.toLowerCase().includes(q)) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'recent';
    const order = filters.order || 'desc';

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'recent') {
        comparison = new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      } else if (sortBy === 'claps') {
        comparison = b.clapsCount - a.clapsCount;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return order === 'asc' ? -comparison : comparison;
    });

    const total = result.length;
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 10);
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = result.slice(offset, offset + limit);

    return {
      blogs: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<BlogPost | null> {
    let b = db.blogs.get(id);
    if (!b) {
      b = Array.from(db.blogs.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!b || b.isDeleted) return null;
    return b;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const b = Array.from(db.blogs.values()).find(
      (item) =>
        (item.slug.toLowerCase() === slug.toLowerCase() ||
          item.id === slug ||
          item.publicId === slug) &&
        !item.isDeleted
    );
    return b || null;
  }

  async findFeatured(limit: number = 3): Promise<BlogPost[]> {
    return Array.from(db.blogs.values())
      .filter((b) => !b.isDeleted && b.status === 'PUBLISHED' && b.featured)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, limit);
  }

  async create(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publicId'> & { publicId?: string }): Promise<BlogPost> {
    const now = new Date().toISOString();
    const id = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const publicId = data.publicId || generatePublicId('blg');

    const blog: BlogPost = {
      ...data,
      id,
      publicId,
      isDeleted: false,
      deletedAt: null,
      deletedByUserId: null,
      createdAt: now,
      updatedAt: now,
    };
    db.blogs.set(id, blog);
    return blog;
  }

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    let existing = db.blogs.get(id);
    if (!existing) {
      existing = Array.from(db.blogs.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!existing) return null;

    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.blogs.set(existing.id, updated);
    return updated;
  }

  async incrementClap(id: string): Promise<number | null> {
    let existing = db.blogs.get(id);
    if (!existing) {
      existing = Array.from(db.blogs.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!existing) return null;

    existing.clapsCount = (existing.clapsCount || 0) + 1;
    existing.updatedAt = new Date().toISOString();
    db.blogs.set(existing.id, existing);
    return existing.clapsCount;
  }

  async delete(id: string, deletedByUserId?: string): Promise<boolean> {
    let existing = db.blogs.get(id);
    if (!existing) {
      existing = Array.from(db.blogs.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!existing) return false;

    existing.isDeleted = true;
    existing.deletedAt = new Date().toISOString();
    existing.deletedByUserId = deletedByUserId || 'admin';
    existing.updatedAt = new Date().toISOString();
    db.blogs.set(existing.id, existing);
    return true;
  }

  async restore(id: string): Promise<BlogPost | null> {
    let existing = db.blogs.get(id);
    if (!existing) {
      existing = Array.from(db.blogs.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!existing) return null;

    existing.isDeleted = false;
    existing.deletedAt = null;
    existing.deletedByUserId = null;
    existing.updatedAt = new Date().toISOString();
    db.blogs.set(existing.id, existing);
    return existing;
  }
}

export const blogRepository = new BlogRepository();
