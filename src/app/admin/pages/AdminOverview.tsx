import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Inbox, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Layers, 
  Briefcase, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { EcosystemStats } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

export const AdminOverview: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => d.success && setStats(d.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Ecosystem Administration
          </h1>
          <p className="text-xs sm:text-sm text-apple-secondary mt-1">
            Review pending submissions, verify founder claims, and govern Tamil Nadu startup records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/submissions"
            className="px-5 py-2.5 bg-apple-blue hover:bg-apple-blueHover text-white font-semibold text-xs rounded-full shadow-apple-sm flex items-center gap-2 transition-all apple-press"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Pending Submissions ({stats?.pendingSubmissionsCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified Startups', value: stats?.totalStartups ?? 0, icon: Building2, color: 'text-apple-blue', bg: 'bg-apple-blue/10' },
          { label: 'Pending Review Queue', value: stats?.pendingSubmissionsCount ?? 0, icon: Inbox, color: 'text-apple-amber', bg: 'bg-apple-amber/10' },
          { label: 'Pending Claim Requests', value: stats?.pendingClaimsCount ?? 0, icon: ShieldCheck, color: 'text-apple-purple', bg: 'bg-apple-purple/10' },
          { label: 'Active TN Districts', value: stats?.totalDistricts ?? 38, icon: MapPin, color: 'text-apple-emerald', bg: 'bg-apple-emerald/10' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-5 rounded-3xl bg-[#1c1c1e] border border-white/10 shadow-apple-modal space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-apple-secondary">{card.label}</span>
                <div className={`p-2 rounded-2xl ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-display text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Verification Queues */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-apple-modal">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <Inbox className="w-5 h-5 text-apple-amber" />
              <span>Startup Review Queue</span>
            </h3>
            <Link to="/admin/submissions" className="text-xs font-semibold text-apple-blue hover:underline">
              Open Queue →
            </Link>
          </div>

          <p className="text-xs text-apple-secondary leading-relaxed">
            Review user-submitted startup proposals. Verify company domain, founder identity, and one-click approve into the public interactive map.
          </p>

          <Link
            to="/admin/submissions"
            className="w-full py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all apple-press"
          >
            <span>Review {stats?.pendingSubmissionsCount || 0} Pending Submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Claim Review */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-apple-modal">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-apple-purple" />
              <span>Founder Claims Queue</span>
            </h3>
            <Link to="/admin/claims" className="text-xs font-semibold text-apple-blue hover:underline">
              Open Claims →
            </Link>
          </div>

          <p className="text-xs text-apple-secondary leading-relaxed">
            Verify submitted proof of association from founders seeking management control of existing startup profiles.
          </p>

          <Link
            to="/admin/claims"
            className="w-full py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all apple-press"
          >
            <span>Review {stats?.pendingClaimsCount || 0} Pending Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* API Route Audit Logs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-apple-modal">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0071E3]" />
              <span>API Route Audit Logs</span>
            </h3>
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-apple-blue hover:underline">
              Inspect Feed →
            </Link>
          </div>

          <p className="text-xs text-apple-secondary leading-relaxed">
            Real-time security and traffic monitor showing who is accessing which API route, caller role, HTTP status codes, and execution latency.
          </p>

          <Link
            to="/admin/audit-logs"
            className="w-full py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all apple-press"
          >
            <span>Open API Access Audit Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Jobs Moderation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1c1e] border border-white/10 space-y-4 shadow-apple-modal">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Jobs & Hiring Moderation</span>
            </h3>
            <Link to="/admin/jobs" className="text-xs font-semibold text-apple-blue hover:underline">
              Manage Roles →
            </Link>
          </div>

          <p className="text-xs text-apple-secondary leading-relaxed">
            Govern career listings posted by startup founders. Moderate compliance, hide non-compliant postings, or restore listings to the public board.
          </p>

          <Link
            to="/admin/jobs"
            className="w-full py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all apple-press"
          >
            <span>Manage Live Job Postings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
