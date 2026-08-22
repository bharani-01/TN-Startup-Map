import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  RotateCcw, 
  Eye, 
  PenTool, 
  ShieldCheck, 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Loader2,
  Building2
} from 'lucide-react';
import { BlogPost } from '../../../types';

export const AdminBlogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DELETED'>('ACTIVE');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (activeTab === 'DELETED') {
        query.set('includeDeleted', 'true');
      }
      if (categoryFilter !== 'all') {
        query.set('category', categoryFilter);
      }
      if (search.trim()) {
        query.set('search', search.trim());
      }
      query.set('status', 'all');

      const res = await fetch(`/api/blogs?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      } else {
        setError(data.message || 'Failed to load stories');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, categoryFilter, search]);

  const handleToggleFeature = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}/feature`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Spotlight status updated!');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft-delete this article?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Article soft-deleted.');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}/restore`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Article restored.');
        setTimeout(() => setActionSuccess(null), 3000);
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Stories & Blog Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, feature, curate, and moderate founder articles and ecosystem dispatches.
          </p>
        </div>

        <Link
          to="/blog/new"
          className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
        >
          <PenTool className="w-4 h-4" />
          <span>Write Official Story</span>
        </Link>
      </div>

      {/* Success Alert Banner */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Active vs Soft-Deleted Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'ACTIVE'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Stories
            </button>
            <button
              onClick={() => setActiveTab('DELETED')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'DELETED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Soft-Deleted / Archived
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles or authors..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 text-white focus:bg-white/10 rounded-lg border border-white/10 focus:outline-none focus:border-[#0071E3]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1c1c1e] text-white rounded-lg border border-white/10 focus:outline-none focus:border-[#0071E3] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Founder Stories">Founder Stories</option>
              <option value="DeepTech Insights">DeepTech Insights</option>
              <option value="Ecosystem News">Ecosystem News</option>
              <option value="Policy & Grants">Policy & Grants</option>
              <option value="Fundraising">Fundraising</option>
              <option value="Tech Architecture">Tech Architecture</option>
            </select>
          </div>

        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm border border-white/10">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-7 h-7 text-[#0071E3] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-400">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
            <p className="text-xs font-bold text-white">No articles in this view</p>
            <p className="text-[11px] text-slate-400">No stories found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author / Venture</th>
                  <th className="py-3.5 px-4 text-center">Claps</th>
                  <th className="py-3.5 px-4 text-center">Spotlight</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.03] transition-colors">
                    
                    {/* Article Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {b.coverImageUrl && (
                          <img
                            src={b.coverImageUrl}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg shrink-0 border border-white/10"
                          />
                        )}
                        <div className="truncate">
                          <Link
                            to={`/blog/${b.slug}`}
                            target="_blank"
                            className="font-bold text-white hover:text-[#0071E3] transition-colors line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <p className="text-[10px] text-slate-400">
                            {new Date(b.publishedAt).toLocaleDateString()} · {b.readTimeMinutes} min read
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0071E3]/15 text-blue-300 border border-[#0071E3]/25">
                        {b.category}
                      </span>
                    </td>

                    {/* Author & Startup */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <span>{b.authorName}</span>
                          {b.isFounder && (
                            <span title="Verified Founder">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        {b.startupName && (
                          <p className="text-[10px] text-[#0071E3] font-semibold flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {b.startupName}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Claps */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-white">
                        <ThumbsUp className="w-3 h-3 text-[#0071E3]" />
                        {b.clapsCount || 0}
                      </span>
                    </td>

                    {/* Featured / Spotlight Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      {activeTab === 'ACTIVE' && (
                        <button
                          onClick={() => handleToggleFeature(b.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            b.featured
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-white/5 text-slate-500 hover:text-white border border-white/10'
                          }`}
                          title={b.featured ? 'Featured on homepage' : 'Click to feature on homepage'}
                        >
                          <Star className={`w-4 h-4 ${b.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="View live article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {activeTab === 'ACTIVE' ? (
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Soft delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(b.id)}
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Restore article"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
