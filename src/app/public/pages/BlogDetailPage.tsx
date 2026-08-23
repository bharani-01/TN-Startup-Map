import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { canonicalUrl, OG_DEFAULT_IMAGE } from '../../../utils/seo';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ThumbsUp, 
  Share2, 
  Building2, 
  Check, 
  ShieldCheck, 
  Tag, 
  Loader2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  Compass,
  Layers,
  MapPin,
  Flame,
  Bookmark
} from 'lucide-react';
import { BlogPost, Startup } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claps, setClaps] = useState<number>(0);
  const [hasClapped, setHasClapped] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Scroll Reading Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBlog(data.data);
          setClaps(data.data.clapsCount || 0);

          // If article is linked to a startup, fetch startup details for sidebar
          if (data.data.startupSlug) {
            try {
              const sRes = await fetch(`/api/startups/${data.data.startupSlug}`);
              const sData = await sRes.json();
              if (sData.success && sData.data) {
                setStartup(sData.data);
              }
            } catch (err) {
              console.error('Error fetching venture details:', err);
            }
          }

          // Fetch related stories
          const relatedRes = await fetch(`/api/blogs?limit=6`);
          const relatedData = await relatedRes.json();
          if (relatedData.success && relatedData.data) {
            setRelatedBlogs(
              relatedData.data.filter((b: BlogPost) => b.id !== data.data.id).slice(0, 4)
            );
          }
        } else {
          setError(data.message || 'Article not found');
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      window.scrollTo(0, 0);
      fetchArticle();
    }
  }, [slug]);

  const handleClap = async () => {
    if (!blog) return;
    setClaps((prev) => prev + 1);
    setHasClapped(true);
    try {
      await fetch(`/api/blogs/${blog.id}/clap`, { method: 'POST' });
    } catch (err) {
      console.error('Error clapping:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.subtitle || blog?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${blog?.title}" via @TNStartupMap`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${blog?.title} - Read more on Tamil Nadu Startup Map: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] py-36 text-center space-y-3 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs text-[#86868B] font-medium">Loading ecosystem story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] py-24 px-4 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-apple-card text-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-[#86868B] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F] font-display">Story Not Found</h2>
          <p className="text-xs text-[#86868B]">{error || 'This article does not exist or has been moved.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-apple-sm apple-press"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories Hub</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] pb-28 selection:bg-[#0071E3] selection:text-white">
      <Helmet>
        <title>{blog.title} — Tamil Nadu Startup Connect</title>
        <meta name="description" content={blog.subtitle || blog.title} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl(`/blog/${blog.slug}`)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.subtitle || blog.title} />
        <meta property="og:url" content={canonicalUrl(`/blog/${blog.slug}`)} />
        {blog.coverImageUrl && <meta property="og:image" content={blog.coverImageUrl} />}
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:author" content={blog.authorName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.subtitle || blog.title} />
        {blog.coverImageUrl && <meta name="twitter:image" content={blog.coverImageUrl} />}
      </Helmet>

      
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none z-0" />

      {/* 1. Scroll Reading Progress Bar Fixed at Screen Top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/[0.04] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#0071E3] via-[#5856D6] to-[#0077ED] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative z-10">
        
        {/* 2. Top Navigation & Action Strip (Full Page Width) */}
        <div className="bg-white/85 backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-30 shadow-2xs">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#86868B]">
              <Link to="/blog" className="hover:text-[#1D1D1F] flex items-center gap-1 font-bold apple-press-subtle">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Stories</span>
              </Link>
              <span>/</span>
              <span className="text-[#1D1D1F] font-semibold truncate max-w-[200px] sm:max-w-md">
                {blog.category}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] font-semibold flex items-center gap-1.5 transition-all apple-press shadow-2xs"
                title="Share article"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Share'}</span>
              </button>

              <button
                onClick={handleClap}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all apple-press shadow-2xs ${
                  hasClapped
                    ? 'bg-[#0071E3] text-white shadow-apple-sm'
                    : 'bg-white hover:bg-black/[0.04] text-[#1D1D1F] border border-black/[0.08]'
                }`}
                title="Applaud story"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasClapped ? 'fill-white' : 'text-[#0071E3]'}`} />
                <span>{claps} {claps === 1 ? 'Clap' : 'Claps'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Full-Page Editorial Masthead */}
        <header className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-6 space-y-6">
          
          {/* Category Pill, Date & Read Time */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="px-3.5 py-1.5 rounded-full font-bold bg-[#0071E3]/10 text-[#0071E3] shadow-2xs">
              {blog.category}
            </span>
            <span className="text-[#86868B] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[#86868B]">|</span>
            <span className="text-[#86868B] flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {blog.readTimeMinutes} min read
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#1D1D1F] tracking-[-0.035em] leading-[1.08]">
              {blog.title}
            </h1>
            {blog.subtitle && (
              <p className="text-base sm:text-xl lg:text-2xl text-[#86868B] font-medium leading-relaxed">
                {blog.subtitle}
              </p>
            )}
          </div>

          {/* Author Ribbon */}
          <div className="py-4 border-y border-black/[0.06] flex items-center justify-between gap-4 flex-wrap max-w-5xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-base shadow-inner shrink-0">
                {blog.authorName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#1D1D1F]">{blog.authorName}</span>
                  {blog.isFounder && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34C759]/10 text-[#34C759]">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Founder
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#86868B]">{blog.authorRole}</p>
              </div>
            </div>

            {blog.startupSlug && (
              <Link
                to={`/startups/${blog.startupSlug}`}
                className="px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#0071E3] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-apple-sm transition-all apple-press shrink-0"
              >
                <Building2 className="w-4 h-4" />
                <span>View {blog.startupName || 'Venture'} Profile</span>
              </Link>
            )}
          </div>

          {/* Full-Width Cinematic Hero Cover Image */}
          {blog.coverImageUrl && (
            <div className="w-full h-80 sm:h-[480px] lg:h-[600px] rounded-3xl overflow-hidden shadow-apple-card border border-black/[0.08] relative bg-slate-900 mt-4">
              <img
                src={blog.coverImageUrl}
                alt={blog.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

        </header>

        {/* 4. Full-Width 2-Column Editorial & Exploration Grid */}
        <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Full-Span Article Reading Card (8 of 12 columns) */}
            <div className="lg:col-span-8 space-y-8">
              
              <article className="bg-white rounded-3xl p-6 sm:p-12 lg:p-14 shadow-apple-card border border-black/[0.08]">
                <MarkdownRenderer content={blog.content} />

                {/* Tags Ribbon */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-black/[0.06] flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#86868B] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#0071E3]" />
                      Filed Under:
                    </span>
                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?q=${tag}`}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/[0.03] hover:bg-[#0071E3]/10 text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </article>

              {/* Bottom Social Engagement Island */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple-card border border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClap}
                    className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all apple-press shadow-apple-sm ${
                      hasClapped
                        ? 'bg-[#0071E3] text-white scale-105'
                        : 'bg-black/[0.04] hover:bg-[#0071E3]/10 text-[#1D1D1F]'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${hasClapped ? 'fill-white' : 'text-[#0071E3]'}`} />
                    <span>{claps} {claps === 1 ? 'Appreciation' : 'Appreciations'}</span>
                  </button>
                  <span className="text-xs text-[#86868B] font-medium hidden sm:inline">
                    Applaud this technical breakdown
                  </span>
                </div>

                {/* Social Share Suite */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    onClick={shareOnTwitter}
                    className="px-3.5 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all apple-press"
                  >
                    Share on X
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="px-3.5 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all apple-press"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="px-3.5 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all apple-press"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Contextual Intelligence & Venture Island (4 of 12 columns) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
              
              {/* 1. Venture Spotlight Card (If linked to a startup) */}
              {startup ? (
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-apple-card border border-black/[0.08] space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3] uppercase tracking-wider">
                      Featured Venture
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34C759]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-apple-sm shrink-0">
                      {startup.logoUrl ? (
                        <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{startup.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display text-[#1D1D1F]">
                        {startup.name}
                      </h4>
                      <p className="text-xs text-[#86868B] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
                        <span>{startup.district || 'Tamil Nadu'}, TN</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#86868B] leading-relaxed line-clamp-3">
                    {startup.tagline || startup.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                      <span className="text-[10px] text-[#86868B] block">Sector</span>
                      <span className="font-bold text-[#1D1D1F] truncate block">{startup.sectors?.[0] || 'Innovation'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                      <span className="text-[10px] text-[#86868B] block">Stage</span>
                      <span className="font-bold text-[#0071E3] truncate block">{startup.stage || 'Scaling'}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <Link
                      to={`/startups/${startup.slug}`}
                      className="w-full py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-apple-sm transition-all apple-press"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>View Venture Profile</span>
                    </Link>
                    <Link
                      to={`/map`}
                      className="w-full py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-xs font-bold flex items-center justify-center gap-1.5 transition-all apple-press"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Locate on Spatial Map</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* 2. Author Profile Card */
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-apple-card border border-black/[0.08] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                      {blog.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold font-display text-[#1D1D1F]">{blog.authorName}</p>
                      <p className="text-xs text-[#86868B]">{blog.authorRole}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#86868B] leading-relaxed">
                    Ecosystem Contributor & Founder on the Tamil Nadu Spatial Innovation Map.
                  </p>
                </div>
              )}

              {/* 3. Article Metadata & Spatial Context Card */}
              <div className="bg-white rounded-3xl p-6 shadow-apple-card border border-black/[0.08] space-y-4">
                <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Story Intelligence</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                    <span className="text-[#86868B]">Category</span>
                    <span className="font-bold text-[#1D1D1F]">{blog.category}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                    <span className="text-[#86868B]">Read Duration</span>
                    <span className="font-bold text-[#1D1D1F]">{blog.readTimeMinutes} minutes</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                    <span className="text-[#86868B]">Published</span>
                    <span className="font-bold text-[#1D1D1F]">
                      {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Community Claps</span>
                    <span className="font-bold text-[#0071E3] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {claps}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Quick Related Stories Feed */}
              {relatedBlogs.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-apple-card border border-black/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Up Next to Read</span>
                    </h4>
                    <Link to="/blog" className="text-[11px] font-bold text-[#0071E3] hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {relatedBlogs.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        to={`/blog/${item.slug}`}
                        className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-black/[0.03] transition-colors"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={item.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                          <h5 className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-[#86868B] block">
                            {item.readTimeMinutes} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </aside>

          </div>

          {/* 5. Full-Width Bottom Recommendation Showcase */}
          {relatedBlogs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-black/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-display text-[#1D1D1F] tracking-tight">
                    More Stories from Tamil Nadu Ecosystem
                  </h3>
                  <p className="text-xs sm:text-sm text-[#86868B] mt-1">
                    Explore deeper insights across deep tech, hardware, SaaS, and regional clusters.
                  </p>
                </div>

                <Link
                  to="/blog"
                  className="px-5 py-2.5 bg-white hover:bg-black/[0.03] text-[#1D1D1F] border border-black/[0.08] text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-apple-sm transition-all apple-press shrink-0"
                >
                  <span>Explore Stories Directory</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0071E3]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBlogs.map((item) => (
                  <Link
                    key={item.id}
                    to={`/blog/${item.slug}`}
                    className="apple-card bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 bg-slate-900 relative overflow-hidden">
                        <img
                          src={item.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1D1D1F] shadow-apple-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#86868B]">
                          <span>{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>{item.readTimeMinutes} min read</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1D1D1F] line-clamp-2 group-hover:text-[#0071E3] transition-colors leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50/70 border-t border-black/[0.04] text-xs font-medium text-[#86868B] flex items-center justify-between">
                      <span className="truncate max-w-[130px] font-bold text-[#1D1D1F]">{item.authorName}</span>
                      <span className="text-[#0071E3] font-bold">Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </main>

      </div>
    </div>
  );
};
