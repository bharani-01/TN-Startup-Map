import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, Star, Search, Filter, CheckCircle2, AlertCircle, 
  RefreshCw, Check, Clock, Globe, User, MessageCircle, Sparkles, ChevronDown 
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
      console.error('Failed to fetch feedbacks:', err);
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
      { threshold: 0.2 }
    );

    const current = observerTarget.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading, loadingMore, fetchFeedbacks]);

  const handleToggleResolve = async (item: FeedbackItem) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newStatus = !item.isResolved;

      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isResolved: newStatus }),
      });

      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, isResolved: newStatus } : f))
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to toggle resolve:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;
    setIsUpdating(true);
    try {
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
      console.error('Failed to save notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono font-bold text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          {rating}.0
        </span>
      );
    }
    if (rating === 3) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-mono font-bold text-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {rating}.0
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 font-mono font-bold text-xs flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        {rating}.0
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apple-text tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-apple-blue" />
            User Feedback & CSAT Intelligence
          </h1>
          <p className="text-sm text-apple-secondary mt-1">
            Real-time sentiment and feedback submitted by returning users & ecosystem explorers
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchFeedbacks(true);
          }}
          className="px-4 py-2 rounded-2xl bg-white border border-apple-border text-apple-text text-sm font-semibold hover:bg-apple-card shadow-apple-subtle transition-all flex items-center gap-2 cursor-pointer self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Average CSAT Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-apple-text font-display">
              {stats?.averageRating || '5.0'}
            </span>
            <span className="text-sm font-semibold text-amber-500">/ 5.0</span>
          </div>
          <p className="text-xs text-apple-secondary">Based on {stats?.totalFeedback || 0} user responses</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-apple-text font-display">
              {stats?.totalFeedback || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">All-time visitor feedback</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Needs Review / Open
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-display">
              {stats?.unresolvedCount || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Pending action or review</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Resolved Items
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-display">
              {stats?.resolvedCount || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Addressed feedback & suggestions</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-apple-border shadow-apple-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-apple-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback text, email..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs text-apple-text placeholder:text-apple-secondary focus:outline-none focus:border-apple-blue transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars (Exceptional)</option>
            <option value="4">4 Stars (Great)</option>
            <option value="3">3 Stars (Good)</option>
            <option value="2">2 Stars (Needs Work)</option>
            <option value="1">1 Star (Poor)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="GENERAL">General Experience</option>
            <option value="DATA_ACCURACY">Data Accuracy</option>
            <option value="FEATURE_REQUEST">Feature Request</option>
            <option value="USER_EXPERIENCE">Design & Speed</option>
            <option value="HIRING_PORTAL">Job Portal</option>
          </select>

          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNRESOLVED">Pending Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

      </div>

      {/* Feedback Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-apple-secondary text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-apple-blue" />
            Loading user feedback...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-apple-border text-apple-secondary text-sm">
            No feedback found matching the current filters.
          </div>
        ) : (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all space-y-3 shadow-apple-subtle ${
                item.isResolved ? 'border-apple-border opacity-75' : 'border-black/[0.08]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getRatingBadge(item.rating)}

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/[0.04] text-[#515154]">
                    {item.category.replace('_', ' ')}
                  </span>

                  {item.isResolved ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      RESOLVED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      PENDING
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setAdminNoteInput(item.adminNotes || '');
                    }}
                    className="px-3 py-1.5 rounded-full bg-apple-card hover:bg-black/[0.06] text-xs font-semibold text-apple-text border border-apple-border transition-all cursor-pointer"
                  >
                    {item.adminNotes ? 'Edit Notes' : 'Add Note'}
                  </button>

                  <button
                    onClick={() => handleToggleResolve(item)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      item.isResolved
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-apple-sm'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {item.isResolved ? 'Reopen' : 'Mark Resolved'}
                  </button>
                </div>
              </div>

              {/* Message Content */}
              {item.message ? (
                <p className="text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap bg-black/[0.015] p-3.5 rounded-2xl border border-black/[0.04]">
                  "{item.message}"
                </p>
              ) : (
                <p className="text-xs text-apple-secondary italic">
                  No text comment provided (rating only)
                </p>
              )}

              {/* Admin Notes Preview */}
              {item.adminNotes && (
                <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                  <span className="font-bold">Admin Note:</span> {item.adminNotes}
                </div>
              )}

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-apple-secondary pt-1 border-t border-black/[0.04]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleString()}
                </span>

                {item.userEmail && (
                  <span className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                    <User className="w-3.5 h-3.5 text-apple-blue" />
                    {item.userEmail}
                  </span>
                )}

                {item.pageUrl && (
                  <span className="flex items-center gap-1 truncate max-w-xs text-apple-blue">
                    <Globe className="w-3.5 h-3.5" />
                    {item.pageUrl.replace(/^https?:\/\/[^/]+/, '')}
                  </span>
                )}
              </div>

            </div>
          ))
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="py-4 text-center">
          {loadingMore && (
            <p className="text-xs text-apple-secondary flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-apple-blue" />
              Loading more feedback...
            </p>
          )}
        </div>
      </div>

      {/* Admin Notes Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-apple-border shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-base text-[#1D1D1F]">
              Admin Notes for Feedback
            </h3>
            <p className="text-xs text-[#86868B]">
              Internal notes for tracking action items, founder outreach, or bug fixes.
            </p>

            <textarea
              value={adminNoteInput}
              onChange={(e) => setAdminNoteInput(e.target.value)}
              placeholder="e.g. Added startup to queue, emailed user on 23 Aug..."
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-apple-card border border-apple-border text-xs text-apple-text placeholder:text-apple-secondary focus:outline-none focus:border-apple-blue transition-all"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-apple-secondary hover:bg-apple-card transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveNotes}
                className="px-5 py-2 rounded-full bg-apple-blue text-white text-xs font-semibold hover:bg-[#0077ED] shadow-apple-sm transition-all cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
