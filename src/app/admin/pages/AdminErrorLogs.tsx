import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bug, AlertTriangle, Search, Filter, CheckCircle, AlertCircle, 
  RefreshCw, Check, Clock, Globe, User, Terminal, ChevronDown, ChevronUp, Copy, X 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

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

interface ErrorLogStats {
  totalErrors: number;
  unresolvedErrors: number;
  criticalErrors: number;
  backendErrors: number;
  frontendErrors: number;
  resolvedErrors: number;
}

export const AdminErrorLogs: React.FC = () => {
  const { token } = useAuth();
  const [errors, setErrors] = useState<ErrorLogItem[]>([]);
  const [stats, setStats] = useState<ErrorLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [resolvedFilter, setResolvedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable Stack Trace State
  const [expandedStacks, setExpandedStacks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Notes Modal State
  const [selectedError, setSelectedError] = useState<ErrorLogItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const LIMIT = 30;

  const fetchStats = async () => {
    try {
      const authToken = token || localStorage.getItem('tn_token');
      const res = await fetch('/api/admin/errors/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
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

      const authToken = token || localStorage.getItem('tn_token');
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: offsetRef.current.toString(),
      });

      if (severityFilter !== 'ALL') params.append('severity', severityFilter);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      if (resolvedFilter !== 'ALL') params.append('isResolved', (resolvedFilter === 'RESOLVED').toString());
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/errors?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
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
      console.error('Failed to fetch errors:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, severityFilter, sourceFilter, resolvedFilter, searchQuery]);

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
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchErrors]);

  const handleToggleResolve = async (item: ErrorLogItem) => {
    try {
      const authToken = token || localStorage.getItem('tn_token');
      const res = await fetch(`/api/admin/errors/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isResolved: !item.isResolved }),
      });

      if (res.ok) {
        setErrors((prev) =>
          prev.map((e) => (e.id === item.id ? { ...e, isResolved: !item.isResolved } : e))
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to toggle error resolution:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedError) return;
    try {
      setIsUpdating(true);
      const authToken = token || localStorage.getItem('tn_token');
      const res = await fetch(`/api/admin/errors/${selectedError.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ adminNotes: adminNoteInput }),
      });

      if (res.ok) {
        setErrors((prev) =>
          prev.map((e) => (e.id === selectedError.id ? { ...e, adminNotes: adminNoteInput } : e))
        );
        setSelectedError(null);
      }
    } catch (err) {
      console.error('Failed to save triage notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyStackTrace = (id: string, trace: string) => {
    navigator.clipboard.writeText(trace);
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
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            ERROR
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bug className="w-6 h-6 text-rose-400" />
            <span>Full-Stack Error & Crash Triage</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time capture of backend exceptions, 500 status codes, and uncaught frontend JavaScript crashes
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchErrors(true);
          }}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Unresolved Crashes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">
              {stats?.unresolvedErrors || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Require investigation</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Critical Severity (5xx)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">
              {stats?.criticalErrors || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Fatal server exceptions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Frontend Crashes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.frontendErrors || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Client-side JS uncaught errors</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Resolved Incidents
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {stats?.resolvedErrors || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400">Marked fixed by admin</p>
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
            placeholder="Search error message, route, trace..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0071E3] transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Severities</option>
            <option value="CRITICAL" className="bg-[#1c1c1e]">Critical Only</option>
            <option value="ERROR" className="bg-[#1c1c1e]">Error</option>
            <option value="WARNING" className="bg-[#1c1c1e]">Warning</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Sources</option>
            <option value="BACKEND" className="bg-[#1c1c1e]">Backend (API/DB)</option>
            <option value="FRONTEND" className="bg-[#1c1c1e]">Frontend (Client JS)</option>
          </select>

          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
          >
            <option value="ALL" className="bg-[#1c1c1e]">All Statuses</option>
            <option value="UNRESOLVED" className="bg-[#1c1c1e]">Pending / Open</option>
            <option value="RESOLVED" className="bg-[#1c1c1e]">Resolved</option>
          </select>
        </div>

      </div>

      {/* Error Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm bg-[#1c1c1e] rounded-2xl border border-white/10">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-400" />
            <span>Loading system error logs...</span>
          </div>
        ) : errors.length === 0 ? (
          <div className="py-16 text-center bg-[#1c1c1e] rounded-2xl border border-white/10 text-slate-400 text-sm space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>No system error logs found. All systems operating cleanly!</p>
          </div>
        ) : (
          errors.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-2xl bg-[#1c1c1e] border transition-all space-y-3 shadow-sm ${
                item.isResolved ? 'border-white/10 opacity-70' : 'border-rose-500/30 bg-rose-500/[0.02]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {getSeverityBadge(item.severity)}

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    item.source === 'BACKEND' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {item.source}
                  </span>

                  {item.statusCode && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                      HTTP {item.statusCode}
                    </span>
                  )}

                  {item.method && item.route && (
                    <span className="text-xs font-mono font-semibold text-white">
                      {item.method} {item.route}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedError(item);
                      setAdminNoteInput(item.adminNotes || '');
                    }}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    <span>{item.adminNotes ? 'Edit Notes' : 'Triage Note'}</span>
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

              {/* Error Message */}
              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 font-mono text-xs text-rose-300 break-words">
                {item.message}
              </div>

              {/* Stack Trace Collapsible */}
              {item.stackTrace && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleStack(item.id)}
                      className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{expandedStacks[item.id] ? 'Hide Stack Trace' : 'View Full Stack Trace'}</span>
                      {expandedStacks[item.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedStacks[item.id] && (
                      <button
                        onClick={() => copyStackTrace(item.id, item.stackTrace!)}
                        className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy Trace'}</span>
                      </button>
                    )}
                  </div>

                  {expandedStacks[item.id] && (
                    <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
                      {item.stackTrace}
                    </pre>
                  )}
                </div>
              )}

              {/* Context Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-500 font-mono">
                <div className="flex flex-wrap items-center gap-3">
                  {item.actorEmail && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <User className="w-3 h-3" />
                      {item.actorEmail} ({item.actorRole || 'USER'})
                    </span>
                  )}
                  {item.ipAddress && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {item.ipAddress}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>

                {item.adminNotes && (
                  <div className="bg-amber-400/10 border border-amber-400/20 text-amber-300 px-3 py-1 rounded-md text-xs font-sans">
                    <strong className="font-semibold text-amber-200">Triage Note:</strong> {item.adminNotes}
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
              <span>Loading more error logs...</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Notes Dialog Modal */}
      {selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1c1c1e] text-white rounded-2xl border border-white/20 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-400" />
                <span>Error Triage Note</span>
              </h3>
              <button
                onClick={() => setSelectedError(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Add internal investigation notes, hotfix PR links, or resolution status.
            </p>

            <textarea
              rows={4}
              value={adminNoteInput}
              onChange={(e) => setAdminNoteInput(e.target.value)}
              placeholder="e.g. Fixed null check in AuditLogRepository. Verified on staging."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0071E3] transition-colors font-mono"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSelectedError(null)}
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
