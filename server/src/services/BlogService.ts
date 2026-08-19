import { blogRepository } from '../repositories/BlogRepository.js';
import { startupRepository } from '../repositories/StartupRepository.js';
import { BlogPost, BlogFilterQuery, CreateBlogPostDTO, UpdateBlogPostDTO } from '../models/BlogPost.js';
import { User } from '../models/User.js';
import { UserRole } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';

export class BlogService {
  async getBlogs(filters: BlogFilterQuery) {
    return blogRepository.findAll(filters);
  }

  async getFeaturedBlogs(limit: number = 3): Promise<BlogPost[]> {
    return blogRepository.findFeatured(limit);
  }

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    let blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      blog = await blogRepository.findById(slug);
    }
    if (!blog) {
      throw ApiError.notFound(`Article '${slug}' not found on Tamil Nadu Stories platform`);
    }
    return blog;
  }

  async createBlog(data: CreateBlogPostDTO, author: User): Promise<BlogPost> {
    // Policy Check: Writing blogs is restricted to Verified Founders and Admins
    if (author.role !== UserRole.FOUNDER && author.role !== UserRole.ADMIN && author.role !== UserRole.SUPER_ADMIN) {
      throw ApiError.forbidden('Story publishing is currently reserved for verified Tamil Nadu founders and ecosystem admins.');
    }

    if (!data.title || !data.title.trim()) {
      throw ApiError.badRequest('Article title is required');
    }
    if (!data.content || !data.content.trim()) {
      throw ApiError.badRequest('Article content is required');
    }

    let slug = slugify(data.title.trim());
    const existing = await blogRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Estimate reading time (approx 200 words per minute)
    const wordCount = data.content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Resolve startup metadata if provided or claimed
    let startupId = data.startupId || author.claimedStartupId;
    let startupName = undefined;
    let startupSlug = undefined;

    if (startupId) {
      const s = await startupRepository.findById(startupId) || await startupRepository.findBySlug(startupId);
      if (s) {
        startupId = s.id;
        startupName = s.name;
        startupSlug = s.slug;
      }
    }

    const defaultCover = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80';

    const newPost = await blogRepository.create({
      slug,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim(),
      content: data.content.trim(),
      category: data.category || 'Founder Stories',
      coverImageUrl: data.coverImageUrl || defaultCover,
      tags: data.tags && data.tags.length > 0 ? data.tags : ['TamilNadu', 'Innovation'],
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role === UserRole.FOUNDER ? `Founder, ${startupName || author.companyName || 'Venture'}` : 'Ecosystem Contributor',
      authorEmail: author.email,
      authorAvatarUrl: author.avatarUrl,
      isFounder: author.role === UserRole.FOUNDER,
      startupId,
      startupName,
      startupSlug,
      status: data.status || 'PUBLISHED',
      featured: false,
      clapsCount: 0,
      readTimeMinutes,
      publishedAt: new Date().toISOString(),
    });

    return newPost;
  }

  async updateBlog(id: string, updates: UpdateBlogPostDTO, currentUserId: string, currentUserRole: UserRole): Promise<BlogPost> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Article not found for update');
    }

    // Permission: Author or Admin
    if (existing.authorId !== currentUserId && currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      throw ApiError.forbidden('You are not authorized to edit this article');
    }

    let readTimeMinutes = existing.readTimeMinutes;
    if (updates.content) {
      const wordCount = updates.content.trim().split(/\s+/).length;
      readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updated = await blogRepository.update(id, {
      ...updates,
      readTimeMinutes,
    });

    return updated!;
  }

  async deleteBlog(id: string, currentUserId: string, currentUserRole: UserRole): Promise<boolean> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Article not found for deletion');
    }

    // Permission: Author or Admin
    if (existing.authorId !== currentUserId && currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      throw ApiError.forbidden('You are not authorized to delete this article');
    }

    return blogRepository.delete(id, currentUserId);
  }

  async restoreBlog(id: string): Promise<BlogPost> {
    const restored = await blogRepository.restore(id);
    if (!restored) {
      throw ApiError.notFound('Article not found for restoration');
    }
    return restored;
  }

  async toggleFeature(id: string): Promise<BlogPost> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Article not found');
    }
    const updated = await blogRepository.update(id, {
      featured: !existing.featured,
    });
    return updated!;
  }

  async incrementClap(id: string): Promise<number> {
    const claps = await blogRepository.incrementClap(id);
    if (claps === null) {
      throw ApiError.notFound('Article not found');
    }
    return claps;
  }
}

export const blogService = new BlogService();
