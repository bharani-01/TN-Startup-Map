import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Search, MapPin, Cpu, Zap } from 'lucide-react';

interface HeroSectionProps {
  onOpenSearch?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSearch }) => {
  return (
    <section className="relative overflow-hidden min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] xl:min-h-[760px] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-36 xl:pt-28 xl:pb-40 flex flex-col justify-center bg-[#FAFBFD]">
      
      {/* 0. Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0 mask-linear-fade-b" />

      {/* 1. Tamil Nadu Heritage & Modern Skyline Panoramic Horizon */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img 
          src="/tn-skyline-hero.png" 
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

          {/* Majestic Hero Headline with Art & Editorial Typography */}
          <div className="space-y-3">
            <h1 className="font-art font-extrabold text-3xl sm:text-5xl lg:text-6xl xl:text-[76px] text-[#1D1D1F] tracking-[-0.035em] leading-[1.08] pb-1">
              The Spatial Map of <br />
              <span className="inline-block font-editorial italic font-normal text-[#0071E3] pr-3 sm:pr-5 pb-1">
                Tamil Nadu Startups
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#555558] leading-[1.6] font-normal max-w-xl">
              Explore 500+ verified ventures, DeepTech space breakthroughs, institutional funding milestones, and regional innovation hubs across all 38 districts.
            </p>
          </div>

          {/* Quick Spotlight Search Capsule */}
          {onOpenSearch && (
            <div className="w-full max-w-lg">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.08] hover:border-[#0071E3]/50 shadow-2xs hover:shadow-apple-sm backdrop-blur-xl transition-all group apple-press-subtle text-left"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <Search className="w-4 h-4 text-[#0071E3] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#86868B] group-hover:text-[#1D1D1F] font-medium truncate">
                    Search by startup, sector, district, or founder...
                  </span>
                </div>
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-[#86868B] bg-black/[0.04] rounded-md border border-black/[0.06] shrink-0 ml-2">
                  ⌘K
                </kbd>
              </button>
            </div>
          )}

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
