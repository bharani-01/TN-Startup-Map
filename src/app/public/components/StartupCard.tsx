import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Bookmark, ArrowRight, Briefcase } from 'lucide-react';
import { Startup } from '../../../types';

import { useBookmarks } from '../../../context/BookmarkContext';

// Apple Tint Sector Color Mapping
const SECTOR_COLORS: Record<string, string> = {
  AI: 'bg-apple-indigo/10 text-apple-indigo border-apple-indigo/20',
  SaaS: 'bg-apple-blue/10 text-apple-blue border-apple-blue/20',
  FinTech: 'bg-apple-emerald/10 text-apple-emerald border-apple-emerald/20',
  HealthTech: 'bg-apple-rose/10 text-apple-rose border-apple-rose/20',
  EdTech: 'bg-apple-amber/10 text-apple-amber border-apple-amber/20',
  DeepTech: 'bg-apple-purple/10 text-apple-purple border-apple-purple/20',
  IoT: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  EV: 'bg-teal-50 text-teal-700 border-teal-200/80',
  Mobility: 'bg-sky-50 text-sky-700 border-sky-200/80',
  Agritech: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  ClimateTech: 'bg-green-50 text-green-700 border-green-200/80',
  Manufacturing: 'bg-orange-50 text-orange-700 border-orange-200/80',
  SpaceTech: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
  Cybersecurity: 'bg-red-50 text-red-700 border-red-200/80',
  Robotics: 'bg-pink-50 text-pink-700 border-pink-200/80',
  Consumer: 'bg-rose-50 text-rose-700 border-rose-200/80',
  Other: 'bg-black/[0.04] text-apple-secondary border-black/[0.06]',
};

const STAGE_BADGES: Record<string, string> = {
  Idea: 'bg-black/[0.04] text-apple-secondary border-black/[0.06]',
  'Pre-seed': 'bg-apple-amber/10 text-apple-amber border-apple-amber/20',
  Seed: 'bg-apple-blue/10 text-apple-blue border-apple-blue/20',
  'Series A': 'bg-apple-indigo/10 text-apple-indigo border-apple-indigo/20',
  'Series B+': 'bg-apple-purple/10 text-apple-purple border-apple-purple/20',
  Bootstrapped: 'bg-apple-emerald/10 text-apple-emerald border-apple-emerald/20',
  Acquired: 'bg-teal-50 text-teal-800 border-teal-200',
};

interface StartupCardProps {
  startup: Startup;
  viewMode?: 'grid' | 'list';
}

