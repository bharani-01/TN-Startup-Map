import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  DollarSign, 
  Edit3, 
  ShieldCheck, 
  Loader2, 
  ExternalLink,
  CheckCircle2,
  Award,
  Layers,
  Zap,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup } from '../../../types';

export const FounderDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [myStartups, setMyStartups] = useState<Startup[]>([]);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStartupId, setActiveStartupId] = useState<string>(() => {
    return localStorage.getItem('tn_active_startup_id') || '';
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
    const fetchFounderStartups = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/founder/my-startups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success && data.data?.startups) {
          const list: Startup[] = data.data.startups;
          setMyStartups(list);

          if (list.length > 0) {
            const found = list.find((s) => s.id === activeStartupId || s.slug === activeStartupId) || list[0];
            setStartup(found);
            setActiveStartupId(found.id);
            localStorage.setItem('tn_active_startup_id', found.id);
          } else {
            setStartup(null);
          }
        } else {
          setMyStartups([]);
          setStartup(null);
        }
      } catch (err) {
        console.error('Error fetching founder startups:', err);
        setMyStartups([]);
        setStartup(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFounderStartups();
    } else {
      setLoading(false);
    }
  }, [token, user, activeStartupId]);

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

    // 3. Financials & Funding (15%)
    const hasFunding = Boolean(st.totalFundingInr || (st.fundingRounds && st.fundingRounds.length > 0));
    if (hasFunding) {
      score += 15;
    } else {
      tasks.push({
        title: 'Funding Rounds & Cap Table',
        gain: '+15%',
        tab: 'funding',
        desc: 'Add institutional or angel funding rounds and verified lead investors.'
      });
    }

    // 4. Milestones & Achievements (10%)
    const hasMilestones = Boolean((st.milestones && st.milestones.length > 0) || (st.awards && st.awards.length > 0));
    if (hasMilestones) {
      score += 10;
    } else {
      tasks.push({
        title: 'Milestones & Key Awards',
        gain: '+10%',
        tab: 'growth',
        desc: 'Add patent filings, government awards, product launches, or major pilot wins.'
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

  const formatStage = (stage: string) => {
    switch (stage) {
      case 'SERIES_A': return 'Series A';
      case 'SERIES_B_PLUS': return 'Series B+';
      case 'PRE_SEED': return 'Pre-Seed';
      case 'SEED': return 'Seed';
      case 'BOOTSTRAPPED': return 'Bootstrapped';
      case 'IDEA': return 'Idea Stage';
      case 'ACQUIRED': return 'Acquired';
      default: return stage.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#1c1c1e] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/10 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0071E3]/20 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Founder Account</span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Official founder control panel for managing verified profile data on the Tamil Nadu Startup Map.
          </p>
        </div>

        {startup && (
          <div className="flex items-center gap-2.5">
            <Link
              to={`/startups/${startup.slug}`}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Profile</span>
            </Link>
            <Link
              to="/founder/edit"
              className="px-4 py-2 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading startup records from database...</p>
        </div>
      ) : startup ? (
        <>
          {/* PROFILE COMPLETION NUDGE & READINESS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#0071E3]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Profile Strength & Ecosystem Completeness
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Complete profiles receive 4x more investor pageviews and priority placement across district leaderboards.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    {completeness.score}%
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {completeness.score === 100 ? 'Fully Verified' : 'In Progress'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#0071E3] flex items-center justify-center font-bold text-xs">
                  {completeness.score}%
                </div>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-md bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0071E3] to-emerald-500 transition-all duration-500"
                style={{ width: `${completeness.score}%` }}
              />
            </div>

            {/* Incomplete Tasks */}
            {completeness.tasks.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recommended Data Additions ({completeness.tasks.length} pending)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {completeness.tasks.map((task, idx) => (
                    <Link
                      key={idx}
                      to={`/founder/edit?tab=${task.tab}`}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-[#0071E3]/40 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-[#0071E3] transition-colors">
                            {task.title}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#0071E3]/10 text-[#0071E3] font-bold text-[10px]">
                            {task.gain}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {task.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0071E3] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your startup profile is 100% complete with full business metrics, milestones, and credentials.</span>
              </div>
            )}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Funding</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 truncate">
                {startup.totalFundingInr || 'Bootstrapped'}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {startup.fundingRounds?.length || 0} recorded rounds
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Current Stage</span>
                <div className="p-2 rounded-lg bg-blue-50 text-[#0071E3]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatStage(startup.stage)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Founded {startup.foundedYear}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Business Model</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 truncate" title={startup.businessModel}>
                {startup.businessModel || 'Pending'}
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate" title={startup.revenueRange}>
                {startup.revenueRange || `${startup.teamSize || '1-10'} Members`}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Milestones & Awards</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {(startup.milestones?.length || 0) + (startup.awards?.length || 0)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {startup.milestones?.length || 0} milestones · {startup.awards?.length || 0} awards
              </p>
            </div>
          </div>

          {/* Live Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-slate-900 text-white font-bold text-lg flex items-center justify-center">
                      {startup.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {startup.name}
                  </h3>
                  <p className="text-xs text-slate-500">{startup.tagline}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{startup.verificationStatus} RECORD</span>
              </span>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Location</span>
                <span className="font-semibold text-slate-900">{startup.city || startup.district}, {startup.district}, TN</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Sectors</span>
                <span className="font-semibold text-slate-900">{startup.sectors?.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Incubator / Hub</span>
                <span className="font-semibold text-slate-900">{startup.incubator || 'Independent'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/founder/edit"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Update Profile Information
              </Link>
              <Link
                to="/founder/jobs"
                className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Manage Job Openings</span>
              </Link>
              <Link
                to={`/startups/${startup.slug}`}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                View Public Page
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Linked Startup Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please submit your startup proposal or claim an existing company profile to manage your data here.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0071E3] text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Submit Startup
          </Link>
        </div>
      )}
    </div>
  );
};
