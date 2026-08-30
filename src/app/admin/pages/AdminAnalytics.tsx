import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  ExternalLink,
  Globe,
  Activity,
  Layers,
  Sparkles,
  Loader2,
  RefreshCw,
  BarChart3,
  Compass,
  FileText,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface DailyDataPoint {
  date: string;
  views: number;
  clicks: number;
}

interface TopStartup {
  id: string;
  name: string;
  slug: string;
  views: number;
  district?: string;
}

interface TopPage {
  path: string;
  views: number;
  percentage: number;
}

interface TopOutbound {
  eventType: string;
  targetUrl?: string;
  count: number;
}

interface RecentEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  targetUrl?: string;
  createdAt: string;
}

interface AnalyticsData {
  totalVisits: number;
  allTimeVisits: number;
  todayVisits: number;
  yesterdayVisits: number;
  uniqueVisitors: number;
  totalOutboundClicks: number;
  clickThroughRate: number;
  dailyTimeSeries: DailyDataPoint[];
  topStartups: TopStartup[];
  topPages: TopPage[];
  topOutbound: TopOutbound[];
  recentEvents: RecentEvent[];
}

export const AdminAnalytics: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<DailyDataPoint | null>(null);

  const fetchAnalytics = async (selectedDays: number = days, isManual: boolean = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const res = await fetch(`/api/admin/analytics?days=${selectedDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [token, days]);

  // SVG Chart computation
  const chartData = useMemo(() => {
    if (!data?.dailyTimeSeries || data.dailyTimeSeries.length === 0) return null;
    const series = data.dailyTimeSeries;
    const maxViews = Math.max(...series.map((d) => d.views), 5);
    const maxClicks = Math.max(...series.map((d) => d.clicks), 5);
    const chartHeight = 160;
    const chartWidth = 700;
    const step = chartWidth / (series.length - 1 || 1);

    const viewsPoints = series.map((d, i) => {
      const x = i * step;
      const y = chartHeight - (d.views / maxViews) * (chartHeight - 30) - 15;
      return { x, y, data: d };
    });

    const clicksPoints = series.map((d, i) => {
      const x = i * step;
      const y = chartHeight - (d.clicks / maxClicks) * (chartHeight - 30) - 15;
      return { x, y, data: d };
    });

    const viewsPath = viewsPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
    const viewsArea = `${viewsPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    const clicksPath = clicksPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

    return {
      series,
      maxViews,
      chartHeight,
      chartWidth,
      viewsPoints,
      clicksPoints,
      viewsPath,
      viewsArea,
      clicksPath,
    };
  }, [data]);

  const todayDiff = (data?.todayVisits || 0) - (data?.yesterdayVisits || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Platform Traffic & Visits Telemetry
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0071E3]/20 text-[#0071E3] border border-[#0071E3]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking of portal visitors, page views, verified startup impressions, and outbound clicks.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="p-1 bg-white/5 rounded-xl border border-white/10 flex items-center gap-1 text-xs">
            {[
              { label: '7 Days', val: 7 },
              { label: '30 Days', val: 30 },
              { label: '90 Days', val: 90 },
            ].map((t) => (
              <button
                key={t.val}
                type="button"
                onClick={() => setDays(t.val)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  days === t.val
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchAnalytics(days, true)}
            disabled={isRefreshing || loading}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0071E3]' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Aggregating ecosystem visit telemetry...</p>
        </div>
      ) : (
        <>
          {/* Main Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Visits Card */}
            <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Visits ({days}d)</span>
                <div className="p-2 rounded-lg bg-[#0071E3]/10">
                  <Eye className="w-4 h-4 text-[#0071E3]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {(data?.totalVisits ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>All-time total:</span>
                <span className="font-mono text-slate-300 font-bold">{(data?.allTimeVisits ?? 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Today's Visits Card */}
            <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Today's Visits</span>
                <div className="p-2 rounded-lg bg-emerald-400/10">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {(data?.todayVisits ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] flex items-center gap-1">
                {todayDiff >= 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +{todayDiff}
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {todayDiff}
                  </span>
                )}
                <span className="text-slate-400">vs yesterday ({data?.yesterdayVisits ?? 0})</span>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Unique Visitors</span>
                <div className="p-2 rounded-lg bg-purple-400/10">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {(data?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Distinct IP & user accounts
              </div>
            </div>

            {/* Outbound Clicks */}
            <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Outbound Clicks</span>
                <div className="p-2 rounded-lg bg-amber-400/10">
                  <MousePointerClick className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {(data?.totalOutboundClicks ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Website, job & deck clicks
              </div>
            </div>

            {/* Click-Through Rate */}
            <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">CTR (Interactivity)</span>
                <div className="p-2 rounded-lg bg-sky-400/10">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {data?.clickThroughRate ?? 0}%
              </div>
              <div className="text-[11px] text-slate-400">
                Clicks / page views ratio
              </div>
            </div>

          </div>

          {/* Interactive Chart Section */}
          <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0071E3]" />
                  <span>Daily Traffic & Engagement Trends ({days} Days)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual breakdown of page views (blue curve) and user click actions (green line).
                </p>
              </div>

              {/* Legend & Hover detail */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0071E3]" />
                  <span className="text-slate-300">Page Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">Outbound Clicks</span>
                </div>
                {hoveredPoint && (
                  <div className="px-2.5 py-1 bg-white/10 rounded-lg text-white font-mono text-[11px]">
                    <span className="text-slate-400">{hoveredPoint.date}: </span>
                    <strong className="text-[#0071E3]">{hoveredPoint.views} views</strong>,{' '}
                    <strong className="text-emerald-400">{hoveredPoint.clicks} clicks</strong>
                  </div>
                )}
              </div>
            </div>

            {/* SVG Canvas */}
            {chartData && (
              <div className="relative w-full overflow-x-auto pt-2">
                <svg
                  viewBox={`0 0 ${chartData.chartWidth} ${chartData.chartHeight}`}
                  className="w-full h-44 sm:h-52 overflow-visible"
                >
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0071E3" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0071E3" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                    const y = chartData.chartHeight - pct * (chartData.chartHeight - 30) - 15;
                    return (
                      <line
                        key={idx}
                        x1="0"
                        y1={y}
                        x2={chartData.chartWidth}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Area fill for Views */}
                  <path d={chartData.viewsArea} fill="url(#viewsGradient)" />

                  {/* Stroke Line for Views */}
                  <path
                    d={chartData.viewsPath}
                    fill="none"
                    stroke="#0071E3"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Stroke Line for Clicks */}
                  <path
                    d={chartData.clicksPath}
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Nodes */}
                  {chartData.viewsPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill="#0071E3"
                        className="transition-all hover:r-5 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(p.data)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* X-axis date milestones */}
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
                  <span>{chartData.series[0]?.date}</span>
                  <span>{chartData.series[Math.floor(chartData.series.length / 2)]?.date}</span>
                  <span>{chartData.series[chartData.series.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2-Column Analytics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top Visited Startups Leaderboard */}
            <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Top Visited Startups</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified companies receiving the highest page impressions.
                  </p>
                </div>
                <Link
                  to="/admin/startups"
                  className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                >
                  <span>All Startups</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {(!data?.topStartups || data.topStartups.length === 0) ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No startup page views recorded yet in this timeframe.</p>
                ) : (
                  data.topStartups.map((s, idx) => {
                    const pctOfTop = data.topStartups[0]?.views > 0
                      ? Math.round((s.views / data.topStartups[0].views) * 100)
                      : 0;
                    return (
                      <div
                        key={s.id}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#0071E3]/40 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <Link
                                to={`/admin/startups/${s.id}`}
                                className="text-xs font-bold text-white hover:text-[#0071E3] transition-colors"
                              >
                                {s.name}
                              </Link>
                              <span className="text-[10px] text-slate-400 block">{s.district}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-xs text-white">
                              {s.views.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block">views</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pctOfTop}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Popular Pages & Outbound Clicks */}
            <div className="space-y-6">
              
              {/* Popular Routes */}
              <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Popular Portal Pages</span>
                </h3>

                <div className="space-y-2">
                  {(!data?.topPages || data.topPages.length === 0) ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No route visits recorded yet.</p>
                  ) : (
                    data.topPages.slice(0, 5).map((page) => (
                      <div
                        key={page.path}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-white truncate">{page.path}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-white">{page.views.toLocaleString()}</span>
                          <span className="text-[10px] text-sky-400 font-mono bg-sky-400/10 px-1.5 py-0.5 rounded border border-sky-400/20">
                            {page.percentage}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Outbound Clicks & CTAs */}
              <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-emerald-400" />
                  <span>Top Outbound Destinations</span>
                </h3>

                <div className="space-y-2">
                  {(!data?.topOutbound || data.topOutbound.length === 0) ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No outbound click events recorded yet.</p>
                  ) : (
                    data.topOutbound.slice(0, 4).map((out, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-[9px] font-mono uppercase bg-emerald-400/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/20 shrink-0">
                            {out.eventType.replace('_CLICK', '')}
                          </span>
                          <span className="text-slate-300 truncate font-mono text-[11px]">
                            {out.targetUrl || 'Direct Action'}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-white shrink-0">
                          {out.count} clicks
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Real-time Telemetry Event Stream */}
          <div className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Recent Telemetry Event Stream</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Last 15 captured events</span>
            </div>

            <div className="divide-y divide-white/5 overflow-hidden">
              {(!data?.recentEvents || data.recentEvents.length === 0) ? (
                <p className="text-xs text-slate-500 py-4 text-center">No recent telemetry events.</p>
              ) : (
                data.recentEvents.map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                          evt.eventType === 'PAGE_VIEW'
                            ? 'bg-[#0071E3]/20 text-[#0071E3]'
                            : 'bg-emerald-400/20 text-emerald-300'
                        }`}
                      >
                        {evt.eventType}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">{evt.entityType}:</span>
                      <span className="text-white font-medium truncate">{evt.entityId}</span>
                      {evt.targetUrl && (
                        <span className="text-slate-500 text-[10px] truncate max-w-xs font-mono">
                          → {evt.targetUrl}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(evt.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
