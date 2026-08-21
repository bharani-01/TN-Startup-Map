export type BlogCategory = 
  | 'Founder Stories'
  | 'Ecosystem News'
  | 'DeepTech Insights'
  | 'Policy & Grants'
  | 'Fundraising'
  | 'Tech Architecture';

export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface BlogPost {
  id: string; // UUID primary key
  publicId?: string; // Cryptographic public ID (blg_...)
  slug: string;
  title: string;
  subtitle?: string;
  content: string; // Full markdown body text (from blog_content table)
  category: BlogCategory;
  coverImageUrl?: string;
  tags: string[]; // From blog_tags junction
  
  // Author metadata
  authorId: string;
  authorPublicId?: string;
  authorName: string;
  authorRole: string;
  authorEmail: string;
  authorAvatarUrl?: string;
  isFounder: boolean;
  
  // Associated Startup (optional)
  startupId?: string;
  startupPublicId?: string;
  startupName?: string;
  startupSlug?: string;

  status: BlogStatus;
  featured: boolean;
  clapsCount: number; // From blog_engagement
  viewsCount?: number;
  sharesCount?: number;
  readTimeMinutes: number;
  publishedAt: string;
  
  // Non-destructive Soft Delete fields
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedByUserId?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface BlogFilterQuery {
  search?: string;
  category?: string;
  tag?: string;
  authorId?: string;
  startupId?: string;
  status?: string;
  featured?: boolean;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'claps' | 'title';
  order?: 'asc' | 'desc';
}

export interface CreateBlogPostDTO {
  title: string;
  subtitle?: string;
  content: string;
  category: BlogCategory;
  coverImageUrl?: string;
  tags?: string[];
  startupId?: string;
  status?: BlogStatus;
}

export interface UpdateBlogPostDTO {
  title?: string;
  subtitle?: string;
  content?: string;
  category?: BlogCategory;
  coverImageUrl?: string;
  tags?: string[];
  startupId?: string;
  status?: BlogStatus;
  featured?: boolean;
}
