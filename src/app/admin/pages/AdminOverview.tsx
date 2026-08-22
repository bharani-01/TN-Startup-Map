import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Inbox, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  Activity,
  MessageSquare,
  Bug
} from 'lucide-react';
import { EcosystemStats } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

export const AdminOverview: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<any | null>(null);
  const [errorStats, setErrorStats] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/admin/feedback/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/admin/errors/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([statsRes, fbRes, errRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (fbRes.success) setFeedbackStats(fbRes.data);
        if (errRes.success) setErrorStats(errRes.data);
      })
      .catch((err) => console.error('Error fetching admin overview metrics:', err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ecosystem Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review pending submissions, verify founder claims, monitor system health, and review user feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/submissions"
            className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            <Inbox className="w-4 h-4" />
            <span>Pending Submissions ({stats?.pendingSubmissionsCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified Startups', value: stats?.totalStartups ?? 0, icon: Building2, color: 'text-[#0071E3]', bg: 'bg-[#0071E3]/10' },
          { label: 'Pending Review Queue', value: stats?.pendingSubmissionsCount ?? 0, icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Pending Claim Requests', value: stats?.pendingClaimsCount ?? 0, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Average CSAT Rating', value: `${feedbackStats?.averageRating || '5.0'} / 5.0`, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Verification Queues */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <span>Startup Submissions</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/20">
                {stats?.pendingSubmissionsCount || 0} PENDING
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review and approve user-submitted startup profiles for publication to the public interactive directory.
            </p>
          </div>

          <Link
            to="/admin/submissions"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Claim Review */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Founder Claims</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-purple-400/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-400/20">
                {stats?.pendingClaimsCount || 0} PENDING
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify proof of association from founders seeking management control of existing startup profiles.
            </p>
          </div>

          <Link
            to="/admin/claims"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect Founder Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* User Feedback */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>User Feedback</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/20">
                {feedbackStats?.totalFeedback || 0} REVIEWS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review visitor ratings, suggestions, data corrections, and feature requests submitted across the directory.
            </p>
          </div>

          <Link
            to="/admin/feedback"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Feedback Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* API Route Audit Logs */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0071E3]" />
                <span>API Route Audit Logs</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time security and traffic monitor showing who is accessing which API route, caller role, and latency.
            </p>
          </div>

          <Link
            to="/admin/audit-logs"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Access Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* System Error Logs & Crash Triage */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-400" />
                <span>System Error Logs</span>
              </h3>
              {errorStats?.unresolvedErrors > 0 && (
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                  {errorStats.unresolvedErrors} UNRESOLVED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time capture of backend exceptions, 500 status codes, and uncaught frontend JavaScript crashes.
            </p>
          </div>

          <Link
            to="/admin/errors"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Crash Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Jobs Moderation */}
        <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Jobs & Hiring Moderation</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Govern career listings posted by startup founders. Moderate compliance, hide postings, or restore listings.
            </p>
          </div>

          <Link
            to="/admin/jobs"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Manage Job Postings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
