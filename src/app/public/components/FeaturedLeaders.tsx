import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause, ShieldCheck } from 'lucide-react';

interface InnovatorLeader {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  sector: string;
  category: 'deeptech' | 'saas' | 'mobility' | 'semiconductors' | 'edtech';
  district: string;
  roots: string;
  founders: string;
  breakthrough: string;
  logo: string;
  brandColor: string;
  accentBg: string;
  orbit: 'inner' | 'outer';
  angleDeg: number; // initial radial angle
}

const INNOVATION_LEADERS: InnovatorLeader[] = [
  // Outer Orbit (Radius: ~46%)
  {
    id: 'agnikul',
    slug: 'agnikul-cosmos',
    name: 'AgniKul Cosmos',
    shortName: 'AgniKul',
    sector: 'SpaceTech & Propulsion',
    category: 'deeptech',
    district: 'Chennai',
    roots: 'IIT Madras Research Park',
    founders: 'Srinath Ravichandran, Moin SPM',
    breakthrough: "World's first single-piece 3D-printed rocket engine (Agnilet) launched into sub-orbital space.",
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://agnikul.in&size=128',
    brandColor: '#FF6B00',
    accentBg: 'rgba(255, 107, 0, 0.08)',
    orbit: 'outer',
    angleDeg: 0,
  },
  {
    id: 'freshworks',
    slug: 'freshworks',
    name: 'Freshworks',
    shortName: 'Freshworks',
    sector: 'Enterprise CRM & SaaS',
    category: 'saas',
    district: 'Chennai',
    roots: 'SaaS Corridor, Chennai',
    founders: 'Girish Mathrubootham, Shan Krishnasamy',
    breakthrough: 'First Indian SaaS company listed on Nasdaq (FRSH), pioneering customer engagement software globally.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://freshworks.com&size=128',
    brandColor: '#0071E3',
    accentBg: 'rgba(0, 113, 227, 0.08)',
    orbit: 'outer',
    angleDeg: 72,
  },
  {
    id: 'ather',
    slug: 'ather-energy',
    name: 'Ather Energy',
    shortName: 'Ather',
    sector: 'Smart EV & Mobility',
    category: 'mobility',
    district: 'Hosur (Krishnagiri)',
    roots: 'IIT Madras & Hosur Gigafactory',
    founders: 'Tarun Mehta, Swapnil Jain',
    breakthrough: 'Pioneered intelligent connected electric two-wheelers and high-capacity manufacturing in Hosur corridor.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://atherenergy.com&size=128',
    brandColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.08)',
    orbit: 'outer',
    angleDeg: 144,
  },
  {
    id: 'chargebee',
    slug: 'chargebee',
    name: 'Chargebee',
    shortName: 'Chargebee',
    sector: 'FinTech & SaaS Billing',
    category: 'saas',
    district: 'Chennai',
    roots: 'Chennai Tech Corridor',
    founders: 'Krish Subramanian, Rajaraman Santhanam',
    breakthrough: 'Global recurring billing & subscription revenue orchestration platform powering 4,000+ fast-growing enterprises.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chargebee.com&size=128',
    brandColor: '#FF3B30',
    accentBg: 'rgba(255, 59, 48, 0.08)',
    orbit: 'outer',
    angleDeg: 216,
  },
  {
    id: 'eplane',
    slug: 'eplane-company',
    name: 'The ePlane Company',
    shortName: 'ePlane',
    sector: 'Electric Aerial Mobility (eVTOL)',
    category: 'deeptech',
    district: 'Chennai',
    roots: 'IIT Madras NCCRD',
    founders: 'Prof. Satya Chakravarthy, Pranjal Mehta',
    breakthrough: "Building India's first compact electric flying taxi (e200) for rapid urban aerial transportation.",
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://eplane.ai&size=128',
    brandColor: '#5856D6',
    accentBg: 'rgba(88, 86, 214, 0.08)',
    orbit: 'outer',
    angleDeg: 288,
  },

  // Inner Orbit (Radius: ~29%)
  {
    id: 'zoho',
    slug: 'zoho-corporation',
    name: 'Zoho Corporation',
    shortName: 'Zoho',
    sector: 'Enterprise Cloud Suite',
    category: 'saas',
    district: 'Tenkasi & Chennai',
    roots: 'Tenkasi Rural Hub & Chennai HQ',
    founders: 'Sridhar Vembu, Tony Thomas',
    breakthrough: 'Bootstrapped global enterprise software giant powering 100M+ users across 150+ countries.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://zoho.com&size=128',
    brandColor: '#E11D48',
    accentBg: 'rgba(225, 29, 72, 0.08)',
    orbit: 'inner',
    angleDeg: 30,
  },
  {
    id: 'mindgrove',
    slug: 'mindgrove-technologies',
    name: 'Mindgrove Technologies',
    shortName: 'Mindgrove',
    sector: 'Semiconductors & RISC-V SoC',
    category: 'semiconductors',
    district: 'Chennai',
    roots: 'IIT Madras SHAKTI Ecosystem',
    founders: 'Shashwath T.R, Shanker Raman',
    breakthrough: "Designing India's high-performance, cost-effective RISC-V System-on-Chip (SoC) for IoT and edge compute.",
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mindgrovetech.in&size=128',
    brandColor: '#2563EB',
    accentBg: 'rgba(37, 99, 235, 0.08)',
    orbit: 'inner',
    angleDeg: 120,
  },
  {
    id: 'detect',
    slug: 'detect-technologies',
    name: 'Detect Technologies',
    shortName: 'Detect AI',
    sector: 'Industrial AI & Robotics',
    category: 'deeptech',
    district: 'Chennai',
    roots: 'IIT Madras Research Park',
    founders: 'Daniel Raj David, Harikrishnan AS',
    breakthrough: 'Computer vision and autonomous drone sensing AI deployed in major oil, gas, and industrial assets worldwide.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://detecttechnologies.com&size=128',
    brandColor: '#0284C7',
    accentBg: 'rgba(2, 132, 199, 0.08)',
    orbit: 'inner',
    angleDeg: 210,
  },
  {
    id: 'guvi',
    slug: 'guvi-geek',
    name: 'GUVI Geek Networks',
    shortName: 'GUVI',
    sector: 'Vernacular Tech EdTech',
    category: 'edtech',
    district: 'Chennai',
    roots: 'IIT Madras Research Park',
    founders: 'Arun Prakash, Sridevi Arunprakash',
    breakthrough: 'Vernacular tech skilling platform democratizing software careers for 3M+ students across vernacular languages.',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://guvi.in&size=128',
    brandColor: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.08)',
    orbit: 'inner',
    angleDeg: 300,
  },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All Pioneers' },
  { key: 'deeptech', label: 'DeepTech & Space' },
  { key: 'saas', label: 'Enterprise SaaS' },
  { key: 'mobility', label: 'EV & Mobility' },
  { key: 'semiconductors', label: 'Semiconductors' },
];