export const StartupCard: React.FC<StartupCardProps> = ({ startup, viewMode = 'grid' }) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const { isBookmarked: checkIsBookmarked, toggleBookmark } = useBookmarks();
  const isBookmarked = checkIsBookmarked(startup.id);

  // Extract domain for reliable multi-CDN logo fallback
  const domain = React.useMemo(() => {
    if (!startup.website) return '';
    try {
      const url = new URL(startup.website.startsWith('http') ? startup.website : `https://${startup.website}`);
      return url.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }, [startup.website]);

  const resolveLogo = (logo?: string, dom?: string) => {
    if (logo && !logo.includes('clearbit.com')) return logo;
    if (dom) return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${dom}&size=128`;
    return '';
  };

  const initialLogo = resolveLogo(startup.logoUrl, domain);
  const [currentSrc, setCurrentSrc] = useState<string>(initialLogo);

  useEffect(() => {
    const freshLogo = resolveLogo(startup.logoUrl, domain);
    setCurrentSrc(freshLogo);
    setImgError(false);
  }, [startup.logoUrl, domain]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(startup.id);
  };

  const handleImageError = () => {
    // If primary failed, try Google Favicon CDN which is never blocked
    if (domain && !currentSrc.includes('gstatic.com')) {
      setCurrentSrc(`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`);
    } else {
      setImgError(true);
    }
  };

  const primarySector = startup.sectors[0] || 'Other';
  const sectorStyle = SECTOR_COLORS[primarySector] || SECTOR_COLORS.Other;
  const stageStyle = STAGE_BADGES[startup.stage] || 'bg-black/[0.04] text-apple-secondary border-black/[0.06]';

  const hasLogo = Boolean(currentSrc) && !imgError;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/startups/${startup.slug}`}
        className="group apple-card flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-white/95 hover:bg-white rounded-3xl border border-black/[0.07] hover:border-apple-blue/30 shadow-apple-sm hover:shadow-apple-hover gap-5 apple-press-subtle"
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          {/* Company Squircle Avatar */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-apple-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden ${
            hasLogo ? 'bg-white p-1.5 border border-black/[0.08]' : 'bg-gradient-to-tr from-apple-text via-slate-900 to-slate-800 text-white font-bold font-display text-lg'
          }`}>
            {hasLogo ? (
              <img 
                src={currentSrc} 
                alt={startup.name} 
                className="w-full h-full object-contain rounded-xl"
                onError={handleImageError}
              />
            ) : (
              startup.name.charAt(0)
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-bold text-lg text-apple-text group-hover:text-apple-blue transition-colors truncate">
                {startup.name}
              </h3>
              {startup.verificationStatus === 'VERIFIED' && (
                <span title="Verified Tamil Nadu Startup">
                  <ShieldCheck className="w-4.5 h-4.5 text-apple-emerald fill-apple-emerald/10 shrink-0" />
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageStyle}`}>
                {startup.stage}
              </span>
              {startup.isHiring && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-apple-amber/10 text-apple-amber border border-apple-amber/20">
                  <Briefcase className="w-3 h-3" />
                  HIRING
                </span>
              )}
            </div>

            <p className="text-sm text-apple-secondary line-clamp-1 font-normal leading-relaxed">
              {startup.tagline || startup.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-apple-secondary">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sectorStyle}`}>
                {startup.sectors.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-apple-secondary" />
                {startup.city || startup.district}, TN
              </span>
              <span>Founded {startup.foundedYear}</span>
              {startup.distanceKm !== undefined && (
                <span className="text-apple-blue font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {startup.distanceKm} km away
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <button
            onClick={handleBookmarkClick}
            className={`p-2.5 rounded-full border transition-all apple-press ${
              isBookmarked
                ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] shadow-apple-sm'
                : 'border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
          </button>

          <span className="px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-apple-blue/10 group-hover:bg-apple-blue group-hover:text-white transition-all flex items-center gap-1">
            <span>View Profile</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  // Grid View Card (App Store Presentation)
  return (
    <Link
      to={`/startups/${startup.slug}`}
      className="group apple-card relative flex flex-col justify-between p-6 sm:p-7 bg-white/95 hover:bg-white rounded-3xl border border-black/[0.07] hover:border-apple-blue/30 shadow-apple-card hover:shadow-apple-hover apple-press-subtle min-h-[290px]"
    >
      <div>
        {/* Card Header: Squircle Avatar, Name, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-apple-sm group-hover:scale-105 transition-transform duration-200 overflow-hidden ${
              hasLogo ? 'bg-white p-1.5 border border-black/[0.08]' : 'bg-gradient-to-tr from-apple-text via-slate-900 to-slate-800 text-white font-bold font-display text-xl'
            }`}>
              {hasLogo ? (
                <img 
                  src={currentSrc} 
                  alt={startup.name} 
                  className="w-full h-full object-contain rounded-xl"
                  onError={handleImageError}
                />
              ) : (
                startup.name.charAt(0)
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-apple-text group-hover:text-apple-blue transition-colors truncate">
                  {startup.name}
                </h3>
                {startup.verificationStatus === 'VERIFIED' && (
                  <span title="Verified Tamil Nadu Startup">
                    <ShieldCheck className="w-4.5 h-4.5 text-apple-emerald fill-apple-emerald/10 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-apple-secondary font-medium truncate mt-0.5">
                {startup.city || startup.district}, Tamil Nadu
              </p>
            </div>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`p-2.5 rounded-full border transition-all apple-press shrink-0 ${
              isBookmarked
                ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] shadow-apple-sm'
                : 'border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
          </button>
        </div>

        {/* Tagline */}
        <p className="text-sm text-apple-secondary mt-4 line-clamp-2 leading-relaxed font-normal">
          {startup.tagline || startup.description}
        </p>

        {/* Sectors & Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sectorStyle}`}>
            {primarySector}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stageStyle}`}>
            {startup.stage}
          </span>
          {startup.isHiring && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-apple-amber/10 text-apple-amber border border-apple-amber/20">
              <Briefcase className="w-3 h-3" />
              <span>Hiring</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Funding & Action */}
      <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-apple-secondary font-medium">Funding:</span>
          <span className="font-extrabold text-apple-text">
            {startup.totalFundingInr || startup.fundingType}
          </span>
        </div>

        <span className="text-apple-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Profile</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};
