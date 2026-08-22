import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AlertTriangle, Bug, ShieldAlert, CheckCircle, Search, RefreshCw, 
  Clock, Terminal, Copy, Check, ChevronDown, ChevronUp, User, Globe, AlertCircle 
} from 'lucide-react';

interface ErrorLogItem {
  id: string;
  source: 'BACKEND' | 'FRONTEND';
  severity: 'CRITICAL' | 'ERROR' | 'WARNING';
  message: string;
  stackTrace?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  isResolved: boolean;
  adminNotes?: string;
  createdAt: string;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  warningErrors: number;
  resolvedErrors: number;
  unresolvedErrors: number;
  backendErrors: number;
  frontendErrors: number;
}

export const AdminErrorLogs: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLogItem[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [resolvedFilter, setResolvedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded stack trace map
  const [expandedStacks, setExpandedStacks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const LIMIT = 30;

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/admin/errors/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch error stats:', err);
    }
  };

  const fetchErrors = useCallback(async (isInitial = false) => {
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

      if (severityFilter !== 'ALL') params.append('severity', severityFilter);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      if (resolvedFilter !== 'ALL') params.append('isResolved', (resolvedFilter === 'RESOLVED').toString());
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/errors?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        const newItems: ErrorLogItem[] = json.data.errors || [];
        const total = json.data.total || 0;
        setTotalCount(total);

        if (isInitial) {
          setErrors(newItems);
        } else {
          setErrors((prev) => [...prev, ...newItems]);
        }

        offsetRef.current += newItems.length;
        setHasMore(offsetRef.current < total);
      }
    } catch (err) {
      console.error('Failed to fetch error logs:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [severityFilter, sourceFilter, resolvedFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
    fetchErrors(true);
  }, [fetchErrors]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchErrors(false);
        }
      },
      { threshold: 0.2 }
    );

    const current = observerTarget.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading, loadingMore, fetchErrors]);

  const handleToggleResolve = async (item: ErrorLogItem) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newStatus = !item.isResolved;

      const res = await fetch(`/api/admin/errors/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isResolved: newStatus }),
      });

      if (res.ok) {
        setErrors((prev) =>
          prev.map((e) => (e.id === item.id ? { ...e, isResolved: newStatus } : e))
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to toggle error resolution:', err);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStack = (id: string) => {
    setExpandedStacks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200">
            ERROR
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-apple-text tracking-tight flex items-center gap-2.5">
            <Bug className="w-6 h-6 text-rose-500" />
            Full-Stack Error & Crash Triage
          </h1>
          <p className="text-sm text-apple-secondary mt-1">
            Real-time capture of backend exceptions, 500 status codes, and uncaught frontend JavaScript crashes
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchErrors(true);
          }}
          className="px-4 py-2 rounded-2xl bg-white border border-apple-border text-apple-text text-sm font-semibold hover:bg-apple-card shadow-apple-subtle transition-all flex items-center gap-2 cursor-pointer self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Unresolved Crashes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 font-display">
              {stats?.unresolvedErrors || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Require investigation</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Critical Severity (5xx)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-display">
              {stats?.criticalErrors || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Fatal server exceptions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Frontend Crashes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-apple-text font-display">
              {stats?.frontendErrors || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Client-side JS uncaught errors</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-apple-border shadow-apple-subtle space-y-2">
          <span className="text-xs font-semibold text-apple-secondary uppercase tracking-wider block">
            Resolved Incidents
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-display">
              {stats?.resolvedErrors || 0}
            </span>
          </div>
          <p className="text-xs text-apple-secondary">Marked fixed by admin</p>
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
            placeholder="Search error message, route, trace..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs text-apple-text placeholder:text-apple-secondary focus:outline-none focus:border-apple-blue transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="ERROR">Error</option>
            <option value="WARNING">Warning</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sources</option>
            <option value="BACKEND">Backend (API/DB)</option>
            <option value="FRONTEND">Frontend (Client JS)</option>
          </select>

          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-apple-card border border-apple-border text-xs font-semibold text-apple-text focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNRESOLVED">Pending / Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

      </div>

      {/* Error Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-apple-secondary text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
            Loading system error logs...
          </div>
        ) : errors.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-apple-border text-apple-secondary text-sm">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No system error logs found. All systems operating cleanly!
          </div>
        ) : (
          errors.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all space-y-3 shadow-apple-subtle ${
                item.isResolved ? 'border-apple-border opacity-70' : 'border-rose-200/80 bg-rose-50/[0.02]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {getSeverityBadge(item.severity)}

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    item.source === 'BACKEND' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {item.source}
                  </span>

                  {item.statusCode && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      HTTP {item.statusCode}
                    </span>
                  )}

                  {item.method && item.route && (
                    <span className="text-xs font-mono font-semibold text-slate-900">
                      {item.method} {item.route}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleResolve(item)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      item.isResolved
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {item.isResolved ? 'Reopen' : 'Mark Resolved'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-200/50 text-xs font-mono font-semibold text-rose-900 leading-relaxed">
                {item.message}
              </div>

              {/* Collapsible Stack Trace */}
              {item.stackTrace && (
                <div className="space-y-1.5">
                  <button
                    onClick={() => toggleStack(item.id)}
                    className="text-xs font-semibold text-apple-blue hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {expandedStacks[item.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expandedStacks[item.id] ? 'Hide Stack Trace' : 'View Full Stack Trace'}
                  </button>

                  {expandedStacks[item.id] && (
                    <div className="relative mt-2 p-4 rounded-2xl bg-[#1c1c1e] text-slate-200 text-[11px] font-mono leading-relaxed overflow-x-auto border border-white/10 shadow-inner">
                      <button
                        onClick={() => copyToClipboard(item.id, item.stackTrace || '')}
                        className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                        title="Copy Stack Trace"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <pre className="pr-16">{item.stackTrace}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-apple-secondary pt-1 border-t border-black/[0.04]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleString()}
                </span>

                {item.actorEmail && (
                  <span className="flex items-center gap-1 font-medium text-[#1D1D1F]">
                    <User className="w-3.5 h-3.5 text-apple-blue" />
                    {item.actorEmail} ({item.actorRole || 'ANON'})
                  </span>
                )}

                {item.ipAddress && (
                  <span className="font-mono text-[10px]">
                    IP: {item.ipAddress}
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
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
              Loading more error logs...
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
