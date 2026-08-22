import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Search,
  Clock,
  Wifi,
  ChevronRight,
  Building2,
  Filter,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  DollarSign,
  Users,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { JobListing, JobType, JobExperience } from '../../../types';
import { trackEvent } from '../../../utils/telemetry';

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
};

const EXPERIENCE_LABELS: Record<JobExperience, string> = {
  FRESHER: 'Fresher / Entry',
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

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [remoteOnly, setRemoteOnly] = useState(searchParams.get('isRemote') === 'true');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (jobType) params.set('jobType', jobType);
      if (experience) params.set('experience', experience);
      if (remoteOnly) params.set('isRemote', 'true');
      params.set('limit', '100');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, jobType, experience, remoteOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadJobs]);

  const activeFilterCount = [jobType, experience, remoteOnly ? 'remote' : ''].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearch('');
    setJobType('');
    setExperience('');
    setRemoteOnly(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] pb-24 text-left">
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-8 sm:pt-12 space-y-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Career Opportunities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Jobs at Tamil Nadu Startups
          </h1>

          <p className="text-xs sm:text-sm text-[#555558] max-w-xl mx-auto leading-relaxed">
            Discover verified openings at high-growth ventures building SaaS, DeepTech, EV mobility, and spatial intelligence across Tamil Nadu.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.08] shadow-apple-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                id="jobs-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role title, venture name, keywords..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-black/[0.03] border border-black/[0.06] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/70 outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                id="filter-job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-black/[0.03] border border-black/[0.06] focus:border-[#0071E3] focus:bg-white text-xs font-semibold text-[#1D1D1F] outline-none transition-all cursor-pointer"
              >
                <option value="">All Employment Types</option>
                {Object.entries(JOB_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                id="filter-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-black/[0.03] border border-black/[0.06] focus:border-[#0071E3] focus:bg-white text-xs font-semibold text-[#1D1D1F] outline-none transition-all cursor-pointer"
              >
                <option value="">All Experience Levels</option>
                {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>

              {/* Remote Toggle Button */}
              <button
                type="button"
                onClick={() => setRemoteOnly((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all border apple-press cursor-pointer ${
                  remoteOnly
                    ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-apple-sm'
                    : 'bg-black/[0.03] text-[#1D1D1F] border-black/[0.06] hover:bg-black/[0.06]'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Remote Work</span>
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-all"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#86868B] pt-1 font-mono">
            <span>
              Showing <strong className="text-[#1D1D1F]">{jobs.length}</strong> open opportunity
              {jobs.length !== 1 ? 's' : ''}
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[#0071E3] font-semibold">{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Results Stream */}
        {loading ? (
          <div className="py-28 text-center space-y-3 bg-white/70 backdrop-blur-xl rounded-3xl border border-black/[0.06]">
            <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#86868B]">Hydrating active career opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.08] p-16 text-center space-y-4 shadow-apple-card">
            <div className="w-14 h-14 rounded-2xl bg-black/[0.03] text-[#86868B] flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold font-display text-[#1D1D1F]">
                No matching opportunities found
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                {search || activeFilterCount > 0
                  ? 'Try broadening your search query or resetting filters.'
                  : 'Startups regularly publish new positions. Check back soon.'}
              </p>
            </div>
            {(search || activeFilterCount > 0) && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071E3] text-white font-semibold text-xs shadow-apple-sm transition-all apple-press cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const salary = formatSalary(job.salaryMin, job.salaryMax);
              const applyHref = job.applyUrl || (job.applyEmail ? `mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}` : '#');

              return (
                <article
                  key={job.id}
                  className="bg-white rounded-3xl border border-black/[0.08] p-6 shadow-apple-sm hover:shadow-apple-card hover:border-[#0071E3]/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* Top Startup Identity Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-black/[0.08] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                          {job.startupLogoUrl ? (
                            <img
                              src={job.startupLogoUrl}
                              alt={job.startupName || 'Startup'}
                              className="w-full h-full object-contain rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-full rounded-xl bg-[#0071E3] text-white font-bold font-display text-base flex items-center justify-center">
                              {job.startupName ? job.startupName.charAt(0) : 'T'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          {job.startupSlug ? (
                            <Link
                              to={`/startups/${job.startupSlug}`}
                              className="font-bold text-xs text-[#0071E3] hover:underline block truncate"
                            >
                              {job.startupName}
                            </Link>
                          ) : (
                            <span className="font-bold text-xs text-[#1D1D1F] block truncate">
                              {job.startupName}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-[#86868B] block truncate">
                            {job.department || 'Startup Venture'}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20 shrink-0">
                        {JOB_TYPE_LABELS[job.jobType]}
                      </span>
                    </div>

                    {/* Job Title & Meta */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug">
                        {job.title}
                      </h3>

                      <div className="flex items-center gap-2.5 text-xs text-[#86868B] flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          {job.isRemote ? (
                            <>
                              <Wifi className="w-3 h-3 text-[#34C759]" />
                              <span>{job.location ? `Remote (${job.location})` : 'Remote'}</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>{job.location || 'Tamil Nadu'}</span>
                            </>
                          )}
                        </span>
                        <span>•</span>
                        <span>{EXPERIENCE_LABELS[job.experience]}</span>
                      </div>
                    </div>

                    {/* Salary Range */}
                    {salary && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-mono font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{salary}</span>
                      </div>
                    )}

                    {/* Description */}
                    {job.description && (
                      <p className="text-xs text-[#555558] leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Skills Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-black/[0.03] border border-black/[0.04] text-[10px] font-mono text-[#555558]"
                          >
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[10px] font-mono text-[#86868B] self-center">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Apply CTA Button */}
                  <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#86868B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(job.createdAt)}</span>
                    </span>

                    <a
                      href={applyHref}
                      target={job.applyUrl ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      onClick={() => trackEvent({ entityType: 'JOB', entityId: job.id, eventType: 'APPLY_CLICK', targetUrl: job.applyUrl || job.applyEmail })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-2xs transition-all apple-press"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3 text-white/80" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
