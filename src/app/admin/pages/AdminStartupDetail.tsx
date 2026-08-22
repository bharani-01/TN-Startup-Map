import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Globe,
  ShieldCheck,
  DollarSign,
  Users,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  FileText,
  Mail,
  Phone,
  Trash2,
  RotateCcw,
  Check,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup, JobListing } from '../../../types';

interface StartupAnalytics {
  startupId: string;
  totalViews: number;
  websiteClicks: number;
  applyClicks: number;
  pitchDeckClicks: number;
  socialClicks: number;
  totalOutboundClicks: number;
  clickThroughRate: number;
  dailyTimeSeries: { date: string; views: number; clicks: number }[];
  recentClicks: { eventType: string; targetUrl?: string; createdAt: string }[];
}

export const AdminStartupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [analytics, setAnalytics] = useState<StartupAnalytics | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStartupAndData = async () => {
    if (!id) return;
    try {
      setLoading(true);

      // 1. Fetch startup details
      const sRes = await fetch(`/api/startups/${id}`);
      const sData = await sRes.json();
      if (!sData.success || !sData.data) {
        throw new Error('Startup record not found');
      }
      const st: Startup = sData.data;
      setStartup(st);

      // 2. Fetch Admin-only Analytics for this startup
      try {
        const aRes = await fetch(`/api/admin/startups/${st.id}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const aData = await aRes.json();
        if (aData.success) {
          setAnalytics(aData.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }

      // 3. Fetch Job listings for this startup
      try {
        const jRes = await fetch(`/api/admin/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jData = await jRes.json();
        if (jData.success && Array.isArray(jData.data)) {
          const matchingJobs = jData.data.filter(
            (j: JobListing) => j.startupId === st.id || j.startupSlug === st.slug
          );
          setJobs(matchingJobs);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to load company dossier' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartupAndData();
  }, [id, token]);

  const handleSoftDelete = async () => {
    if (!startup) return;
    if (!confirm(`Are you sure you want to soft-delete '${startup.name}'? It will be hidden from the public map.`)) return;

    setActionLoading('delete');
    try {
      const res = await fetch(`/api/startups/${startup.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `${startup.name} soft-deleted successfully.` });
        fetchStartupAndData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async () => {
    if (!startup) return;
    setActionLoading('restore');
    try {
      const res = await fetch(`/api/startups/${startup.id}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `${startup.name} restored to active directory.` });
        fetchStartupAndData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleJobVisibility = async (jobId: string, isCurrentlyHidden: boolean) => {
    setActionLoading(jobId);
    try {
      const endpoint = isCurrentlyHidden ? `/api/admin/jobs/${jobId}/restore` : `/api/admin/jobs/${jobId}/hide`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: isCurrentlyHidden ? 'Job listing restored to public board.' : 'Job listing hidden from public.' });
        fetchStartupAndData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center space-y-3 bg-[#1c1c1e] rounded-3xl border border-white/5">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading comprehensive company intelligence records...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-16 text-center space-y-4 bg-[#1c1c1e] rounded-3xl border border-white/5">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Startup dossier not found</h2>
        <p className="text-xs text-slate-400">The requested startup record could not be found or has been removed.</p>
        <button
          onClick={() => navigate('/admin/startups')}
          className="px-4 py-2 rounded-full bg-[#0071E3] text-white text-xs font-semibold"
        >
          Back to Startups List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/startups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all apple-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Startups</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`/startups/${startup.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all apple-press"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {startup.isDeleted ? (
            <button
              onClick={handleRestore}
              disabled={actionLoading === 'restore'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all apple-press disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Entity</span>
            </button>
          ) : (
            <button
              onClick={handleSoftDelete}
              disabled={actionLoading === 'delete'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all apple-press disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Soft-Delete Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Company Executive Banner Card */}
      <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-apple-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-apple-sm overflow-hidden">
              {startup.logoUrl ? (
                <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="w-full h-full rounded-xl bg-[#0071E3] text-white font-bold font-display text-2xl flex items-center justify-center">
                  {startup.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  {startup.name}
                </h1>

                {startup.isDeleted ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    SOFT_DELETED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{startup.verificationStatus}</span>
                  </span>
                )}

                {startup.claimedByUserId ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    CLAIMED BY FOUNDER
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-400 border border-white/10">
                    UNCLAIMED
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {startup.tagline}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{startup.district}, Tamil Nadu</span>
                </span>
                <span>•</span>
                <span>Stage: <strong className="text-white">{startup.stage}</strong></span>
                <span>•</span>
                <span>Founded <strong className="text-white">{startup.foundedYear}</strong></span>
                {startup.website && (
                  <>
                    <span>•</span>
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0071E3] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{startup.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN-ONLY REAL-TIME ENGAGEMENT & CLICK INTELLIGENCE */}
      <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-apple-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-[#0071E3]" />
              <h2 className="text-lg font-extrabold font-display text-white">
                Admin Telemetry & Engagement Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Verified analytics tracking profile views, outbound website redirects, and job application clicks for this company.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#0071E3]/20 text-[#0071E3] border border-[#0071E3]/30 text-xs font-mono font-bold self-start sm:self-auto">
            Admin Intelligence Access
          </span>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total Profile Opens</span>
              <Eye className="w-4 h-4 text-[#0071E3]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {analytics?.totalViews ?? 0}
            </div>
            <p className="text-[11px] font-mono text-slate-400">Total verified profile views</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Website Outbound Clicks</span>
              <Globe className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {analytics?.websiteClicks ?? 0}
            </div>
            <p className="text-[11px] font-mono text-slate-400">Official site referrals</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Job Application Clicks</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {analytics?.applyClicks ?? 0}
            </div>
            <p className="text-[11px] font-mono text-slate-400">Candidate apply submissions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Engagement CTR</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {analytics?.clickThroughRate ?? 0}%
            </div>
            <p className="text-[11px] font-mono text-slate-400">Outbound conversion rate</p>
          </div>
        </div>

        {/* 7-Day / 30-Day Activity Sparkline */}
        {analytics?.dailyTimeSeries && analytics.dailyTimeSeries.length > 0 && (
          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold uppercase tracking-wider">7-Day Engagement Timeline</span>
              <span>Total Clicks: <strong className="text-white">{analytics.totalOutboundClicks}</strong></span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-20 pt-2">
              {analytics.dailyTimeSeries.slice(-7).map((d, idx) => {
                const maxVal = Math.max(...analytics.dailyTimeSeries.map((x) => x.views + x.clicks), 1);
                const total = d.views + d.clicks;
                const heightPercent = Math.max(15, Math.min(100, Math.round((total / maxVal) * 100)));

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full bg-white/5 rounded-lg h-full flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#0071E3] rounded-md transition-all group-hover:bg-[#0077ED]"
                        title={`${d.date}: ${d.views} opens, ${d.clicks} outbound clicks`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-full">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Business, Financial & Governance Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Profile Records */}
        <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-apple-card">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Building2 className="w-4 h-4 text-[#0071E3]" />
            <h3 className="text-base font-bold font-display text-white">Business Architecture</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono">Business Model</span>
              <p className="font-bold text-white">{startup.businessModel || 'B2B / SaaS'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-mono">Revenue Range</span>
              <p className="font-bold text-white">{startup.revenueRange || 'Pre-revenue / Early'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-mono">Target Market</span>
              <p className="font-bold text-white">{startup.targetMarket || 'Global / India'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-mono">Team Size</span>
              <p className="font-bold text-white">{startup.teamSize || '1-10 Employees'}</p>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="text-slate-400 font-mono">Sectors</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {startup.sectors.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071E3]/20 text-[#0071E3] border border-[#0071E3]/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="text-slate-400 font-mono">Executive Summary</span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {startup.description}
              </p>
            </div>
          </div>
        </div>

        {/* Capitalization & Financials */}
        <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-apple-card">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold font-display text-white">Funding & Valuation</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {startup.totalFundingInr || 'Bootstrapped'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Funding Type</span>
              <span className="text-white font-semibold">{startup.fundingType || 'Self-Funded'}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Recorded Rounds</span>
              <span className="text-white font-semibold">{startup.fundingRounds?.length || 0} rounds</span>
            </div>

            {startup.fundingRounds && startup.fundingRounds.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase block">Funding History</span>
                <div className="space-y-2">
                  {startup.fundingRounds.map((r, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{r.roundType}</span>
                        <span className="text-[10px] text-slate-400">{r.investors?.join(', ') || 'Angel Investors'}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-emerald-400 block">{r.amountInr || r.amountUsd || 'Undisclosed'}</span>
                        <span className="text-[10px] text-slate-400">{r.date || 'Recent'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Hosted & Moderation for this Company */}
      <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-5 shadow-apple-card">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-display text-white">
              Career Listings Hosted ({jobs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {startup.isHiring ? 'Entity is actively hiring' : 'No active hiring status'}
          </span>
        </div>

        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No job openings currently published under this startup profile.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{job.title}</span>
                    {job.isHidden ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        HIDDEN
                      </span>
                    ) : job.status === 'OPEN' ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OPEN / LIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-slate-400">
                        CLOSED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span>{job.experience}</span>
                    <span>•</span>
                    <span>{job.location || 'Remote'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleJobVisibility(job.id, job.isHidden)}
                    disabled={actionLoading === job.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all apple-press cursor-pointer ${
                      job.isHidden
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                    }`}
                  >
                    {job.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{job.isHidden ? 'Restore to Board' : 'Hide from Public'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Milestones & Awards Records */}
      {((startup.milestones && startup.milestones.length > 0) || (startup.awards && startup.awards.length > 0)) && (
        <div className="bg-[#1c1c1e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-apple-card">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-display text-white">Milestones & Official Recognitions</h3>
          </div>

          <div className="space-y-3 text-xs">
            {startup.milestones?.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                  {m.date || 'Milestone'}
                </span>
                <div>
                  <span className="font-bold text-white block">{m.title}</span>
                  {m.description && <span className="text-slate-400 text-[11px] block">{m.description}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
