import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  Plus
} from 'lucide-react';

interface HeroSectionProps {
  onOpenSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSearch }) => {
  const quickTags = [
    'DeepTech',
    'SaaS',
    'SpaceTech',
    'EV & Mobility',
    'FinTech',
    'Chennai',
    'Coimbatore',
    'Hosur',
    'Madurai'
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-32 sm:pt-12 sm:pb-44 lg:pb-56 min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col justify-start bg-[#FAFBFD]">
      
      {/* 1. Tamil Nadu Heritage & Modern Skyline Background Illustration (Fills 100% of Hero Section) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img 
          src="/tn-skyline-hero.png" 
          alt="Tamil Nadu Heritage and Modern Innovation Skyline" 
          className="w-full h-full object-cover object-bottom opacity-95"
        />
        {/* Subtle Bottom Transition Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAFBFD] to-transparent" />
      </div>

      {/* Subtle Ambient Blueprint Radial Backlight in Upper Left Whitespace */}
      <div className="absolute top-0 left-0 w-[600px] sm:w-[850px] h-[380px] bg-gradient-to-tr from-[#1D4ED8]/[0.06] via-[#3B82F6]/[0.04] to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* 2. Main Content Container (Harmonized with Blueprint Aesthetic) */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full">
        
        <div className="max-w-lg lg:max-w-xl xl:max-w-2xl text-left space-y-4 sm:space-y-5">
          
          {/* Live Authority Capsule */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-blue-200/80 shadow-apple-sm text-[#0F2942] text-xs font-semibold backdrop-blur-2xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D4ED8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D4ED8]"></span>
            </span>
            <span className="tracking-tight font-medium text-[#475569]">Official Spatial Directory</span>
            <span className="text-blue-300">•</span>
            <span className="text-[#1D4ED8] font-bold">Tamil Nadu Innovation Economy</span>
          </div>

          {/* Hero Title & Subtitle */}
          <div className="space-y-2.5">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#0F2942] tracking-[-0.035em] leading-[1.08]">
              The Spatial Map of <br />
              <span className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent">
                Tamil Nadu Startups
              </span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-[#334155] leading-relaxed font-normal max-w-lg">
              Explore verified ventures, deep tech breakthroughs, institutional funding milestones, and regional innovation hubs across all 38 districts.
            </p>
          </div>

          {/* Spotlight Search Trigger */}
          <div className="max-w-lg space-y-2.5">
            <div
              onClick={onOpenSearch}
              className="flex items-center gap-3 w-full px-4 sm:px-5 py-3 bg-white/95 hover:bg-white rounded-2xl border border-blue-200/70 hover:border-[#1D4ED8]/60 shadow-apple-card hover:shadow-apple-hover transition-all duration-200 cursor-pointer group text-left apple-press-subtle backdrop-blur-2xl"
            >
              <Search className="w-4 h-4 text-[#2563EB] group-hover:text-[#1D4ED8] transition-colors shrink-0" />
              <span className="text-xs sm:text-sm text-[#64748B] flex-1 truncate font-normal">
                Search by startup name, technology, or district (e.g. AgniKul, AI)...
              </span>
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-[#1D4ED8] bg-blue-50/90 rounded-lg border border-blue-200/70 shadow-2xs font-semibold">
                ⌘K
              </kbd>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#475569]">
              <span className="font-semibold text-[#64748B] mr-0.5 text-[11px] uppercase tracking-wider">Trending:</span>
              {quickTags.slice(0, 6).map((tag) => (
                <Link
                  key={tag}
                  to={`/startups?search=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-0.5 rounded-full bg-white/95 hover:bg-blue-50 border border-blue-100/90 hover:border-[#1D4ED8]/40 text-[#1E3A8A] hover:text-[#1D4ED8] text-[11px] font-semibold shadow-2xs transition-all apple-press-subtle backdrop-blur-sm"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to="/map"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm border border-[#1D4ED8] shadow-md shadow-blue-600/15 transition-all apple-press"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Launch Spatial Map</span>
            </Link>

            <Link
              to="/startups"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-blue-50/50 text-[#0F2942] font-semibold text-xs sm:text-sm border border-blue-200/70 shadow-apple-sm transition-all apple-press backdrop-blur-md"
            >
              <Building2 className="w-4 h-4 text-[#1D4ED8]" />
              <span>Browse All Ventures</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>

            <Link
              to="/submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 hover:bg-blue-50/50 text-[#1E3A8A] font-semibold text-xs sm:text-sm border border-blue-100 shadow-2xs transition-all apple-press backdrop-blur-md"
            >
              <Plus className="w-4 h-4 text-[#2563EB]" />
              <span>List Venture</span>
            </Link>
          </div>

          {/* Verified Badges Ribbon */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-[#334155] font-medium">
            <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-blue-100/90 shadow-2xs backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[#0F2942] font-semibold">100% Verified Profiles</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-blue-100/90 shadow-2xs backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span className="text-[#0F2942] font-semibold">All 38 Districts Mapped</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-blue-100/90 shadow-2xs backdrop-blur-md">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[#0F2942] font-semibold">Live Funding Radar</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
