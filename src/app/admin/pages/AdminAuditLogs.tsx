import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Activity,
  Search,
  Loader2,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Zap,
  Globe,
  User,
  ExternalLink,
  ChevronDown,
  X,
  Code,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ApiLogItem {
  id: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
  ipAddress?: string;
  userAgent?: string;
  queryParams?: Record<string, any>;
  createdAt: string;
}

interface AuditStats {
  totalRequests: number;
  errorRequests: number;
  successRate: number;
  avgLatencyMs: number;
}

const PAGE_SIZE = 30;

export const AdminAuditLogs: React.FC = () => {
  const { token } = useAuth();

  const [logs, setLogs] = useState<ApiLogItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState<AuditStats | null>(null);
  
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Log for JSON detail modal
  const [selectedLog, setSelectedLog] = useState<ApiLogItem | null>(null);

  // Sentinel ref for infinite scroll observer
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch telemetry overview stats (once or on manual refresh)
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit-logs/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, [token]);

  // Fetch a page of logs
  const fetchLogs = useCallback(
    async (offset: number, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setInitialLoading(true);
      }

      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (methodFilter) params.set('method', methodFilter);
        if (roleFilter) params.set('role', roleFilter);
        if (statusFilter) params.set('statusCode', statusFilter);
        params.set('limit', String(PAGE_SIZE));
        params.set('offset', String(offset));

        const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data) {
          const newLogs: ApiLogItem[] = data.data.logs || [];
          const totalCount: number = data.data.total || 0;

          setTotal(totalCount);
          setLogs((prev) => (append ? [...prev, ...newLogs] : newLogs));
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, methodFilter, roleFilter, statusFilter, token]
  );

  // Reset and load page 0 whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
      fetchLogs(0, false);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchLogs, fetchStats]);

  const hasMore = logs.length < total;

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !initialLoading && hasMore) {
      fetchLogs(logs.length, true);
    }
  }, [loadingMore, initialLoading, hasMore, logs.length, fetchLogs]);

  // Scroll-based Intersection Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !initialLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, initialLoading, handleLoadMore]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setMethodFilter('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const getMethodBadge = (m: string) => {
    switch (m.toUpperCase()) {
      case 'GET':
        return 'bg-[#0071E3]/20 text-[#0071E3] border-[#0071E3]/30';
      case 'POST':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    if (code >= 400 && code < 500) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/20 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/30 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Security & API Access Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            API Route Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Infinite scroll live monitor of route requests, caller identities, latency performance, and response status codes.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            fetchLogs(0, false);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all apple-press self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-1.5 shadow-apple-card">
          <span className="text-xs font-semibold text-slate-400 block">Total Requests</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {stats?.totalRequests ?? 0}
          </div>
          <p className="text-[11px] font-mono text-slate-400">Total logged API hits</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-1.5 shadow-apple-card">
          <span className="text-xs font-semibold text-slate-400 block">Average Latency</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">
            {stats?.avgLatencyMs ?? 0}ms
          </div>
          <p className="text-[11px] font-mono text-slate-400">Average response time</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-1.5 shadow-apple-card">
          <span className="text-xs font-semibold text-slate-400 block">Success Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#0071E3]">
            {stats?.successRate ?? 100}%
          </div>
          <p className="text-[11px] font-mono text-slate-400">Healthy 2xx responses</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-1.5 shadow-apple-card">
          <span className="text-xs font-semibold text-slate-400 block">Error Volume</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-rose-400">
            {stats?.errorRequests ?? 0}
          </div>
          <p className="text-[11px] font-mono text-slate-400">4xx / 5xx error events</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route (e.g. /api/startups), actor email, IP address..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:bg-white/10 focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-2xl text-white outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1c1c1e]">All Methods</option>
              <option value="GET" className="bg-[#1c1c1e]">GET</option>
              <option value="POST" className="bg-[#1c1c1e]">POST</option>
              <option value="PUT" className="bg-[#1c1c1e]">PUT</option>
              <option value="DELETE" className="bg-[#1c1c1e]">DELETE</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-2xl text-white outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1c1c1e]">All Roles</option>
              <option value="ADMIN" className="bg-[#1c1c1e]">Admin</option>
              <option value="FOUNDER" className="bg-[#1c1c1e]">Founder</option>
              <option value="USER" className="bg-[#1c1c1e]">User</option>
              <option value="ANONYMOUS" className="bg-[#1c1c1e]">Anonymous</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-2xl text-white outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1c1c1e]">All Statuses</option>
              <option value="200" className="bg-[#1c1c1e]">200 OK</option>
              <option value="400" className="bg-[#1c1c1e]">400 Bad Request</option>
              <option value="401" className="bg-[#1c1c1e]">401 Unauthorized</option>
              <option value="403" className="bg-[#1c1c1e]">403 Forbidden</option>
              <option value="404" className="bg-[#1c1c1e]">404 Not Found</option>
              <option value="500" className="bg-[#1c1c1e]">500 Error</option>
            </select>

            {(searchQuery || methodFilter || roleFilter || statusFilter) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Pagination Counter Badge */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <span>
            Loaded <strong className="text-white">{logs.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total access records
          </span>
          <span className="text-[#0071E3] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-ping" />
            <span>Scroll-based auto streaming active</span>
          </span>
        </div>
      </div>

      {/* Logs Table */}
      {initialLoading ? (
        <div className="p-16 rounded-3xl bg-[#1c1c1e] border border-white/5 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Initializing API access audit stream...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#1c1c1e] border border-white/5 text-center space-y-3">
          <Activity className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No access logs found</h3>
          <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
          {(searchQuery || methodFilter || roleFilter || statusFilter) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#1c1c1e] border border-white/10 overflow-hidden shadow-apple-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Method & Route</th>
                    <th className="py-3.5 px-4">Actor / Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Latency</th>
                    <th className="py-3.5 px-4">Client IP</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getMethodBadge(log.method)}`}>
                            {log.method}
                          </span>
                          <span className="font-bold text-white group-hover:text-[#0071E3] transition-colors truncate max-w-xs">
                            {log.route}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{log.actorEmail || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                          {log.actorRole || 'ANON'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(log.statusCode)}`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={log.durationMs > 200 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {log.durationMs}ms
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {log.ipAddress || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour12: false })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white text-[10px] font-mono transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Sentinel & Infinite Scroll Trigger */}
          <div ref={sentinelRef} className="py-4 text-center">
            {loadingMore ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1e] border border-white/10 text-white text-xs font-mono">
                <Loader2 className="w-4 h-4 text-[#0071E3] animate-spin" />
                <span>Loading more audit records...</span>
              </div>
            ) : hasMore ? (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all apple-press cursor-pointer"
              >
                <span>Load Next {Math.min(PAGE_SIZE, total - logs.length)} Records</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-slate-500 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>All {total} audit records loaded</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1c1c1e] rounded-3xl border border-white/15 w-full max-w-2xl overflow-hidden shadow-apple-modal space-y-5 p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-[#0071E3]" />
                <h3 className="text-base font-bold font-display text-white">
                  API Request Audit Inspector
                </h3>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Top Row Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">METHOD</span>
                  <span className="font-bold text-white">{selectedLog.method}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">STATUS</span>
                  <span className="font-bold text-emerald-400">{selectedLog.statusCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">LATENCY</span>
                  <span className="font-bold text-white">{selectedLog.durationMs}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CALLER ROLE</span>
                  <span className="font-bold text-purple-300">{selectedLog.actorRole || 'ANON'}</span>
                </div>
              </div>

              {/* Endpoint & User Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-slate-400">Endpoint Route:</span>
                  <span className="font-mono font-bold text-white">{selectedLog.route}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-slate-400">Caller Identity:</span>
                  <span className="font-semibold text-white">{selectedLog.actorEmail || 'Anonymous Guest'}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-slate-400">Client IP Address:</span>
                  <span className="font-mono text-slate-300">{selectedLog.ipAddress || 'Not captured'}</span>
                </div>

                {selectedLog.userAgent && (
                  <div className="p-3 rounded-2xl bg-white/5 space-y-1">
                    <span className="text-slate-400 block">User-Agent:</span>
                    <p className="font-mono text-[11px] text-slate-300 break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
              </div>

              {/* Sanitized Query Params */}
              {selectedLog.queryParams && Object.keys(selectedLog.queryParams).length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-mono block">Query Parameters</span>
                  <pre className="p-4 rounded-2xl bg-black/40 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    {JSON.stringify(selectedLog.queryParams, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
