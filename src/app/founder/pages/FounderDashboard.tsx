import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Briefcase, DollarSign, Edit3, ArrowRight, ShieldCheck, MapPin, Globe, Loader2, ExternalLink } from 'lucide-react';
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
          <Link
            to="/founder/edit"
            className="px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-apple-sm apple-press"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-[#86868B] font-medium">Loading startup records from database...</p>
        </div>
      ) : startup ? (
        <>
          {/* Apple Health Style Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl apple-glass-card border border-white/80 shadow-apple-card space-y-2">
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

            <div className="p-5 rounded-3xl apple-glass-card border border-white/80 shadow-apple-card space-y-2">
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

            <div className="p-5 rounded-3xl apple-glass-card border border-white/80 shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Team Size</span>
                <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F]">
                {startup.teamSize || '1-10'}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium">
                {startup.founders?.length || 1} documented founders
              </p>
            </div>

            <div className="p-5 rounded-3xl apple-glass-card border border-white/80 shadow-apple-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#86868B]">Hiring Status</span>
                <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-display text-[#1D1D1F]">
                {startup.isHiring ? 'Actively Hiring' : 'Not Hiring'}
              </div>
              <p className="text-[11px] text-[#86868B] font-medium">
                {startup.verificationStatus}
              </p>
            </div>
          </div>

          {/* Live Profile Card */}
          <div className="apple-glass-card rounded-3xl border border-white/80 shadow-apple-card p-6 sm:p-8 space-y-5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-black/[0.02] rounded-2xl border border-black/[0.04] text-xs text-[#86868B]">
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Location</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.city || startup.district}, {startup.district}, TN</span>
              </div>
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Sectors</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.sectors?.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Funding Status</span>
                <span className="font-semibold text-[#1D1D1F]">{startup.totalFundingInr || startup.fundingType}</span>
              </div>
              <div>
                <span className="text-[#86868B] font-medium block text-[11px]">Official Website</span>
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0071E3] hover:underline flex items-center gap-1">
                  <span>{startup.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
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
        <div className="apple-glass-card rounded-3xl border border-black/[0.06] p-8 text-center space-y-3">
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
