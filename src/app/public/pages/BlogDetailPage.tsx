import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Bookmark,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claps, setClaps] = useState<number>(0);
  const [hasClapped, setHasClapped] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-36 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs text-[#86868B] font-medium">Loading story...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1D1D1F] font-display">Story Not Found</h2>
        <p className="text-xs text-[#86868B]">{error || 'This article does not exist or has been archived.'}</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-apple-sm apple-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stories</span>
        </button>
      </div>
    );
  }

  // Basic markdown-like paragraph / heading renderer
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;
      
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#1D1D1F] font-display pt-6 pb-2 tracking-tight">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-lg font-bold text-[#1D1D1F] font-display pt-4 pb-1.5">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-6 pl-4 border-l-4 border-[#0071E3] italic text-base sm:text-lg text-[#1D1D1F] font-medium bg-[#0071E3]/5 p-4 rounded-r-2xl">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-sm sm:text-base text-[#1D1D1F]/90 leading-relaxed">
            {trimmed.replace('- ', '')}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-6 list-decimal text-sm sm:text-base text-[#1D1D1F]/90 leading-relaxed">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (trimmed === '---') {
        return <hr key={idx} className="my-8 border-black/[0.08]" />;
      }

      return (
        <p key={idx} className="text-sm sm:text-base text-[#1D1D1F]/90 leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-black/[0.06] sticky top-16 z-30">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#86868B]">
            <Link to="/blog" className="hover:text-[#1D1D1F] flex items-center gap-1 font-medium apple-press-subtle">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Stories</span>
            </Link>
            <span>/</span>
            <span className="text-[#1D1D1F] font-semibold truncate max-w-[200px] sm:max-w-md">
              {blog.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] font-semibold flex items-center gap-1.5 transition-all apple-press"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Header & Cover */}
      <header className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-10 pb-6 space-y-6">
        
        {/* Category & Metadata */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="px-3 py-1 rounded-full font-bold bg-[#0071E3]/10 text-[#0071E3]">
            {blog.category}
          </span>
          <span className="text-[#86868B] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[#86868B] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTimeMinutes} min read
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#1D1D1F] tracking-tight leading-tight">
            {blog.title}
          </h1>
          {blog.subtitle && (
            <p className="text-base sm:text-xl text-[#86868B] font-medium leading-relaxed">
              {blog.subtitle}
            </p>
          )}
        </div>

        {/* Author Ribbon */}
        <div className="py-4 border-y border-black/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-base shadow-inner">
              {blog.authorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1D1D1F]">{blog.authorName}</span>
                {blog.isFounder && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#34C759]/10 text-[#34C759]">
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
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-black/[0.03] border border-black/[0.08] text-xs font-bold text-[#0071E3] inline-flex items-center gap-1.5 shadow-apple-sm transition-all apple-press shrink-0"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>View Venture</span>
            </Link>
          )}
        </div>

        {/* Hero Cover Image */}
        {blog.coverImageUrl && (
          <div className="w-full h-72 sm:h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-apple-card border border-black/[0.08] relative bg-slate-900">
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

      </header>

      {/* Article Body */}
      <main className="max-w-[768px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Article Text Content */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-apple-card border border-black/[0.08]">
          <div className="prose prose-slate max-w-none">
            {renderFormattedContent(blog.content)}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#86868B] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Tags:
              </span>
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?q=${tag}`}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/[0.03] hover:bg-[#0071E3]/10 text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Floating / Sticky Engagement Bar */}
        <div className="mt-8 bg-white rounded-3xl p-5 shadow-apple-card border border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClap}
              className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all apple-press ${
                hasClapped
                  ? 'bg-[#0071E3] text-white shadow-apple-sm scale-105'
                  : 'bg-black/[0.04] hover:bg-[#0071E3]/10 text-[#1D1D1F]'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasClapped ? 'fill-white' : 'text-[#0071E3]'}`} />
              <span>{claps} {claps === 1 ? 'Appreciation' : 'Appreciations'}</span>
            </button>
            <span className="text-xs text-[#86868B] hidden sm:inline">
              Tap to support this founder story
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Author Bio Footer Box */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-apple-card border border-black/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-lg shadow-inner">
              {blog.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-[#1D1D1F] font-display">{blog.authorName}</p>
              <p className="text-xs text-[#86868B]">{blog.authorRole}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
            Published on the Tamil Nadu Spatial Innovation Map Stories Portal. Exploring technological autonomy, advanced manufacturing, and venture creation across Tamil Nadu's 38 districts.
          </p>
        </div>

      </main>

    </div>
  );
};
