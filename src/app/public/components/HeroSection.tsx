import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Search, MapPin, Cpu, Zap, X, Loader2, Building2, Layers } from 'lucide-react';

interface HeroSectionProps {
  onOpenSearch?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data.results || data.data);
        }
      } catch (err) {
        console.error('Hero search error:', err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/startups?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] xl:min-h-[760px] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-36 xl:pt-28 xl:pb-40 flex flex-col justify-center bg-[#FAFBFD]">
      
      {/* 0. Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0 mask-linear-fade-b" />

      {/* 1. Tamil Nadu Heritage & Modern Skyline Panoramic Horizon */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img 
          src="/tn-skyline-hero.webp" 
          alt="Tamil Nadu Heritage and Modern Innovation Skyline" 
          className="w-full h-full object-cover object-bottom sm:object-contain sm:object-bottom lg:object-cover lg:object-bottom opacity-80 sm:opacity-95 transition-opacity duration-700"
        />
        {/* Protective Soft Gradient Scrim for Flawless Text Legibility on all viewports */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFBFD] via-[#FAFBFD]/90 sm:via-[#FAFBFD]/75 sm:to-transparent to-[#FAFBFD]/40" />
        
        {/* Seamless Bottom Fade to blend into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#FAFBFD] via-[#FAFBFD]/80 to-transparent" />
      </div>

      {/* 2. Ambient Atmosphere Radial Backlights */}
      <div className="absolute top-0 left-0 w-[450px] sm:w-[750px] h-[400px] bg-gradient-to-tr from-[#0071E3]/[0.08] via-[#5856D6]/[0.04] to-transparent blur-3xl pointer-events-none rounded-full z-0" />
      <div className="absolute top-1/3 right-[5%] w-[400px] sm:w-[600px] h-[350px] bg-gradient-to-bl from-[#34C759]/[0.04] via-[#0071E3]/[0.03] to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* 3. Main Hero Content Layer */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 w-full">
        
        <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl text-left space-y-6 sm:space-y-7">

          {/* Live Ecosystem Status Beacon (Unboxed, Pure Canvas Typography) */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
              Live Ecosystem Directory • 38 Districts Indexed
            </span>
          </div>

          {/* Majestic Hero Headline with Apple Display Typography */}
          <div className="space-y-3">
            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] text-[#1D1D1F] tracking-[-0.035em] leading-[1.08] pb-1">
              The Spatial Map of <br />
              <span className="inline-block text-[#0071E3] pr-3 sm:pr-5 pb-1">
                Tamil Nadu Startups
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#555558] leading-[1.6] font-normal max-w-xl">
              Explore 500+ verified ventures, DeepTech space breakthroughs, institutional funding milestones, and regional innovation hubs across all 38 districts.
            </p>
          </div>

          {/* Interactive Hero Search Bar with Live Instant Results */}
          <div className="relative w-full max-w-xl" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-full flex items-center bg-white rounded-2xl border border-black/[0.1] hover:border-[#0071E3]/40 focus-within:border-[#0071E3] focus-within:ring-4 focus-within:ring-[#0071E3]/15 shadow-apple-card transition-all">
                <div className="pl-4 pr-2 text-[#0071E3]">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0071E3]" />
                  ) : (
                    <Search className="w-4 h-4 text-[#0071E3]" />
                  )}
                </div>
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (query.trim()) setShowDropdown(true);
                  }}
                  placeholder="Search startups, sectors, districts, founders..."
                  className="w-full py-3.5 pr-20 text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] bg-transparent focus:outline-none font-medium"
                />

                <div className="absolute right-2 flex items-center gap-1.5">
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setResults(null);
                        setShowDropdown(false);
                      }}
                      className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.05] transition-colors"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold shadow-apple-sm transition-all apple-press cursor-pointer flex items-center gap-1"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>

            {/* Instant Search Results Dropdown */}
            {showDropdown && results && query.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-black/[0.08] shadow-apple-card z-50 max-h-96 overflow-y-auto divide-y divide-black/[0.06] animate-in fade-in-50 slide-in-from-top-2 duration-150 text-left">
                
                {/* Startups Results */}
                {results.startups && results.startups.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-[#0071E3]" />
                      <span>Startups ({results.startups.length})</span>
                    </span>
                    {results.startups.slice(0, 5).map((s: any) => {
                      const title = s.title || s.name || '';
                      const subtitle = s.subtitle || s.district || s.city || '';
                      const url = s.url || `/startups/${s.slug}`;
                      const icon = s.icon || s.logoUrl;
                      const badge = s.badge || s.stage;

                      return (
                        <Link
                          key={s.id || s.slug || title}
                          to={url}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-black/[0.04] border border-black/[0.06] flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                              {icon ? (
                                <img src={icon} alt={title} className="w-full h-full object-contain" />
                              ) : (
                                <span className="font-bold text-xs text-[#1D1D1F]">{title.charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#0071E3] truncate">
                                {title}
                              </p>
                              <p className="text-[10px] text-[#86868B] truncate">
                                {subtitle}
                              </p>
                            </div>
                          </div>
                          {badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/[0.04] text-[#86868B] shrink-0">
                              {badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Districts Results */}
                {results.districts && results.districts.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#34C759]" />
                      <span>Districts ({results.districts.length})</span>
                    </span>
                    {results.districts.slice(0, 3).map((d: any) => {
                      const title = d.title || d.name || '';
                      const subtitle = d.subtitle || '';
                      const url = d.url || `/districts/${d.slug}`;

                      return (
                        <Link
                          key={d.id || d.slug || title}
                          to={url}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] truncate block">
                                {title} District
                              </span>
                              {subtitle && (
                                <span className="text-[10px] text-[#86868B] block truncate">
                                  {subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-[#86868B] shrink-0">
                            Explore District →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Sectors Results */}
                {results.sectors && results.sectors.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#AF52DE]" />
                      <span>Sectors</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 px-3 py-1">
                      {results.sectors.slice(0, 4).map((sec: any) => {
                        const title = sec.title || sec.name;
                        const url = sec.url || `/startups?sector=${encodeURIComponent(title)}`;
                        return (
                          <Link
                            key={sec.id || title}
                            to={url}
                            onClick={() => setShowDropdown(false)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#AF52DE]/10 text-[#AF52DE] hover:bg-[#AF52DE]/20 transition-colors"
                          >
                            {title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No results fallback */}
                {(!results.startups || results.startups.length === 0) &&
                 (!results.districts || results.districts.length === 0) &&
                 (!results.sectors || results.sectors.length === 0) && (
                  <div className="p-6 text-center text-xs text-[#86868B]">
                    No immediate matches found for "<span className="font-semibold text-[#1D1D1F]">{query}</span>"
                  </div>
                )}

                {/* Bottom View All Link */}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-[#0071E3] hover:bg-[#0071E3]/5 flex items-center justify-between transition-colors text-left"
                >
                  <span>See all directory results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Focused Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/map"
              className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs sm:text-sm shadow-apple-sm hover:shadow-apple-hover transition-all apple-press shrink-0"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Launch Spatial Map</span>
            </Link>

            <Link
              to="/startups"
              className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#1D1D1F] font-semibold text-xs sm:text-sm border border-black/[0.1] hover:border-black/[0.2] shadow-apple-sm transition-all apple-press shrink-0 backdrop-blur-md"
            >
              <span>Browse All Ventures</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
            </Link>
          </div>

          {/* Regional Innovation Cluster Quick Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] mr-1">
              Key Clusters:
            </span>

            <Link
              to="/districts/chennai"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-black/[0.08] text-[#1D1D1F] hover:text-[#0071E3] transition-all shadow-2xs apple-press-subtle"
            >
              <MapPin className="w-3 h-3 text-[#0071E3]" />
              <span>Chennai SaaS & DeepTech</span>
            </Link>

            <Link
              to="/districts/krishnagiri"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-black/[0.08] text-[#1D1D1F] hover:text-[#0071E3] transition-all shadow-2xs apple-press-subtle"
            >
              <Zap className="w-3 h-3 text-[#34C759]" />
              <span>Hosur EV Corridor</span>
            </Link>

            <Link
              to="/districts/coimbatore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-black/[0.08] text-[#1D1D1F] hover:text-[#0071E3] transition-all shadow-2xs apple-press-subtle"
            >
              <Cpu className="w-3 h-3 text-[#5856D6]" />
              <span>Coimbatore Precision Tech</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};
