import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Building2,
  MapPin,
  Wifi,
  DollarSign,
  Clock,
  CheckCircle2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { JobListing, JobType, JobExperience } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
};

const EXPERIENCE_LABELS: Record<JobExperience, string> = {
  FRESHER: 'Fresher',
  JUNIOR: 'Junior (1-3 yrs)',
  MID: 'Mid (3-5 yrs)',
  SENIOR: 'Senior (5-8 yrs)',
  LEAD: 'Lead / Principal',
};

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} - ${fmt(max)} / yr`;
  if (min) return `From ${fmt(min)} / yr`;
  if (max) return `Up to ${fmt(max)} / yr`;
  return null;
}

export const AdminJobs: React.FC = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'OPEN' | 'CLOSED' | 'HIDDEN' | 'ALL'>('OPEN');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const handleHide = async (jobId: string) => {
    setActionLoading(jobId);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/hide`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Listing hidden from public directory.');
        setTimeout(() => setMessage(null), 3000);
        fetchJobs();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (jobId: string) => {
    setActionLoading(jobId);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Listing restored to public directory.');
        setTimeout(() => setMessage(null), 3000);
        fetchJobs();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const openCount = jobs.filter((j) => j.status === 'OPEN' && !j.isHidden).length;
  const closedCount = jobs.filter((j) => j.status === 'CLOSED').length;
  const hiddenCount = jobs.filter((j) => j.isHidden).length;
  const allCount = jobs.length;

  const filteredJobs = jobs.filter((job) => {
    // 1. Status Filter
    if (statusFilter === 'OPEN') {
      if (job.status !== 'OPEN' || job.isHidden) return false;
    } else if (statusFilter === 'CLOSED') {
      if (job.status !== 'CLOSED') return false;
    } else if (statusFilter === 'HIDDEN') {
      if (!job.isHidden) return false;
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (job.title || '').toLowerCase();
      const startup = (job.startupName || '').toLowerCase();
      const dept = (job.department || '').toLowerCase();
      const skills = (job.skills || []).join(' ').toLowerCase();

      return title.includes(q) || startup.includes(q) || dept.includes(q) || skills.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Jobs Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review live career listings posted by founders across Tamil Nadu and moderate compliance.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, venture, skills..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:bg-white/10 focus:border-[#0071E3] transition-colors outline-none"
          />
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('OPEN')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'OPEN'
              ? 'bg-[#0071E3] text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Live / Open ({openCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('HIDDEN')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'HIDDEN'
              ? 'bg-amber-500 text-black font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Hidden ({hiddenCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('CLOSED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'CLOSED'
              ? 'bg-slate-700 text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Closed ({closedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-white text-black font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>All ({allCount})</span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-[#1c1c1e] border border-white/5 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading platform job records...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#1c1c1e] border border-white/5 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No listings in this view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No listings matched your search criteria.'
              : `There are currently no ${statusFilter.toLowerCase()} job listings.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const salary = formatSalary(job.salaryMin, job.salaryMax);

            return (
              <div
                key={job.id}
                className="bg-[#1c1c1e] rounded-2xl border border-white/10 p-6 space-y-4 shadow-sm hover:border-white/20 transition-colors text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-base text-white">{job.title}</h3>

                      {job.isHidden ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          HIDDEN FROM PUBLIC
                        </span>
                      ) : job.status === 'OPEN' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PUBLIC / LIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-slate-400 border border-white/10">
                          CLOSED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="font-semibold text-white">{job.startupName}</span>
                      <span>•</span>
                      <span>{job.department || 'Startup Core'}</span>
                      <span>•</span>
                      <span>{JOB_TYPE_LABELS[job.jobType]}</span>
                      <span>•</span>
                      <span>{EXPERIENCE_LABELS[job.experience]}</span>
                      {(job.location || job.isRemote) && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            {job.isRemote ? <Wifi className="w-3 h-3 text-[#0071E3]" /> : <MapPin className="w-3 h-3" />}
                            <span>{job.isRemote ? (job.location ? `Remote (${job.location})` : 'Fully Remote') : job.location}</span>
                          </span>
                        </>
                      )}
                      {salary && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-400 font-mono">{salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {job.isHidden ? (
                      <button
                        id={`restore-job-${job.id}`}
                        onClick={() => handleRestore(job.id)}
                        disabled={actionLoading === job.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === job.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        <span>Restore to Board</span>
                      </button>
                    ) : (
                      <button
                        id={`hide-job-${job.id}`}
                        onClick={() => handleHide(job.id)}
                        disabled={actionLoading === job.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === job.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                        <span>Hide from Public</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span>Created: {new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0071E3] font-sans font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Apply Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
