import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { canonicalUrl, OG_DEFAULT_IMAGE } from '../../../utils/seo';
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
  Calendar, 
  Lock,
  Share2,
  Check,
  X,
  Compass,
  Layers,
  Flame,
  Zap,
  Filter
} from 'lucide-react';
import { BlogPost } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface CategoryItem {
  label: string;
  value: string;
  badgeColor: string;
  icon?: string;
}

const CATEGORIES: CategoryItem[] = [
  { label: 'All Stories', value: 'all', badgeColor: 'bg-black/[0.04] text-[#1D1D1F]' },
  { label: 'Founder Stories', value: 'Founder Stories', badgeColor: 'bg-[#0071E3]/10 text-[#0071E3]' },
  { label: 'DeepTech Insights', value: 'DeepTech Insights', badgeColor: 'bg-purple-50 text-purple-700' },
  { label: 'Ecosystem News', value: 'Ecosystem News', badgeColor: 'bg-emerald-50 text-emerald-700' },
  { label: 'Policy & Grants', value: 'Policy & Grants', badgeColor: 'bg-amber-50 text-amber-700' },
  { label: 'Fundraising', value: 'Fundraising', badgeColor: 'bg-rose-50 text-rose-700' },
  { label: 'Tech Architecture', value: 'Tech Architecture', badgeColor: 'bg-cyan-50 text-cyan-700' },
];

const POPULAR_TAGS = [
  'DeepTech',
  'AerospaceTN',
  'SaaSCorridor',
  'EVManufacturing',
  'DefenceCorridor',
  'IITMadras',
  'SeriesAFunding',
  'ClimateTech'
];

