import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  PenTool, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon, 
  Building2, 
  Tag, 
  Eye, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock,
  Plus
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { BlogCategory, Startup } from '../../../types';

const CATEGORY_OPTIONS: BlogCategory[] = [
  'Founder Stories',
  'DeepTech Insights',
  'Ecosystem News',
  'Policy & Grants',
  'Fundraising',
  'Tech Architecture',
];

const COVER_PRESETS = [
  { label: 'DeepTech & SpaceTech', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SaaS & Enterprise Cloud', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80' },
  { label: 'EV Mobility & CleanTech', url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'IIT Madras R&D Matrix', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Precision Manufacturing', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80' },
];

export const WriteArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Founder Stories');
  const [coverImageUrl, setCoverImageUrl] = useState(COVER_PRESETS[0].url);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['TamilNadu', 'Innovation']);
  const [content, setContent] = useState('');
  const [startupId, setStartupId] = useState('');
  const [myStartups, setMyStartups] = useState<Startup[]>([]);

  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFounderOrAdmin = isAuthenticated && (user?.role === 'FOUNDER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN');

  useEffect(() => {
    const fetchMyStartups = async () => {
      if (!user) return;
      const claims = user.claimedStartupIds || (user.claimedStartupId ? [user.claimedStartupId] : []);
      if (claims.length > 0) {
        try {
          const promises = claims.map((sid) => fetch(`/api/startups/${sid}`).then((r) => r.json()));
          const results = await Promise.all(promises);
          const valid = results.filter((r) => r.success && r.data).map((r) => r.data as Startup);
          setMyStartups(valid);
          if (valid.length > 0) {
            setStartupId(valid[0].id);
          }
        } catch (err) {
          console.error('Error fetching founder startups:', err);
        }
      }
    };

    fetchMyStartups();
  }, [user]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handlePublish = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (!title.trim()) {
      setError('Please provide an article title');
      return;
    }
    if (!content.trim()) {
      setError('Please write article content before publishing');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim(),
          category,
          coverImageUrl,
          tags,
          content: content.trim(),
          startupId: startupId || undefined,
          status,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to publish article');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/blog/${data.data.slug}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  // Guard: Not signed in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-apple-card border border-black/[0.08] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F] font-display">Authentication Required</h2>
          <p className="text-xs text-[#86868B]">
            Please sign in with your verified founder account to access the Tamil Nadu Story Composer.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={`/login?redirect=${encodeURIComponent('/blog/new')}`}
              className="px-6 py-2.5 bg-[#0071E3] text-white text-xs font-bold rounded-full shadow-apple-sm apple-press"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Guard: General User (Policy: blocked from writing for now)
  if (!isFounderOrAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-apple-card border border-black/[0.08] text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-apple-sm">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1D1D1F] font-display">
              Founder Story Publishing
            </h2>
            <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto leading-relaxed">
              Publishing is currently unlocked exclusively for verified Tamil Nadu founders and ecosystem administrators to ensure authentic, first-person dispatches.
            </p>
          </div>

          <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.04] text-xs text-left space-y-2">
            <p className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0071E3]" />
              Are you building an innovative venture in Tamil Nadu?
            </p>
            <p className="text-[#86868B] leading-relaxed">
              Submit your venture for verification or claim your existing company profile to unlock immediate founder publishing rights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-full shadow-apple-sm apple-press"
            >
              List Your Startup
            </Link>
            <Link
              to="/startups"
              className="w-full sm:w-auto px-6 py-2.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-xs font-bold rounded-full transition-all apple-press"
            >
              Find & Claim Venture
            </Link>
          </div>

          <div className="pt-2">
            <Link to="/blog" className="text-xs text-[#86868B] hover:text-[#1D1D1F] font-semibold">
              ← Return to Stories Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] pb-24">
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Top Header Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-black/[0.06] sticky top-16 z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/blog" className="text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-black/[0.04] transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1D1D1F] font-display flex items-center gap-2">
                <PenTool className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Story Composer</span>
              </h2>
              <p className="text-[10px] text-[#86868B]">Authoring as {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all apple-press ${
                previewMode
                  ? 'bg-[#1D1D1F] text-white shadow-apple-sm'
                  : 'bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
            </button>

            <button
              onClick={() => handlePublish('PUBLISHED')}
              disabled={saving}
              className="px-5 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-full shadow-apple-sm transition-all apple-press flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Publish Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Composer Area */}
      <main className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-8 space-y-6">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-bold">Story published successfully! Redirecting to article...</span>
          </div>
        )}

        {!previewMode ? (
          <div className="space-y-6">
            
            {/* Meta Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple-card border border-black/[0.08] space-y-5">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-xs text-[#1D1D1F] mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How We Designed and Built India's First 3D-Printed Rocket Engine"
                  className="w-full px-4 py-3 text-lg font-bold text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-xs text-[#1D1D1F] mb-1.5">
                  Subtitle / Summary (Optional)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A concise one-liner summarizing your key insights..."
                  className="w-full px-4 py-2.5 text-xs text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              {/* Category & Associated Startup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-[#1D1D1F] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-xs text-[#1D1D1F] mb-1.5">
                    Link to Venture (Optional)
                  </label>
                  <select
                    value={startupId}
                    onChange={(e) => setStartupId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 cursor-pointer"
                  >
                    <option value="">No specific startup link</option>
                    {myStartups.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.district})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block font-bold text-xs text-[#1D1D1F] mb-1.5">
                  Tags (Press Enter or Comma to add)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-black/[0.02] rounded-2xl border border-black/[0.08]">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0071E3]/10 text-[#0071E3] flex items-center gap-1"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag and press enter..."
                    className="bg-transparent text-xs text-[#1D1D1F] focus:outline-none px-2 py-1 grow min-w-[140px]"
                  />
                </div>
              </div>

              {/* Cover Image URL & Presets */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-xs text-[#1D1D1F]">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-xs text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-[#86868B] shrink-0">Presets:</span>
                  {COVER_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setCoverImageUrl(p.url)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                        coverImageUrl === p.url
                          ? 'bg-[#0071E3] text-white'
                          : 'bg-black/[0.04] text-[#1D1D1F] hover:bg-black/[0.08]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple-card border border-black/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-xs text-[#1D1D1F]">
                  Article Content (Supports Markdown, Headings ###, Bullet points -) *
                </label>
                <span className="text-[11px] text-[#86868B]">
                  {content.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200))} min read
                </span>
              </div>

              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your technological journey, breakthrough design decisions, challenges overcome, and insights for the ecosystem..."
                className="w-full p-4 text-sm text-[#1D1D1F] bg-black/[0.02] focus:bg-white rounded-2xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed font-sans"
              />
            </div>

          </div>
        ) : (
          /* Live Preview Tab */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-apple-card border border-black/[0.08] space-y-6">
            <div className="p-3 bg-[#0071E3]/10 rounded-2xl text-xs font-bold text-[#0071E3] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Live Article Preview</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1D1D1F]">
              {title || 'Untitled Article'}
            </h1>
            {subtitle && (
              <p className="text-lg text-[#86868B] font-medium">{subtitle}</p>
            )}

            {coverImageUrl && (
              <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-900">
                <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="pt-2">
              <MarkdownRenderer content={content || '*No content written yet. Start typing on the editor tab to see rich markdown preview here.*'} />
            </div>
          </div>
        )}

      </main>

      </div>
    </div>
  );
};
