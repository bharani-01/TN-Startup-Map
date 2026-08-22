import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Bookmark, ArrowRight, Briefcase } from 'lucide-react';
import { Startup } from '../../../types';
import { useBookmarks } from '../../../context/BookmarkContext';

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
    if (domain && !currentSrc.includes('gstatic.com')) {
      setCurrentSrc(`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`);
    } else {
      setImgError(true);
    }
  };

  const primarySector = startup.sectors[0] || 'Technology';
  const hasLogo = Boolean(currentSrc) && !imgError;

  // List View (Horizontal Stream Row)
  if (viewMode === 'list') {
    return (
      <Link
        to={`/startups/${startup.slug}`}
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 bg-white/90 hover:bg-white rounded-3xl border border-black/[0.06] hover:border-[#0071E3]/40 shadow-2xs hover:shadow-apple-sm gap-5 apple-press-subtle transition-all duration-300 text-left"
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          {/* Logo Avatar */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-white p-1 border border-black/[0.06]">
            {hasLogo ? (
              <img 
                src={currentSrc} 
                alt={startup.name} 
                className="w-full h-full object-contain rounded-xl"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-[#0071E3] text-white font-art font-extrabold text-base flex items-center justify-center">
                {startup.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-art font-extrabold text-base sm:text-lg text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                {startup.name}
              </h3>
              {startup.verificationStatus === 'VERIFIED' && (
                <span title="Verified Entity">
                  <ShieldCheck className="w-4 h-4 text-[#34C759] shrink-0" />
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-black/[0.04] text-[#1D1D1F]">
                {startup.stage}
              </span>
              {startup.isHiring && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Briefcase className="w-3 h-3" />
                  HIRING
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#555558] line-clamp-1 font-normal leading-relaxed">
              {startup.tagline || startup.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#86868B]">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F5F7] text-[#555558] border border-black/[0.04]">
                {startup.sectors.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
                {startup.city || startup.district}, TN
              </span>
              <span className="font-mono">Founded {startup.foundedYear}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <button
            onClick={handleBookmarkClick}
            className={`p-2.5 rounded-full border transition-all apple-press cursor-pointer ${
              isBookmarked
                ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] shadow-2xs'
                : 'border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
          </button>

          <span className="px-4 py-2 rounded-full text-xs font-semibold text-[#0071E3] bg-[#0071E3]/10 group-hover:bg-[#0071E3] group-hover:text-white transition-all flex items-center gap-1">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  // Grid View Card (App Store Presentation - Seamless Canvas Native)
  return (
    <Link
      to={`/startups/${startup.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.06] hover:border-[#0071E3]/40 shadow-2xs hover:shadow-apple-sm transition-all duration-300 apple-press-subtle min-h-[270px] text-left"
    >
      <div className="space-y-3.5">
        {/* Card Header: Avatar, Name, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-white p-1 border border-black/[0.06]">
              {hasLogo ? (
                <img 
                  src={currentSrc} 
                  alt={startup.name} 
                  className="w-full h-full object-contain rounded-xl"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-[#0071E3] text-white font-art font-extrabold text-sm flex items-center justify-center">
                  {startup.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-art font-extrabold text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                  {startup.name}
                </h3>
                {startup.verificationStatus === 'VERIFIED' && (
                  <span title="Verified Entity">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#86868B] mt-0.5">
                <MapPin className="w-3 h-3 text-[#0071E3] shrink-0" />
                <span className="truncate">{startup.city || startup.district}, TN</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full border transition-all apple-press shrink-0 cursor-pointer ${
              isBookmarked
                ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] shadow-2xs'
                : 'border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
          </button>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-[#555558] line-clamp-2 leading-relaxed font-normal">
          {startup.tagline || startup.description}
        </p>

        {/* Sectors & Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F5F7] text-[#555558] border border-black/[0.04]">
            {primarySector}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-black/[0.04] text-[#1D1D1F]">
            {startup.stage}
          </span>
          {startup.isHiring && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Briefcase className="w-3 h-3" />
              <span>Hiring</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Funding & Action */}
      <div className="mt-5 pt-3.5 border-t border-black/[0.04] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[#86868B] font-mono text-[11px]">Funding:</span>
          <span className="font-art font-extrabold text-[#1D1D1F] text-xs">
            {startup.totalFundingInr || startup.fundingType}
          </span>
        </div>

        <span className="text-[#0071E3] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
