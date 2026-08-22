import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { Startup } from '../../../types';

interface TrendingStartupsProps {
  startups: Startup[];
}

export const TrendingStartups: React.FC<TrendingStartupsProps> = ({ startups }) => {
  // Use exclusively the startups present in our platform / database
  const liveItems = (startups || []).map((s) => ({
    id: s.id,
    name: s.name,
    sector: s.sectors?.[0] || 'Innovation',
    district: s.district || 'Tamil Nadu',
    logo: s.logoUrl || `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(s.website || '')}&size=128`,
    stage: s.stage || 'Trending',
    slug: s.slug || s.id,
    isVerified: s.verificationStatus === 'VERIFIED',
  }));

  if (liveItems.length === 0) return null;

  // Split into two distinct rows
  const mid = Math.ceil(liveItems.length / 2);
  const row1 = liveItems.slice(0, mid);
  const row2 = liveItems.slice(mid);

  // Duplicate for smooth seamless 100% infinite CSS loop
  const track1Items = [...row1, ...row1, ...row1];
  const track2Items = [...row2, ...row2, ...row2];

  return (
    <section className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-12 overflow-hidden select-none">
      
      {/* Header matching the reference aesthetic */}
      <div className="text-center space-y-2 mb-8 sm:mb-10">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#86868B] font-mono">
          Trending in Tamil Nadu • High-Velocity Startups
        </p>

        <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1D1D1F] tracking-[-0.03em] leading-tight">
          Ecosystem Momentum Leaders
        </h2>
      </div>

      {/* Seamless Marquee Wrapper with Edge Gradient Fade Masks (No Card Containers) */}
      <div className="relative mask-marquee-fade marquee-container py-3 space-y-5">
        
        {/* Track 1: Smooth Infinite Scrolling Left (Pure logos and text, no card boxes) */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-left flex items-center gap-8 sm:gap-12 py-1">
            {track1Items.map((item, idx) => (
              <Link
                key={`t1-${item.id}-${idx}`}
                to={`/startups/${item.slug}`}
                className="group flex items-center gap-3 opacity-75 hover:opacity-100 transition-all duration-200 shrink-0 cursor-pointer"
              >
                {/* Pure Crisp Logo (Full authentic brand color) */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-md group-hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="font-display font-bold text-sm sm:text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {item.name}
                  </span>
                  {item.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                  )}
                  <span className="text-[10px] font-semibold text-[#86868B] group-hover:text-[#555558] transition-colors">
                    • {item.district}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Track 2: Smooth Infinite Scrolling Right (Pure logos and text, no card boxes) */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-right flex items-center gap-8 sm:gap-12 py-1">
            {track2Items.map((item, idx) => (
              <Link
                key={`t2-${item.id}-${idx}`}
                to={`/startups/${item.slug}`}
                className="group flex items-center gap-3 opacity-90 hover:opacity-100 transition-all duration-200 shrink-0 cursor-pointer"
              >
                {/* Pure Crisp Logo (Full authentic brand color) */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-md group-hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="font-display font-bold text-sm sm:text-base text-[#1D1D1F] group-hover:text-[#5856D6] transition-colors">
                    {item.name}
                  </span>
                  {item.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                  )}
                  <span className="text-[10px] font-semibold text-[#86868B] group-hover:text-[#555558] transition-colors">
                    • {item.district}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="text-center pt-6">
        <Link
          to="/startups?sortBy=trending"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1D1D1F] hover:text-[#0071E3] font-semibold text-xs sm:text-sm border border-black/[0.08] shadow-apple-sm transition-all apple-press"
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Explore All Trending Startups</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
        </Link>
      </div>

    </section>
  );
};