export const FeaturedLeaders: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLeader, setActiveLeader] = useState<InnovatorLeader>(INNOVATION_LEADERS[0]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isHighlighted = (leader: InnovatorLeader) => {
    if (activeCategory === 'all') return true;
    return leader.category === activeCategory;
  };

  return (
    <section className="relative z-20 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-16 overflow-hidden">
      {/* Seamless Ambient Radial Glows (No Boxed Container) */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-br from-[#0071E3]/[0.06] via-[#5856D6]/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-[5%] w-[420px] h-[420px] bg-gradient-to-tr from-[#34C759]/[0.03] via-[#0071E3]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">

        {/* Left Column: SOTA Art & Research-Driven Editorial */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-7 text-left">

          {/* Eyebrow Label */}
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#86868B] font-mono">
            Tamil Nadu Venture Corridor • Innovation Radar
          </p>

          {/* SOTA Art Typography Headline */}
          <div className="space-y-2">
            <h2 className="font-art font-extrabold text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] text-[#1D1D1F] tracking-[-0.035em] leading-[1.08] pb-1">
              Spotlight on Tamil Nadu <br />
              <span className="inline-block font-editorial italic font-normal text-4xl sm:text-5xl lg:text-[52px] xl:text-[60px] text-[#0071E3] pr-3 sm:pr-5 pb-1">
                Innovation Leaders
              </span>
            </h2>
          </div>

          {/* Research-Driven Editorial Narrative Paragraph */}
          <p className="font-sans text-sm sm:text-base text-[#48484A] leading-[1.65] max-w-xl font-normal">
            From Chennai’s world-renowned SaaS corridor and IIT Madras DeepTech engines to Coimbatore’s precision engineering and Hosur’s electric mobility gigafactories — Tamil Nadu is the architectural blueprint for India’s industrial transformation. These pioneering ventures combine deep scientific research with global enterprise scale.
          </p>

          {/* Verified Ecosystem KPI Badges (Real Metrics) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg pt-1">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs backdrop-blur-sm">
              <div className="text-lg sm:text-xl font-extrabold font-art text-[#1D1D1F] tracking-tight">
                $14B+
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#86868B] font-semibold mt-0.5 leading-tight">
                Enterprise Value
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs backdrop-blur-sm">
              <div className="text-lg sm:text-xl font-extrabold font-art text-[#0071E3] tracking-tight">
                #1 SaaS & EV
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#86868B] font-semibold mt-0.5 leading-tight">
                Capital of South Asia
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs backdrop-blur-sm">
              <div className="text-lg sm:text-xl font-extrabold font-art text-[#5856D6] tracking-tight">
                38 Hubs
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#86868B] font-semibold mt-0.5 leading-tight">
                District Network
              </div>
            </div>
          </div>

          {/* Interactive Cohort Filter Chips */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">
              Filter Innovation Clusters:
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all apple-press-subtle ${isActive
                        ? 'bg-[#1D1D1F] text-white shadow-2xs'
                        : 'bg-white/80 text-[#555558] hover:text-[#1D1D1F] hover:bg-white border border-black/[0.06]'
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Links & Radar Pause Control */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/startups"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-bold shadow-apple-sm transition-all apple-press"
            >
              <span>Explore All 500+ Ventures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/90 hover:bg-white text-[#1D1D1F] text-xs font-semibold border border-black/[0.08] shadow-2xs transition-all apple-press-subtle"
              title={isPaused ? 'Resume Orbit Animation' : 'Pause Orbit Animation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#0071E3] fill-current" /> : <Pause className="w-3.5 h-3.5 text-[#86868B]" />}
              <span>{isPaused ? 'Resume Orbit' : 'Pause Radar'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Concentric Circular Orbit Radar (Circle Inside Circle) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative">

          {/* Main Orbit Stage */}
          <div
            className={`relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] xl:w-[480px] xl:h-[480px] flex items-center justify-center select-none orbit-container ${isPaused ? 'orbit-paused' : ''
              }`}
          >
            {/* Ambient Multi-Ring Grid & Pulse Background */}
            <div className="absolute inset-0 rounded-full border border-black/[0.04] pointer-events-none" />
            <div className="absolute w-[92%] h-[92%] rounded-full border border-dashed border-[#0071E3]/20 animate-radar-pulse pointer-events-none" />

            {/* =========================================================================
                OUTER ORBIT RING (Radius: ~46% / Diameter: ~92%)
                ========================================================================= */}
            <div
              className="absolute w-[92%] h-[92%] rounded-full border border-dashed border-black/[0.12] pointer-events-none"
            >
              {/* Subtle directional orbit arrow indicators */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0071E3]/30 text-[9px] font-mono">▸</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#0071E3]/30 text-[9px] font-mono">◂</div>
            </div>

            {/* Outer Orbit Rotating Container */}
            <div className="absolute w-[92%] h-[92%] rounded-full animate-orbit-outer pointer-events-none">
              {INNOVATION_LEADERS.filter((l) => l.orbit === 'outer').map((leader) => {
                const highlighted = isHighlighted(leader);
                const isSelected = activeLeader.id === leader.id;

                // Calculate position along circumference using angle
                const rad = (leader.angleDeg * Math.PI) / 180;
                // radius is 50% of parent diameter
                const xPercent = 50 + 50 * Math.cos(rad);
                const yPercent = 50 + 50 * Math.sin(rad);

                return (
                  <div
                    key={leader.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                    }}
                  >
                    {/* Counter-rotating container keeps logo 100% upright */}
                    <div className="animate-counter-outer">
                      <button
                        onClick={() => setActiveLeader(leader)}
                        onMouseEnter={() => setActiveLeader(leader)}
                        className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white transition-all duration-300 apple-press ${isSelected
                            ? 'scale-110 shadow-apple-card ring-2 ring-[#0071E3] border-transparent'
                            : highlighted
                              ? 'border border-black/[0.08] shadow-2xs hover:scale-105 hover:shadow-apple-sm hover:border-[#0071E3]/40'
                              : 'opacity-35 scale-90 border border-black/[0.04]'
                          }`}
                        title={`${leader.name} — ${leader.sector}`}
                      >
                        {/* Soft Glow */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: leader.accentBg }}
                        />

                        <img
                          src={leader.logo}
                          alt={leader.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-xl relative z-10"
                        />

                        {/* Name Tooltip on Hover */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-30">
                          <span className="px-2 py-0.5 rounded-md bg-[#1D1D1F] text-white text-[9px] font-bold shadow-apple-sm">
                            {leader.shortName}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================================================
                INNER ORBIT RING (Radius: ~29% / Diameter: ~58%)
                ========================================================================= */}
            <div
              className="absolute w-[58%] h-[58%] rounded-full border border-dashed border-[#5856D6]/20 pointer-events-none"
            >
              {/* Subtle accent nodes */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0071E3]/40" />
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5856D6]/40" />
            </div>

            {/* Inner Orbit Rotating Container (Counter-clockwise rotation for depth) */}
            <div className="absolute w-[58%] h-[58%] rounded-full animate-orbit-inner pointer-events-none">
              {INNOVATION_LEADERS.filter((l) => l.orbit === 'inner').map((leader) => {
                const highlighted = isHighlighted(leader);
                const isSelected = activeLeader.id === leader.id;

                const rad = (leader.angleDeg * Math.PI) / 180;
                const xPercent = 50 + 50 * Math.cos(rad);
                const yPercent = 50 + 50 * Math.sin(rad);

                return (
                  <div
                    key={leader.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                    }}
                  >
                    {/* Counter-rotating container keeps logo upright */}
                    <div className="animate-counter-inner">
                      <button
                        onClick={() => setActiveLeader(leader)}
                        onMouseEnter={() => setActiveLeader(leader)}
                        className={`group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white transition-all duration-300 apple-press ${isSelected
                            ? 'scale-110 shadow-apple-card ring-2 ring-[#5856D6] border-transparent'
                            : highlighted
                              ? 'border border-black/[0.08] shadow-2xs hover:scale-105 hover:shadow-apple-sm hover:border-[#5856D6]/40'
                              : 'opacity-35 scale-90 border border-black/[0.04]'
                          }`}
                        title={`${leader.name} — ${leader.sector}`}
                      >
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: leader.accentBg }}
                        />

                        <img
                          src={leader.logo}
                          alt={leader.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-xl relative z-10"
                        />

                        {/* Name Tooltip on Hover */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-30">
                          <span className="px-2 py-0.5 rounded-md bg-[#1D1D1F] text-white text-[9px] font-bold shadow-apple-sm">
                            {leader.shortName}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================================================
                CENTER CORE DISC (Dynamic Active Pioneer Focal Node with TN Map Image)
                ========================================================================= */}
            <Link
              to={`/startups/${activeLeader.slug}`}
              className="group relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/85 hover:bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-2xs backdrop-blur-xl flex flex-col items-center justify-center p-2.5 text-center transition-all duration-300 overflow-hidden cursor-pointer"
              title={`View ${activeLeader.name} Profile`}
            >
              {/* Authentic Tamil Nadu Map Image in Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 overflow-hidden opacity-55 group-hover:opacity-75 transition-opacity">
                <img
                  src="/images/tn-map-emblem.png"
                  alt="Tamil Nadu Map"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Active Leader Details Overlaid */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1 overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src={activeLeader.logo}
                    alt={activeLeader.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-art font-extrabold text-[11px] sm:text-xs text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate max-w-[95px] sm:max-w-[110px]">
                  {activeLeader.shortName}
                </p>
                <span className="text-[9px] font-mono text-[#0071E3] font-semibold truncate max-w-[90px]">
                  {activeLeader.district}
                </span>
              </div>
            </Link>

          </div>

          {/* Interactive Leader Spotlight Detail Capsule (Below Orbit, Canvas Native) */}
          <div className="w-full max-w-md mt-4 sm:mt-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs backdrop-blur-md transition-all duration-300 text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/[0.06] p-1.5 shadow-2xs flex items-center justify-center shrink-0">
                    <img src={activeLeader.logo} alt={activeLeader.name} className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-art font-extrabold text-sm sm:text-base text-[#1D1D1F]">
                        {activeLeader.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#0071E3]/10 text-[#0071E3]">
                        {activeLeader.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#86868B] font-medium mt-0.5">
                      {activeLeader.sector} • <span className="text-[#1D1D1F] font-semibold">{activeLeader.roots}</span>
                    </p>
                  </div>
                </div>

                <Link
                  to={`/startups/${activeLeader.slug}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-[#0071E3] text-[#1D1D1F] hover:text-white transition-colors shrink-0 apple-press-subtle cursor-pointer"
                  title="Explore startup profile"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-xs text-[#555558] mt-2.5 leading-relaxed font-normal">
                {activeLeader.breakthrough}
              </p>

              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-black/[0.04] text-[10px] text-[#86868B]">
                <span>Founders: <strong className="text-[#1D1D1F]">{activeLeader.founders}</strong></span>
                <span className="text-[#0071E3] font-semibold flex items-center gap-1 font-mono">
                  Verified Pioneer <ShieldCheck className="w-3 h-3 text-[#34C759]" />
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
