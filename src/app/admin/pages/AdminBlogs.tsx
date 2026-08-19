import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Eye, 
  PenTool, 
  ShieldCheck, 
  Star, 
  ThumbsUp, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Building2
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../../types';

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
        setBlogs(blogs.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b)));
        setActionSuccess('Article spotlight status updated');
        setTimeout(() => setActionSuccess(null), 2500);
      }
    } catch (err: any) {
      alert('Error updating feature status: ' + err.message);
    }
  };

  const handleSoftDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to soft-delete "${title}"? It can be restored at any time.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
        setActionSuccess(`Article "${title}" soft-deleted`);
        setTimeout(() => setActionSuccess(null), 2500);
      }
    } catch (err: any) {
      alert('Error deleting article: ' + err.message);
    }
  };

  const handleRestore = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}/restore`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
        setActionSuccess(`Article "${title}" restored to active directory`);
        setTimeout(() => setActionSuccess(null), 2500);
      }
    } catch (err: any) {
      alert('Error restoring article: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1D1D1F] font-display flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0071E3]" />
            <span>Stories & Blog Moderation</span>
          </h1>
          <p className="text-xs text-[#86868B]">
            Review, feature, curate, and moderate founder articles and ecosystem dispatches.
          </p>
        </div>

        <Link
          to="/blog/new"
          className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-apple-sm transition-all apple-press shrink-0"
        >
          <PenTool className="w-4 h-4" />
          <span>Write Official Story</span>
        </Link>
      </div>

      {/* Success Alert Banner */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-apple-card border border-black/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Active vs Soft-Deleted Tabs */}
          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ACTIVE'
                  ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Active Stories
            </button>
            <button
              onClick={() => setActiveTab('DELETED')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'DELETED'
                  ? 'bg-white text-rose-600 shadow-apple-sm'
                  : 'text-[#86868B] hover:text-rose-600'
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
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/[0.02] focus:bg-white rounded-xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              />
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-2.5" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-black/[0.02] rounded-xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
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
      <div className="bg-white rounded-3xl overflow-hidden shadow-apple-card border border-black/[0.08]">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-7 h-7 text-[#0071E3] animate-spin mx-auto" />
            <p className="text-xs text-[#86868B]">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-[#86868B] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#1D1D1F]">No articles in this view</p>
            <p className="text-[11px] text-[#86868B]">No stories found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/[0.02] border-b border-black/[0.06] text-[#86868B] font-bold">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author / Venture</th>
                  <th className="py-3 px-4 text-center">Claps</th>
                  <th className="py-3 px-4 text-center">Spotlight</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.01] transition-colors">
                    
                    {/* Article Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {b.coverImageUrl && (
                          <img
                            src={b.coverImageUrl}
                            alt=""
                            className="w-12 h-10 object-cover rounded-xl shrink-0 border border-black/[0.06]"
                          />
                        )}
                        <div className="truncate">
                          <Link
                            to={`/blog/${b.slug}`}
                            target="_blank"
                            className="font-bold text-[#1D1D1F] hover:text-[#0071E3] transition-colors line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <p className="text-[10px] text-[#86868B]">
                            {new Date(b.publishedAt).toLocaleDateString()} · {b.readTimeMinutes} min read
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                        {b.category}
                      </span>
                    </td>

                    {/* Author & Startup */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-[#1D1D1F]">
                          <span>{b.authorName}</span>
                          {b.isFounder && (
                            <span title="Verified Founder">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
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
                      <span className="inline-flex items-center gap-1 font-bold text-[#1D1D1F]">
                        <ThumbsUp className="w-3 h-3 text-[#0071E3]" />
                        {b.clapsCount || 0}
                      </span>
                    </td>

                    {/* Featured / Spotlight Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      {activeTab === 'ACTIVE' && (
                        <button
                          onClick={() => handleToggleFeature(b.id)}
                          className={`p-1.5 rounded-full transition-all apple-press ${
                            b.featured
                              ? 'bg-amber-400/20 text-amber-600'
                              : 'text-[#86868B] hover:text-amber-500 hover:bg-black/[0.04]'
                          }`}
                          title={b.featured ? 'Remove from Homepage Spotlight' : 'Pin to Homepage Spotlight'}
                        >
                          <Star className={`w-4 h-4 ${b.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#86868B] hover:text-[#0071E3] hover:bg-black/[0.04]"
                          title="View Live Article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {activeTab === 'ACTIVE' ? (
                          <button
                            onClick={() => handleSoftDelete(b.id, b.title)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Soft-Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(b.id, b.title)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-1 font-bold text-[11px]"
                            title="Restore Soft-Deleted Article"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
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
