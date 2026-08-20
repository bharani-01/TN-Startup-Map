import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenSearch?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14 flex flex-col justify-start bg-[#FAFBFD]">
      
      {/* 1. Tamil Nadu Heritage & Modern Skyline Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img 
          src="/tn-skyline-hero.png" 
          alt="Tamil Nadu Heritage and Modern Innovation Skyline" 
          className="w-full h-full object-cover object-bottom opacity-90"
        />
        {/* Subtle Bottom Transition Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAFBFD] via-[#FAFBFD]/40 to-transparent" />
      </div>

      {/* Subtle Ambient Radial Backlight */}
      <div className="absolute top-0 left-0 w-[500px] sm:w-[750px] h-[380px] bg-gradient-to-tr from-[#0071E3]/[0.05] via-[#2563EB]/[0.03] to-transparent blur-3xl pointer-events-none rounded-full z-0" />

      {/* 2. Main Content Container */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 w-full">
        
        <div className="max-w-xl xl:max-w-2xl text-left space-y-6 sm:space-y-7">
          
          {/* Hero Title & Subtitle */}
          <div className="space-y-3.5">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#1D1D1F] tracking-[-0.035em] leading-[1.06]">
              The Spatial Map of <br />
              <span className="bg-gradient-to-r from-[#0071E3] via-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent">
                Tamil Nadu Startups
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#86868B] leading-relaxed font-normal max-w-lg">
              Explore verified ventures, deep tech breakthroughs, institutional funding milestones, and regional innovation hubs across all 38 districts.
            </p>
          </div>

          {/* Focused Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-3.5">
            <Link
              to="/map"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs sm:text-sm shadow-apple-sm transition-all apple-press"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Launch Spatial Map</span>
            </Link>

            <Link
              to="/startups"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/95 hover:bg-black/[0.02] text-[#1D1D1F] font-semibold text-xs sm:text-sm border border-black/[0.08] shadow-apple-sm transition-all apple-press backdrop-blur-md"
            >
              <span>Browse All Ventures</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