export const BlogListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'claps' | 'readTime'>('latest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clappedIds, setClappedIds] = useState<Record<string, boolean>>({});

  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  const isFounderOrAdmin = isAuthenticated && (user?.role === 'FOUNDER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN');

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

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

  // Handle claps on card
  const handleClap = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) => (b.id === post.id ? { ...b, clapsCount: (b.clapsCount || 0) + 1 } : b))
    );
    setClappedIds((prev) => ({ ...prev, [post.id]: true }));

    try {
      await fetch(`/api/blogs/${post.id}/clap`, { method: 'POST' });
    } catch (err) {
      console.error('Error clapping:', err);
    }
  };

  // Handle share on card
  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.subtitle || post.title,
        url: postUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(postUrl);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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

  const handleClearSearch = () => {
    setSearchInput('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
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

  const handleTagClick = (tag: string) => {
    setSearchInput(tag);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('q', tag);
    setSearchParams(nextParams);
  };

  // Sorting
  const sortedBlogs = useMemo(() => {
    const list = [...blogs];
    if (sortBy === 'claps') {
      return list.sort((a, b) => (b.clapsCount || 0) - (a.clapsCount || 0));
    }
    if (sortBy === 'readTime') {
      return list.sort((a, b) => (a.readTimeMinutes || 0) - (b.readTimeMinutes || 0));
    }
    // 'latest' default
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [blogs, sortBy]);

  const mainFeatured = featuredBlogs.length > 0 ? featuredBlogs[0] : blogs[0];

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] pb-24 selection:bg-[#0071E3] selection:text-white">
      <Helmet>
        <title>Ecosystem Stories &amp; Founder Insights — Tamil Nadu Startup Connect</title>
        <meta name="description" content="Read engineering breakthroughs, manufacturing playbooks, and venture building stories from Tamil Nadu founders and innovators." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl('/blog')} />
        <meta property="og:title" content="Ecosystem Stories & Founder Insights — Tamil Nadu Startup Connect" />
        <meta property="og:description" content="Read engineering breakthroughs, manufacturing playbooks, and venture building stories from Tamil Nadu founders." />
        <meta property="og:url" content={canonicalUrl('/blog')} />
        <meta property="og:image" content={OG_DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ecosystem Stories & Founder Insights — Tamil Nadu Startup Connect" />
        <meta name="twitter:description" content="Read engineering breakthroughs, manufacturing playbooks, and venture building stories from Tamil Nadu founders." />
      </Helmet>

      
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none z-0" />

      <div className="relative z-10">

        {/* 1. Keynote Editorial Masthead Banner */}
        <section className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-b border-black/[0.06] pt-12 pb-16">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-br from-[#0071E3]/[0.06] via-[#AF52DE]/[0.03] to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Tamil Nadu Innovation Dispatches</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1D1D1F] tracking-[-0.03em] leading-[1.08]">
                  Stories & Insights from <br />
                  <span className="bg-gradient-to-r from-[#0071E3] via-[#5856D6] to-[#2563EB] bg-clip-text text-transparent">
                    Tamil Nadu’s Frontiers
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#86868B] font-medium leading-relaxed max-w-2xl">
                  First-person engineering breakdowns, aerospace propulsion milestones, SaaS scaling playbooks, and regional venture builders across Tamil Nadu's 38 districts.
                </p>
              </div>

              {/* Authoring Action CTA & Ecosystem Stats */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {isFounderOrAdmin ? (
                  <Link
                    to="/blog/new"
                    className="px-6 py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-bold rounded-full inline-flex items-center justify-center gap-2 shadow-apple-sm transition-all apple-press"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Write Founder Story</span>
                  </Link>
                ) : (
                  <Link
                    to="/login?redirect=/blog/new"
                    className="px-6 py-3.5 bg-[#1D1D1F] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-full inline-flex items-center justify-center gap-2 shadow-apple-sm transition-all apple-press"
                  >
                    <PenTool className="w-4 h-4 text-white" />
                    <span>Publish Founder Dispatch</span>
                  </Link>
                )}

                <Link
                  to="/startups"
                  className="px-5 py-3.5 bg-white hover:bg-black/[0.03] text-[#1D1D1F] border border-black/[0.1] text-xs sm:text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 shadow-apple-sm transition-all apple-press backdrop-blur-md"
                >
                  <Building2 className="w-4 h-4 text-[#86868B]" />
                  <span>Browse Ventures</span>
                </Link>
              </div>

            </div>

            {/* Quick Filter & Search Bar */}
            <div className="mt-10 pt-8 border-t border-black/[0.06] space-y-4">
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Input Box */}
                <form onSubmit={handleSearchSubmit} className="w-full lg:w-96 relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search articles, topics, founders, tech..."
                    className="w-full pl-10 pr-10 py-2.5 bg-black/[0.03] focus:bg-white rounded-full border border-black/[0.08] focus:border-[#0071E3]/40 text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-4 focus:ring-[#0071E3]/10 transition-all shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.06] absolute right-3 top-2.5 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Sort Controls */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                  <span className="text-xs font-semibold text-[#86868B] shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Sort:
                  </span>
                  <div className="apple-segmented">
                    <button
                      onClick={() => setSortBy('latest')}
                      className={`px-3 py-1.5 text-xs font-bold apple-segmented-item ${sortBy === 'latest' ? 'active' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                    >
                      Latest
                    </button>
                    <button
                      onClick={() => setSortBy('claps')}
                      className={`px-3 py-1.5 text-xs font-bold apple-segmented-item flex items-center gap-1 ${sortBy === 'claps' ? 'active' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                    >
                      <Flame className="w-3 h-3 text-amber-500" />
                      <span>Most Clapped</span>
                    </button>
                    <button
                      onClick={() => setSortBy('readTime')}
                      className={`px-3 py-1.5 text-xs font-bold apple-segmented-item ${sortBy === 'readTime' ? 'active' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
                    >
                      Quick Reads
                    </button>
                  </div>
                </div>

              </div>

              {/* Category Segmented Horizontal Scroll Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-none pt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all apple-press-subtle shadow-2xs ${
                      activeCategory === cat.value
                        ? 'bg-[#1D1D1F] text-white shadow-apple-sm ring-1 ring-black/10'
                        : 'bg-white hover:bg-black/[0.04] text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Trending Topic Tags Strip */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#0071E3]" />
                  Trending Topics:
                </span>
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      searchQuery === tag
                        ? 'bg-[#0071E3] text-white'
                        : 'bg-black/[0.03] hover:bg-[#0071E3]/10 text-[#1D1D1F] hover:text-[#0071E3]'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 2. Main Content Area */}
        <main className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 pt-10">
          
          {loading ? (
            /* Modern Skeleton Shimmer Loading Grid */
            <div className="space-y-10">
              <div className="h-80 bg-white/70 animate-pulse rounded-3xl border border-black/[0.06] shadow-apple-card" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white/70 animate-pulse rounded-3xl h-96 border border-black/[0.06] shadow-apple-card" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto py-20 text-center space-y-4 bg-white rounded-3xl p-8 border border-black/[0.08] shadow-apple-card">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1D1D1F]">Unable to load stories</h3>
              <p className="text-xs text-[#86868B]">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-bold rounded-full apple-press"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Featured Hero Story Card (When on All stories and no search active) */}
              {mainFeatured && activeCategory === 'all' && !searchQuery && sortBy === 'latest' && (
                <section className="bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover transition-all group">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    
                    {/* Cover Image */}
                    <div className="lg:col-span-7 h-72 lg:h-auto min-h-[340px] relative overflow-hidden bg-slate-900">
                      <Link to={`/blog/${mainFeatured.slug}`} className="block w-full h-full">
                        <img
                          src={mainFeatured.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80'}
                          alt={mainFeatured.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </Link>
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0071E3] text-white shadow-apple-sm flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Editor's Spotlight</span>
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-[#1D1D1F] shadow-apple-sm">
                          {mainFeatured.category}
                        </span>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3 text-xs text-[#86868B]">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(mainFeatured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
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
                          <div className="w-10 h-10 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                            {mainFeatured.authorName.charAt(0)}
                          </div>
                          <div className="text-xs">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#1D1D1F]">{mainFeatured.authorName}</p>
                              {mainFeatured.isFounder && (
                                <span title="Verified Founder" className="inline-flex items-center">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#86868B] truncate max-w-[170px]">{mainFeatured.authorRole}</p>
                          </div>
                        </div>

                        <Link
                          to={`/blog/${mainFeatured.slug}`}
                          className="px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#0071E3] text-white text-xs font-bold transition-all apple-press flex items-center gap-1.5 shadow-apple-sm"
                        >
                          <span>Read Story</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>

                  </div>
                </section>
              )}

              {/* Articles Grid Header & Count */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06]">
                  <div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] font-display tracking-tight flex items-center gap-2">
                      <span>
                        {searchQuery
                          ? `Search Results for "${searchQuery}"`
                          : activeCategory === 'all'
                          ? 'All Ecosystem Stories'
                          : activeCategory}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.05] text-[#86868B]">
                        {sortedBlogs.length}
                      </span>
                    </h3>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="text-xs font-bold text-[#0071E3] hover:underline flex items-center gap-1"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>

                {sortedBlogs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.08] shadow-apple-card space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-[#86868B] flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-[#1D1D1F] font-display">No articles found</h4>
                    <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                      No stories match the selected category or search keywords.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-xs font-bold rounded-full apple-press"
                      >
                        Reset Search
                      </button>
                      <button
                        onClick={() => handleCategorySelect('all')}
                        className="px-4 py-2 bg-[#0071E3] text-white text-xs font-bold rounded-full apple-press shadow-apple-sm"
                      >
                        View All Stories
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedBlogs.map((post) => {
                      const isClapped = clappedIds[post.id];
                      const isCopied = copiedId === post.id;

                      return (
                        <article
                          key={post.id}
                          className="apple-card bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Image */}
                            <Link to={`/blog/${post.slug}`} className="block h-52 relative overflow-hidden bg-slate-900">
                              <img
                                src={post.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'}
                                alt={post.title}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1D1D1F] shadow-apple-sm">
                                  {post.category}
                                </span>
                              </div>
                            </Link>

                            {/* Card Content */}
                            <div className="p-5 sm:p-6 space-y-3">
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

                              <h4 className="text-base sm:text-lg font-bold font-display text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors line-clamp-2">
                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                              </h4>

                              {post.subtitle && (
                                <p className="text-xs text-[#86868B] line-clamp-2 leading-relaxed">
                                  {post.subtitle}
                                </p>
                              )}

                              {/* Tags Pill Row */}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  {post.tags.slice(0, 3).map((t) => (
                                    <span
                                      key={t}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleTagClick(t);
                                      }}
                                      className="cursor-pointer text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/[0.03] hover:bg-[#0071E3]/10 text-[#86868B] hover:text-[#0071E3] transition-colors"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Ribbon */}
                          <div className="px-5 py-4 bg-slate-50/70 border-t border-black/[0.04] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                                {post.authorName.charAt(0)}
                              </div>
                              <div className="text-[11px] truncate max-w-[130px]">
                                <p className="font-bold text-[#1D1D1F] truncate">{post.authorName}</p>
                                {post.startupName ? (
                                  <p className="text-[10px] text-[#0071E3] font-semibold truncate">{post.startupName}</p>
                                ) : (
                                  <p className="text-[10px] text-[#86868B] truncate">{post.authorRole}</p>
                                )}
                              </div>
                            </div>

                            {/* Card Engagement Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleClap(e, post)}
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all apple-press ${
                                  isClapped
                                    ? 'bg-[#0071E3] text-white shadow-2xs'
                                    : 'bg-white hover:bg-black/[0.04] text-[#86868B] hover:text-[#0071E3] border border-black/[0.06]'
                                }`}
                                title="Applaud story"
                              >
                                <ThumbsUp className={`w-3 h-3 ${isClapped ? 'fill-white' : ''}`} />
                                <span>{post.clapsCount || 0}</span>
                              </button>

                              <button
                                onClick={(e) => handleShare(e, post)}
                                className="p-1.5 rounded-full bg-white hover:bg-black/[0.04] text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.06] transition-all apple-press"
                                title="Share story"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 3. Community Story Contribution Banner */}
              <section className="bg-gradient-to-br from-[#1D1D1F] to-[#121214] text-white rounded-3xl p-8 sm:p-12 shadow-apple-card relative overflow-hidden">
                
                {/* Tech Grid Backdrop on Dark Banner */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#0071E3]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold">
                    <PenTool className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Tamil Nadu Founder Voice</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight">
                    Have an Engineering Breakthrough or Scaling Story to Share?
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Tamil Nadu Startup Map Stories is an open, curated repository of technical innovations, manufacturing breakthroughs, and founder playbooks from across the state.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      to={isAuthenticated ? "/blog/new" : "/login?redirect=/blog/new"}
                      className="px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-bold rounded-full inline-flex items-center gap-2 shadow-apple-sm transition-all apple-press"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Submit Your Story</span>
                    </Link>
                    <Link
                      to="/support"
                      className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold rounded-full inline-flex items-center gap-2 transition-all apple-press"
                    >
                      <span>Editorial Guidelines</span>
                    </Link>
                  </div>
                </div>
              </section>

            </div>
          )}

        </main>

      </div>
    </div>
  );
};
