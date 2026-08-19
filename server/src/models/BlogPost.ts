export type BlogCategory = 
  | 'Founder Stories'
  | 'Ecosystem News'
  | 'DeepTech Insights'
  | 'Policy & Grants'
  | 'Fundraising'
  | 'Tech Architecture';

export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown or rich formatted text
  category: BlogCategory;
  coverImageUrl?: string;
  tags: string[];
  
  // Author metadata
  authorId: string;
  authorName: string;
  authorRole: string;
  authorEmail: string;
  authorAvatarUrl?: string;
  isFounder: boolean;
  
  // Associated Startup (optional)
  startupId?: string;
  startupName?: string;
  startupSlug?: string;

  status: BlogStatus;
  featured: boolean;
  clapsCount: number;
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
