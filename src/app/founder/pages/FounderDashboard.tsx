import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Briefcase, 
  DollarSign, 
  Edit3, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Loader2, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  FileCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup } from '../../../types';

export const FounderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStartupId, setActiveStartupId] = useState<string>(() => {
    return localStorage.getItem('tn_active_startup_id') || user?.claimedStartupId || 'agnikul-cosmos';
  });

  useEffect(() => {
    const handleSwitched = (e: any) => {
      if (e.detail?.startupId) {
        setActiveStartupId(e.detail.startupId);
      }
    };
    window.addEventListener('startup-switched', handleSwitched);
    return () => window.removeEventListener('startup-switched', handleSwitched);
  }, []);

  useEffect(() => {
    const fetchStartupProfile = async () => {
      try {
        setLoading(true);
        const target = activeStartupId || user?.claimedStartupId || user?.companyName || 'agnikul-cosmos';
        let res = await fetch(`/api/startups/${target}`);
        let data = await res.json();
        
        if (data.success && data.data) {
          setStartup(data.data);
        } else {
          // Fallback to agnikul-cosmos for verified founder demo
          const fallbackRes = await fetch('/api/startups/agnikul-cosmos');
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success && fallbackData.data) {
            setStartup(fallbackData.data);
          }
        }
      } catch (err) {
        console.error('Error fetching founder startup:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartupProfile();
  }, [user, activeStartupId]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Founder';

  // Calculate Profile Completeness Score
  const calculateCompleteness = (st: Startup) => {
    let score = 0;
    const tasks = [];

    // 1. Identity & Basics (25%)
    const hasBasics = Boolean(st.name && st.tagline && st.description && st.website && st.district);
    if (hasBasics) {
      score += 25;
    } else {
      tasks.push({
        title: 'Core Identity & Website',
        gain: '+25%',
        tab: 'brand',
        desc: 'Ensure company name, tagline, description, and website are fully updated.'
      });
    }

    // 2. Business & Monetization (20%)
    const hasBusiness = Boolean(st.businessModel && st.revenueModel && st.revenueRange);
    if (hasBusiness) {
      score += 20;
    } else {
      tasks.push({
        title: 'Business & Revenue Model',
        gain: '+20%',
        tab: 'business',
        desc: 'Add your business model (e.g. B2B SaaS), revenue model, and revenue range for investor discovery.'
      });
    }

    // 3. Milestones Timeline (15%)
    const hasMilestones = Boolean(st.milestones && st.milestones.length > 0);
    if (hasMilestones) {
      score += 15;
    } else {
      tasks.push({
        title: 'Key Milestones',
        gain: '+15%',
        tab: 'milestones',
        desc: 'Document key mission launches, product releases, and funding milestones.'
      });
    }

    // 4. Awards & Recognition (10%)
    const hasAwards = Boolean(st.awards && st.awards.length > 0);
    if (hasAwards) {
      score += 10;
    } else {
      tasks.push({
        title: 'Honors & Awards',
        gain: '+10%',
        tab: 'milestones',
        desc: 'Add national, state, or industry awards and citations.'
      });
    }

    // 5. Clients & Press Mentions (10%)
    const hasClientsOrPress = Boolean((st.keyClients && st.keyClients.length > 0) || (st.pressMentions && st.pressMentions.length > 0));
    if (hasClientsOrPress) {
      score += 10;
    } else {
      tasks.push({
        title: 'Enterprise Clients & Press Coverage',
        gain: '+10%',
        tab: 'clients',
        desc: 'Showcase enterprise customer logos and featured news articles.'
      });
    }

    // 6. Credentials (Incubation & DPIIT) (10%)
    const hasCredentials = Boolean(st.incubator || st.dpiitNumber || st.accelerator);
    if (hasCredentials) {
      score += 10;
    } else {
      tasks.push({
        title: 'Incubation & DPIIT Number',
        gain: '+10%',
        tab: 'credentials',
        desc: 'Add incubation cell details (e.g. IITMIC, StartupTN) and DPIIT certification.'
      });
    }

    // 7. Leadership & Tech Stack (10%)
    const hasFounders = Boolean(st.founders && st.founders.length > 0 && st.techStack && st.techStack.length > 0);
    if (hasFounders) {
      score += 10;
    } else {
      tasks.push({
        title: 'Founders & Technology Stack',
        gain: '+10%',
        tab: 'team',
        desc: 'Add leadership bios and engineering frameworks.'
      });
    }

    return { score: Math.min(100, score), tasks };
  };

  const completeness = startup ? calculateCompleteness(startup) : { score: 0, tasks: [] };

  return (
    <div className="space-y-8">
      {/* Welcome Banner - High Contrast Solid Apple Dark Card */}
      <div className="bg-[#1D1D1F] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-apple-card border border-black/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/20 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Founder Account</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B]">
            Official founder control panel for managing verified profile data on the Tamil Nadu Startup Map.
          </p>
        </div>

        {startup && (
          <div className="flex items-center gap-3">
            <Link
              to={`/startups/${startup.slug}`}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 apple-press"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Profile</span>
            </Link>
            <Link
              to="/founder/edit"
              className="px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-apple-sm apple-press"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-[#86868B] font-medium">Loading startup records from database...</p>
        </div>
      ) : startup ? (
        <>
          {/* PROFILE COMPLETION NUDGE & READINESS CARD */}
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#0071E3]" />
                  <h2 className="text-base sm:text-lg font-extrabold font-display text-[#1D1D1F]">
                    Profile Strength & Ecosystem Completeness
                  </h2>
                </div>
                <p className="text-xs text-[#86868B]">
                  Complete profiles receive 4x more investor pageviews and priority placement across district leaderboards.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black font-display text-[#1D1D1F]">
                    {completeness.score}%
                  </div>
                  <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
                    {completeness.score === 100 ? 'Fully Verified' : 'In Progress'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-black/[0.06] flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-[#0071E3]"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${completeness.score >= 25 ? '100% 0%' : '50% 0%'}, ${completeness.score >= 50 ? '100% 100%' : completeness.score >= 25 ? '100% 50%' : '50% 0%'}, ${completeness.score >= 75 ? '0% 100%' : completeness.score >= 50 ? '50% 100%' : '50% 0%'}, ${completeness.score >= 100 ? '0% 0%' : completeness.score >= 75 ? '0% 50%' : '50% 0%'})`
                    }}
                  />
                  <span className="text-xs font-bold text-[#1D1D1F]">{completeness.score}%</span>
                </div>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-full bg-black/[0.04] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0071E3] to-[#34C759] transition-all duration-500 rounded-full"
                style={{ width: `${completeness.score}%` }}
              />
            </div>

            {/* Incomplete Tasks / Smart Nudges */}
            {completeness.tasks.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                  Recommended Data Additions ({completeness.tasks.length} pending)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completeness.tasks.map((task, idx) => (
                    <Link
                      key={idx}
                      to={`/founder/edit?tab=${task.tab}`}
                      className="p-4 rounded-2xl bg-black/[0.02] hover:bg-[#0071E3]/[0.04] border border-black/[0.05] hover:border-[#0071E3]/30 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                            {task.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#0071E3]/10 text-[#0071E3] font-bold text-[10px]">
                            {task.gain}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#86868B] leading-normal">
                          {task.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your startup profile is 100% complete with full business metrics, milestones, and credentials.</span>
              </div>
            )}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Total Funding</span>
                <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F] truncate">
                {startup.totalFundingInr || 'Bootstrapped'}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium">
                {startup.fundingRounds?.length || 0} recorded rounds
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Current Stage</span>
                <div className="p-2 rounded-2xl bg-[#0071E3]/10 text-[#0071E3]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F]">
                {startup.stage}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium">
                Founded {startup.foundedYear}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Business Model</span>
                <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F] truncate">
                {startup.businessModel || 'Pending'}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium truncate">
                {startup.revenueRange || `${startup.teamSize || '1-10'} Members`}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Milestones & Awards</span>
                <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F]">
                {(startup.milestones?.length || 0) + (startup.awards?.length || 0)}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium">
                {startup.milestones?.length || 0} milestones · {startup.awards?.length || 0} awards
              </p>
            </div>
          </div>

          {/* Live Profile Card */}
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-black/[0.08] shadow-apple-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-[#1D1D1F] text-white font-bold font-display text-lg flex items-center justify-center">
                      {startup.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1D1D1F]">
                    {startup.name}
                  </h3>
                  <p className="text-xs text-[#86868B]">{startup.tagline}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{startup.verificationStatus} Platform Record</span>
              </span>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-black/[0.02] rounded-2xl border border-black/[0.04] text-xs text-[#86868B]">
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Location</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.city || startup.district}, {startup.district}, TN</span>
              </div>
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Sectors</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.sectors?.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Incubator / Hub</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.incubator || 'Independent'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/founder/edit"
                className="px-5 py-2.5 bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold rounded-full shadow-apple-sm transition-all apple-press"
              >
                Update Profile Information
              </Link>
              <Link
                to={`/startups/${startup.slug}`}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-black/[0.08] text-[#1D1D1F] text-xs font-semibold rounded-full shadow-apple-sm transition-all apple-press"
              >
                View Public Page
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-black/[0.06] p-8 text-center space-y-3">
          <Building2 className="w-12 h-12 text-[#86868B] mx-auto" />
          <h3 className="text-base font-bold text-[#1D1D1F]">No Linked Startup Found</h3>
          <p className="text-xs text-[#86868B] max-w-md mx-auto">
            Please submit your startup proposal or claim an existing company profile to manage your data here.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0071E3] text-white text-xs font-semibold rounded-full shadow-apple-sm apple-press"
          >
            Submit Startup
          </Link>
        </div>
      )}
    </div>
  );
};
