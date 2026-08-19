import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Clock, 
  ThumbsUp, 
  Building2, 
  PenTool, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Tag,
  Loader2,
  Calendar,
  Lock
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

const CATEGORIES: Array<{ label: string; value: string; color: string }> = [
  { label: 'All Stories', value: 'all', color: 'bg-black/[0.04] text-[#1D1D1F]' },
  { label: 'Founder Stories', value: 'Founder Stories', color: 'bg-[#0071E3]/10 text-[#0071E3]' },
  { label: 'DeepTech Insights', value: 'DeepTech Insights', color: 'bg-purple-50 text-purple-700' },
  { label: 'Ecosystem News', value: 'Ecosystem News', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Policy & Grants', value: 'Policy & Grants', color: 'bg-amber-50 text-amber-700' },
  { label: 'Fundraising', value: 'Fundraising', color: 'bg-rose-50 text-rose-700' },
  { label: 'Tech Architecture', value: 'Tech Architecture', color: 'bg-cyan-50 text-cyan-700' },
];

export const BlogListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  const isFounderOrAdmin = isAuthenticated && (user?.role === 'FOUNDER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (activeCategory !== 'all') query.set('category', activeCategory);
        if (searchQuery) query.set('search', searchQuery);

        const [resAll, resFeatured] = await Promise.all([
          fetch(`/api/blogs?${query.toString()}`),
          fetch('/api/blogs/featured?limit=3'),
        ]);

        const dataAll = await resAll.json();
        const dataFeatured = await resFeatured.json();

        if (dataAll.success) {
          setBlogs(dataAll.data || []);
        } else {
          setError(dataAll.message || 'Failed to load stories');
        }

        if (dataFeatured.success) {
          setFeaturedBlogs(dataFeatured.data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('q', searchInput.trim());
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams);
  };

  const handleCategorySelect = (val: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', val);
    }
    setSearchParams(nextParams);
  };

  const mainFeatured = featuredBlogs.length > 0 ? featuredBlogs[0] : blogs[0];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-black/[0.06] pt-12 pb-16">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tamil Nadu Ecosystem Insights</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
                Stories & Insights from the Frontlines
              </h1>
              <p className="text-sm sm:text-base text-[#86868B] font-medium leading-relaxed">
                First-person engineering breakthroughs, aerospace dispatches, SaaS scaling playbooks, and venture building stories from Tamil Nadu founders.
              </p>
            </div>

            {/* Authoring Action CTA */}
            <div className="shrink-0">
              {isFounderOrAdmin ? (
                <Link
                  to="/blog/new"
                  className="px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-bold rounded-full inline-flex items-center gap-2 shadow-apple-sm transition-all apple-press"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write Founder Story</span>
                </Link>
              ) : (
                <Link
                  to="/blog/new"
                  className="px-5 py-2.5 bg-white hover:bg-black/[0.03] text-[#1D1D1F] border border-black/[0.1] text-xs font-bold rounded-full inline-flex items-center gap-2 shadow-apple-sm transition-all apple-press"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Publish a Story (Founders)</span>
                </Link>
              )}
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles, topics, founders..."
                className="w-full pl-9 pr-4 py-2 bg-black/[0.03] focus:bg-white rounded-full border border-black/[0.08] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
            </form>

            {/* Category Segmented Pills */}
            <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all apple-press ${
                    activeCategory === cat.value
                      ? 'bg-[#1D1D1F] text-white shadow-apple-sm'
                      : 'bg-white hover:bg-black/[0.04] text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
        
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
            <p className="text-xs text-[#86868B] font-medium">Loading ecosystem articles...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto py-16 text-center space-y-3">
            <p className="text-xs text-rose-600 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Hero Story Card (When not searching and on All stories) */}
            {mainFeatured && activeCategory === 'all' && !searchQuery && (
              <section className="bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Cover Image */}
                  <div className="lg:col-span-7 h-64 lg:h-auto min-h-[320px] relative overflow-hidden bg-slate-900">
                    <img
                      src={mainFeatured.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80'}
                      alt={mainFeatured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0071E3] text-white shadow-apple-sm">
                        Featured Story
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#0071E3]/10 text-[#0071E3]">
                          {mainFeatured.category}
                        </span>
                        <span className="text-[#86868B] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {mainFeatured.readTimeMinutes} min read
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display text-[#1D1D1F] tracking-tight leading-snug">
                        <Link to={`/blog/${mainFeatured.slug}`} className="hover:text-[#0071E3] transition-colors">
                          {mainFeatured.title}
                        </Link>
                      </h2>

                      {mainFeatured.subtitle && (
                        <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed line-clamp-3">
                          {mainFeatured.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                          {mainFeatured.authorName.charAt(0)}
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-[#1D1D1F]">{mainFeatured.authorName}</p>
                          <p className="text-[11px] text-[#86868B]">{mainFeatured.authorRole}</p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${mainFeatured.slug}`}
                        className="p-2.5 rounded-full bg-black/[0.04] hover:bg-[#0071E3] text-[#1D1D1F] hover:text-white transition-all apple-press"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>

                </div>
              </section>
            )}

            {/* Articles Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1D1D1F] font-display">
                  {searchQuery ? `Search results for "${searchQuery}"` : activeCategory === 'all' ? 'All Ecosystem Stories' : `${activeCategory} (${blogs.length})`}
                </h3>
                <span className="text-xs text-[#86868B] font-medium">
                  {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} published
                </span>
              </div>

              {blogs.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.08] shadow-apple-card space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-[#86868B] flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#1D1D1F] font-display">No articles found</h4>
                  <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                    No stories matched the selected filter or search query.
                  </p>
                  {isFounderOrAdmin && (
                    <Link
                      to="/blog/new"
                      className="px-5 py-2.5 bg-[#0071E3] text-white text-xs font-bold rounded-full inline-block shadow-apple-sm apple-press"
                    >
                      Be the first to publish
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Card Image */}
                        <Link to={`/blog/${post.slug}`} className="block h-48 relative overflow-hidden bg-slate-900">
                          <img
                            src={post.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1D1D1F] shadow-apple-sm">
                              {post.category}
                            </span>
                          </div>
                        </Link>

                        {/* Card Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-[#86868B]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3" />
                              {post.readTimeMinutes} min
                            </span>
                          </div>

                          <h4 className="text-base font-bold font-display text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors line-clamp-2">
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                          </h4>

                          {post.subtitle && (
                            <p className="text-xs text-[#86868B] line-clamp-2 leading-relaxed">
                              {post.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 py-4 bg-slate-50/50 border-t border-black/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {post.authorName.charAt(0)}
                          </div>
                          <div className="text-[11px] truncate max-w-[140px]">
                            <p className="font-bold text-[#1D1D1F] truncate">{post.authorName}</p>
                            {post.startupName && (
                              <p className="text-[10px] text-[#0071E3] font-semibold truncate">{post.startupName}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span className="font-semibold">{post.clapsCount || 0}</span>
                        </div>
                      </div>

                    </article>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

      </main>

    </div>
  );
};
