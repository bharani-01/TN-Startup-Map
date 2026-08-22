import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Edit3,
  X,
  Check,
  Loader2,
  MapPin,
  Wifi,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { JobListing, JobType, JobExperience } from '../../../types';

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
};

const EXPERIENCE_LABELS: Record<JobExperience, string> = {
  FRESHER: 'Fresher / Entry Level',
  JUNIOR: 'Junior (1-3 yrs)',
  MID: 'Mid-Level (3-5 yrs)',
  SENIOR: 'Senior (5-8 yrs)',
  LEAD: 'Lead / Principal',
};

interface FormState {
  title: string;
  department: string;
  jobType: JobType;
  experience: JobExperience;
  location: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
  description: string;
  skills: string;
  applyUrl: string;
  applyEmail: string;
  expiresAt: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  department: '',
  jobType: 'FULL_TIME',
  experience: 'MID',
  location: '',
  isRemote: false,
  salaryMin: '',
  salaryMax: '',
  description: '',
  skills: '',
  applyUrl: '',
  applyEmail: '',
  expiresAt: '',
};

function formatSalaryRange(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} - ${fmt(max)} / yr`;
  if (min) return `From ${fmt(min)} / yr`;
  if (max) return `Up to ${fmt(max)} / yr`;
  return null;
}

export const FounderJobsManager: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeStartup, setActiveStartup] = useState<any | null>(null);
  const [activeStartupId, setActiveStartupId] = useState<string>(() => {
    return localStorage.getItem('tn_active_startup_id') || user?.claimedStartupId || '';
  });

  // Listen for startup switch event from sidebar
  useEffect(() => {
    const handleSwitched = (e: any) => {
      if (e.detail?.startupId) {
        setActiveStartupId(e.detail.startupId);
      }
    };
    window.addEventListener('startup-switched', handleSwitched);
    return () => window.removeEventListener('startup-switched', handleSwitched);
  }, []);

  // Fetch founder startups and load jobs for active startup
  useEffect(() => {
    let isMounted = true;

    const fetchStartupsAndJobs = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Resolve founder's startups
        const res = await fetch('/api/founder/my-startups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data?.startups && data.data.startups.length > 0) {
          const list = data.data.startups;
          const current = list.find((s: any) => s.id === activeStartupId || s.slug === activeStartupId) || list[0];
          
          if (isMounted) {
            setActiveStartup(current);
            setActiveStartupId(current.id);
            localStorage.setItem('tn_active_startup_id', current.id);
          }

          // 2. Fetch jobs for resolved startup
          const jobsRes = await fetch(`/api/founder/jobs/${current.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const jobsData = await jobsRes.json();
          if (isMounted) {
            setJobs(jobsData.success && Array.isArray(jobsData.data) ? jobsData.data : []);
          }
        } else {
          if (isMounted) {
            setActiveStartup(null);
            setJobs([]);
          }
        }
      } catch (err) {
        console.error('Error fetching founder jobs:', err);
        if (isMounted) setJobs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStartupsAndJobs();

    return () => {
      isMounted = false;
    };
  }, [token, activeStartupId]);

  const loadJobs = useCallback(async () => {
    if (!activeStartupId || !token) return;
    try {
      const res = await fetch(`/api/founder/jobs/${activeStartupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to reload jobs:', err);
    }
  }, [activeStartupId, token]);

  const filteredJobs = jobs.filter((j) => statusFilter === 'ALL' || j.status === statusFilter);

  const openForm = (job?: JobListing) => {
    if (job) {
      setEditingJobId(job.id);
      setForm({
        title: job.title,
        department: job.department || '',
        jobType: job.jobType,
        experience: job.experience,
        location: job.location || '',
        isRemote: job.isRemote,
        salaryMin: job.salaryMin ? String(job.salaryMin) : '',
        salaryMax: job.salaryMax ? String(job.salaryMax) : '',
        description: job.description,
        skills: job.skills.join(', '),
        applyUrl: job.applyUrl || '',
        applyEmail: job.applyEmail || '',
        expiresAt: job.expiresAt ? job.expiresAt.split('T')[0] : '',
      });
    } else {
      setEditingJobId(null);
      setForm(EMPTY_FORM);
    }
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJobId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleSave = async () => {
    setError('');
    if (!form.title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!form.description.trim()) {
      setError('Job description is required');
      return;
    }
    if (!form.applyUrl.trim() && !form.applyEmail.trim()) {
      setError('Provide either an apply URL or a direct email address');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        startupId: activeStartupId,
        title: form.title.trim(),
        department: form.department.trim() || undefined,
        jobType: form.jobType,
        experience: form.experience,
        location: form.location.trim() || undefined,
        isRemote: form.isRemote,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        description: form.description.trim(),
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        applyUrl: form.applyUrl.trim() || undefined,
        applyEmail: form.applyEmail.trim() || undefined,
        expiresAt: form.expiresAt || undefined,
      };

      const url = editingJobId ? `/api/founder/jobs/${editingJobId}` : '/api/founder/jobs';
      const method = editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(editingJobId ? 'Job listing updated successfully.' : 'Job listing published to public board.');
        setTimeout(() => setSuccessMsg(''), 3500);
        closeForm();
        loadJobs();
      } else {
        setError(data.message || 'Failed to save job listing');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (jobId: string) => {
    if (!confirm('Close this job listing? It will immediately stop appearing on the public directory.')) return;
    try {
      const res = await fetch(`/api/founder/jobs/${jobId}/close`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Job listing closed.');
        setTimeout(() => setSuccessMsg(''), 3000);
        loadJobs();
      }
    } catch (err) {
      console.error('Failed to close job:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-black/[0.08] p-6 sm:p-8 shadow-apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Talent & Hiring Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Manage Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-xl">
            {activeStartup ? (
              <span>
                Publishing open engineering, product, and leadership roles for{' '}
                <strong className="text-[#1D1D1F]">{activeStartup.name}</strong> on the Tamil Nadu Startup Directory.
              </span>
            ) : (
              <span>Post and manage career opportunities for your verified venture.</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="add-job-btn"
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-apple-sm transition-all apple-press cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Status Filter Segmented Control */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="bg-black/[0.04] p-1 rounded-full border border-black/[0.04] inline-flex items-center gap-1">
          {(['ALL', 'OPEN', 'CLOSED'] as const).map((tab) => {
            const count = jobs.filter((j) => tab === 'ALL' || j.status === tab).length;
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                id={`jobs-tab-${tab.toLowerCase()}`}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 apple-press-subtle cursor-pointer ${
                  active
                    ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                {tab === 'ALL' ? 'All Roles' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#86868B]">
          {filteredJobs.length} role{filteredJobs.length !== 1 ? 's' : ''} listed
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-black/[0.06]">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-[#86868B] font-medium font-mono">Loading active openings...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto shadow-2xs">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold font-display text-[#1D1D1F]">
              No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} openings found
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Post verified openings to attract top software engineers, product designers, and operators across Tamil Nadu.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-apple-sm transition-all apple-press cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Job Listing</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const isClosed = job.status === 'CLOSED';
            const salary = formatSalaryRange(job.salaryMin, job.salaryMax);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-black/[0.08] p-6 shadow-apple-sm hover:shadow-apple-card hover:border-[#0071E3]/30 transition-all space-y-4 text-left"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                        {job.title}
                      </h3>

                      {job.status === 'OPEN' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20">
                          ACTIVE OPENING
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/[0.04] text-[#86868B] border border-black/[0.06]">
                          CLOSED
                        </span>
                      )}

                      {job.isHidden && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          MODERATED / HIDDEN
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#86868B] flex-wrap">
                      {job.department && (
                        <span className="font-semibold text-[#1D1D1F]">{job.department}</span>
                      )}
                      {job.department && <span>•</span>}
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
                          <span className="font-bold text-[#34C759] font-mono">{salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`edit-job-${job.id}`}
                      onClick={() => openForm(job)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] bg-white hover:bg-slate-50 text-xs font-semibold text-[#1D1D1F] shadow-2xs transition-all apple-press cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#86868B]" />
                      <span>Edit</span>
                    </button>

                    {!isClosed && (
                      <button
                        id={`close-job-${job.id}`}
                        onClick={() => handleClose(job.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-xs font-semibold text-rose-600 shadow-2xs transition-all apple-press cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Close Role</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-[#555558] leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Footer Meta: Skills & Apply Link */}
                <div className="pt-2 border-t border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#86868B] uppercase mr-1">Skills:</span>
                    {job.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-black/[0.03] border border-black/[0.04] text-[11px] font-mono text-[#555558]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[#86868B] font-mono text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#0071E3] font-sans font-semibold hover:underline"
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

      {/* Apple-Design Frosted Modal Form for Creating/Editing Openings */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold font-display text-[#1D1D1F]">
                    {editingJobId ? 'Edit Job Opening' : 'Post New Career Opportunity'}
                  </h2>
                </div>
                <p className="text-xs text-[#86868B]">
                  {activeStartup?.name ? `Listing position for ${activeStartup.name}` : 'Published directly to the Tamil Nadu Startup Directory.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role Title */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Position Title *
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Lead Full-Stack Engineer"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Department / Team
                </label>
                <input
                  id="job-dept"
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  placeholder="e.g. Engineering, AI Research, Growth"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all"
                />
              </div>

              {/* Job Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Employment Type
                </label>
                <select
                  id="job-type"
                  value={form.jobType}
                  onChange={(e) => setForm((p) => ({ ...p, jobType: e.target.value as JobType }))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] outline-none transition-all cursor-pointer"
                >
                  {Object.entries(JOB_TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Experience Requirement
                </label>
                <select
                  id="job-exp"
                  value={form.experience}
                  onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value as JobExperience }))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] outline-none transition-all cursor-pointer"
                >
                  {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Work Location
                </label>
                <input
                  id="job-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Porur, Chennai, TN"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all"
                />
              </div>

              {/* Remote Toggle */}
              <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#1D1D1F] block">Remote Work Option</span>
                  <span className="text-[11px] text-[#86868B] block">Allow candidates across Tamil Nadu or India to work remotely</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="job-remote"
                    checked={form.isRemote}
                    onChange={(e) => setForm((p) => ({ ...p, isRemote: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
                </label>
              </div>

              {/* Annual Compensation Range */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Min Salary (INR / Year)
                </label>
                <input
                  id="job-sal-min"
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => setForm((p) => ({ ...p, salaryMin: e.target.value }))}
                  placeholder="e.g. 800000"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Max Salary (INR / Year)
                </label>
                <input
                  id="job-sal-max"
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => setForm((p) => ({ ...p, salaryMax: e.target.value }))}
                  placeholder="e.g. 1500000"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all font-mono"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Role Overview & Responsibilities *
                </label>
                <textarea
                  id="job-desc"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Outline the core responsibilities, key achievements expected in the first 6 months, and tech stack expectations..."
                  className="w-full px-4 py-3 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-normal text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Skills */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Core Skills & Frameworks (Comma Separated)
                </label>
                <input
                  id="job-skills"
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all font-mono"
                />
              </div>

              {/* Apply URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  External Application Link
                </label>
                <input
                  id="job-apply-url"
                  type="url"
                  value={form.applyUrl}
                  onChange={(e) => setForm((p) => ({ ...p, applyUrl: e.target.value }))}
                  placeholder="https://careers.yourstartup.com/role"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all font-mono"
                />
              </div>

              {/* Apply Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#86868B] uppercase tracking-wider">
                  Direct Application Email
                </label>
                <input
                  id="job-apply-email"
                  type="email"
                  value={form.applyEmail}
                  onChange={(e) => setForm((p) => ({ ...p, applyEmail: e.target.value }))}
                  placeholder="careers@yourstartup.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.08] focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/10 text-xs font-semibold text-[#1D1D1F] placeholder:text-[#86868B]/60 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-full border border-black/[0.08] bg-white hover:bg-black/[0.04] text-xs font-semibold text-[#1D1D1F] transition-all apple-press cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="save-job-btn"
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-apple-sm transition-all apple-press cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{editingJobId ? 'Save Changes' : 'Publish Opportunity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
