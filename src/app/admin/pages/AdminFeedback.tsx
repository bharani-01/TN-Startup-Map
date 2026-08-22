import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, Star, Search, CheckCircle2, AlertCircle, 
  RefreshCw, Check, Clock, Globe, User, MessageCircle, ChevronDown, X
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  message?: string;
  userEmail?: string;
  pageUrl?: string;
  userAgent?: string;
  isResolved: boolean;
  adminNotes?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
    profile?: { displayName?: string; avatarUrl?: string };
  };
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  resolvedCount: number;
  unresolvedCount: number;
  categoryBreakdown: { category: string; count: number }[];
}

export const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [resolvedFilter, setResolvedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected feedback for notes modal
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const LIMIT = 30;

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/admin/feedback/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch feedback stats:', err);
    }
  };

  const fetchFeedbacks = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: offsetRef.current.toString(),
      });

      if (ratingFilter !== 'ALL') params.append('rating', ratingFilter.toString());
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (resolvedFilter !== 'ALL') params.append('isResolved', (resolvedFilter === 'RESOLVED').toString());
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        const newItems: FeedbackItem[] = json.data.feedbacks || [];
        const total = json.data.total || 0;
        setTotalCount(total);

        if (isInitial) {
          setFeedbacks(newItems);
        } else {
          setFeedbacks((prev) => [...prev, ...newItems]);
        }

        offsetRef.current += newItems.length;
        setHasMore(offsetRef.current < total);
      }
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [ratingFilter, categoryFilter, resolvedFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
    fetchFeedbacks(true);
  }, [fetchFeedbacks]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchFeedbacks(false);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchFeedbacks]);

  const handleToggleResolve = async (item: FeedbackItem) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isResolved: !item.isResolved }),
      });

      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, isResolved: !item.isResolved } : f))
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to toggle feedback status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/admin/feedback/${selectedItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes: adminNoteInput }),
      });

      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === selectedItem.id ? { ...f, adminNotes: adminNoteInput } : f))
        );
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Failed to save admin notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          {rating}.0
        </span>
      );
    }
    if (rating === 3) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-bold text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {rating}.0
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-xs flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
        {rating}.0
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#0071E3]" />
            <span>User Feedback & CSAT Intelligence</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time sentiment and feedback submitted by returning users & ecosystem explorers
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchFeedbacks(true);
          }}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Average CSAT Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.averageRating || '5.0'}
            </span>
            <span className="text-sm font-semibold text-amber-400">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-400">Based on {stats?.totalFeedback || 0} user responses</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.totalFeedback || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">All-time visitor feedback</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Needs Review / Open
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">
              {stats?.unresolvedCount || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Pending action or review</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Resolved Items
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {stats?.resolvedCount || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Addressed feedback & suggestions</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback text, email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0071E3] transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Ratings</option>
            <option value="5" className="bg-[#1c1c1e]">5 Stars (Excellent)</option>
            <option value="4" className="bg-[#1c1c1e]">4 Stars (Good)</option>
            <option value="3" className="bg-[#1c1c1e]">3 Stars (Average)</option>
            <option value="2" className="bg-[#1c1c1e]">2 Stars (Poor)</option>
            <option value="1" className="bg-[#1c1c1e]">1 Star (Bad)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Categories</option>
            <option value="General Experience" className="bg-[#1c1c1e]">General Experience</option>
            <option value="Data Correction" className="bg-[#1c1c1e]">Data Correction</option>
            <option value="Feature Request" className="bg-[#1c1c1e]">Feature Request</option>
            <option value="Design & Usability" className="bg-[#1c1c1e]">Design & Usability</option>
            <option value="Job Portal" className="bg-[#1c1c1e]">Job Portal</option>
            <option value="Performance & Speed" className="bg-[#1c1c1e]">Performance & Speed</option>
          </select>

          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Statuses</option>
            <option value="UNRESOLVED" className="bg-[#1c1c1e]">Pending Review</option>
            <option value="RESOLVED" className="bg-[#1c1c1e]">Resolved</option>
          </select>
        </div>
      </div>

      {/* Feedback Stream List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm bg-[#1c1c1e] rounded-2xl border border-white/10">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0071E3]" />
            <span>Loading user feedback...</span>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="py-16 text-center bg-[#1c1c1e] rounded-2xl border border-white/10 text-slate-400 text-sm space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No feedback found matching the current filters.</p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-2xl bg-[#1c1c1e] border transition-all space-y-3 shadow-sm ${
                item.isResolved ? 'border-white/10 opacity-75' : 'border-[#0071E3]/40 bg-[#0071E3]/[0.02]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {getRatingBadge(item.rating)}

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                    {item.category}
                  </span>

                  {item.userEmail && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {item.userEmail}
                    </span>
                  )}

                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setAdminNoteInput(item.adminNotes || '');
                    }}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.adminNotes ? 'Edit Notes' : 'Add Note'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleResolve(item)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      item.isResolved
                        ? 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.isResolved ? 'Reopen' : 'Mark Resolved'}</span>
                  </button>
                </div>
              </div>

              {/* Message Content */}
              {item.message ? (
                <p className="text-sm text-slate-200 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5 font-sans">
                  "{item.message}"
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">No written comment provided.</p>
              )}

              {/* Footer Meta & Internal Admin Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-500">
                {item.pageUrl && (
                  <span className="flex items-center gap-1 truncate max-w-md font-mono text-[10px]">
                    <Globe className="w-3 h-3 shrink-0" />
                    {item.pageUrl}
                  </span>
                )}

                {item.adminNotes && (
                  <div className="bg-amber-400/10 border border-amber-400/20 text-amber-300 px-3 py-1 rounded-md text-xs">
                    <strong className="font-semibold text-amber-200">Admin Note:</strong> {item.adminNotes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Sentinel for Infinite Scroll */}
        <div ref={observerTarget} className="py-4 text-center">
          {loadingMore && (
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono bg-[#1c1c1e] px-4 py-2 rounded-lg border border-white/10">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0071E3]" />
              <span>Loading more feedback...</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Notes Dialog Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1c1c1e] text-white rounded-2xl border border-white/20 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0071E3]" />
                <span>Internal Feedback Note</span>
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Add internal comments, action items, or data corrections regarding feedback from{' '}
              <strong className="text-white">{selectedItem.userEmail || 'Anonymous Visitor'}</strong>.
            </p>

            <textarea
              rows={4}
              value={adminNoteInput}
              onChange={(e) => setAdminNoteInput(e.target.value)}
              placeholder="e.g. Fixed wrong revenue figure for AgniKul Cosmos on 23 Aug."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0071E3] transition-colors"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
