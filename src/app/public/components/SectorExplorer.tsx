import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Building2, 
  ShieldCheck
} from 'lucide-react';
import { Sector, Startup } from '../../../types';
import OptionWheel from './OptionWheel';

interface SectorExplorerProps {
  sectors: Sector[];
  startups: Startup[];
}

// Research-driven cluster insights per domain
const SECTOR_RESEARCH_INTEL: { [key: string]: { hubs: string; anchors: string; narrative: string } } = {
  'AI': {
    hubs: 'Chennai & Coimbatore',
    anchors: 'IITM RBCDSAI & T-Hubs',
    narrative: 'Powering automated vision, generative models, and edge compute for industrial enterprise applications globally.',
  },
  'DeepTech': {
    hubs: 'Chennai (IIT Madras)',
    anchors: 'IITM Research Park & NCCRD',
    narrative: 'Breakthrough intellectual property across sub-orbital space launch, photonics, and quantum encryption technologies.',
  },
  'SaaS': {
    hubs: 'Chennai SaaS Corridor & Tenkasi',
    anchors: 'SaaSBOOMi & Global Enterprise Hubs',
    narrative: 'The recognized SaaS Capital of South Asia, home to Nasdaq-listed leaders and bootstrapped multi-million ARR giants.',
  },
  'EV': {
    hubs: 'Hosur, Krishnagiri & Chennai',
    anchors: 'Hosur EV Hub & Advanced Auto Clusters',
    narrative: 'Leading South Asia in smart electric two-wheelers, battery pack manufacturing, and high-density charging grids.',
  },
  'IoT': {
    hubs: 'Coimbatore & Chennai',
    anchors: 'PSG STEP & Anna University',
    narrative: 'Industrial automation, connected robotics, and smart sensors integrating legacy manufacturing with IoT telemetry.',
  },
  'Agritech': {
    hubs: 'Madurai, Coimbatore & Delta',
    anchors: 'TNAU & Agri Innovation Centres',
    narrative: 'Precision irrigation, hydroponics, and AI-driven soil intelligence boosting yield across agricultural corridors.',
  },
  'FinTech': {
    hubs: 'Chennai',
    anchors: 'Fintech City Chennai & Incubators',
    narrative: 'Next-generation subscription revenue billing, debt orchestration, and neo-banking infrastructure.',
  },
  'ClimateTech': {
    hubs: 'Tirunelveli, Tuticorin & Chennai',
    anchors: 'Green Energy Corridor & Bio Hubs',
    narrative: 'Clean hydrogen propulsion, circular economy tech, and renewable smart grid energy management.',
  },
};

export const SectorExplorer: React.FC<SectorExplorerProps> = ({ sectors, startups }) => {
  const [activeSectorId, setActiveSectorId] = useState<string>(sectors[0]?.id || '');

  // Active sector index
  const activeSectorIndex = useMemo(() => {
    const idx = sectors.findIndex((s) => s.id === activeSectorId);
    return idx >= 0 ? idx : 0;
  }, [sectors, activeSectorId]);

  // Active sector entity
  const activeSector = useMemo(() => {
    return sectors[activeSectorIndex] || sectors[0];
  }, [sectors, activeSectorIndex]);

  // Filter startups for the active sector
  const sectorStartups = useMemo(() => {
    if (!activeSector) return [];
    const sectorNameLower = activeSector.name.toLowerCase();
    return startups.filter((startup) => 
      startup.sectors && startup.sectors.some((sec) => 
        sec.toLowerCase().includes(sectorNameLower) || sectorNameLower.includes(sec.toLowerCase())
      )
    );
  }, [startups, activeSector]);

  if (!sectors || sectors.length === 0) return null;

  const sectorIntel = SECTOR_RESEARCH_INTEL[activeSector?.name || ''] || {
    hubs: 'Chennai & Coimbatore',
    anchors: 'StartupTN Innovation Hubs',
    narrative: activeSector?.description || 'Pioneering breakthrough industrial and software solutions across Tamil Nadu.',
  };

  const sectorNames = sectors.map((s) => s.name);

  return (
    <section className="relative z-20 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-16 overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 text-left">
        <div className="space-y-2">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#86868B] font-mono">
            Ecosystem Taxonomy • Industry Clusters
          </p>

          <h2 className="font-art font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1D1D1F] tracking-[-0.035em] leading-[1.06] pb-1">
            Specialized Innovation <br />
            <span className="inline-block font-editorial italic font-normal text-3xl sm:text-5xl lg:text-6xl text-[#0071E3] pr-3 sm:pr-5 pb-1">
              Industry Verticals
            </span>
          </h2>
          
          <p className="font-sans text-sm sm:text-base text-[#555558] font-normal max-w-2xl leading-relaxed">
            From deep learning architectures and space launch propulsion to EV gigafactories and SaaS operating systems — explore Tamil Nadu's innovation engine categorized by specialized technical frontiers.
          </p>
        </div>

        <Link
          to="/startups"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#1D1D1F] hover:text-[#0071E3] font-semibold text-xs sm:text-sm border border-black/[0.08] shadow-apple-sm transition-all apple-press self-start md:self-auto shrink-0"
        >
          <span>View All {sectors.length} Verticals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main SOTA Seamless Canvas: Kinetic OptionWheel on Left + Detailed Venture Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* =========================================================================
            LEFT COLUMN: Grand Kinetic OptionWheel (Directly on canvas, clean typography)
            ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
          
          {/* Large Kinetic OptionWheel */}
          <div className="h-[340px] sm:h-[420px] lg:h-[460px] relative w-full">
            <OptionWheel
              items={sectorNames}
              selected={activeSectorIndex}
              onChange={(index) => {
                const targetSector = sectors[index];
                if (targetSector) setActiveSectorId(targetSector.id);
              }}
              textColor="#86868B"
              activeColor="#1D1D1F"
              side="left"
              fontSize={2.6}
              spacing={1.38}
              curve={0.85}
              tilt={4.5}
              blur={1.2}
              fade={0.3}
              smoothing={240}
              inset={12}
              loop={true}
              draggable={true}
            />
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Sector Intelligence & Clean Venture Grid
            ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          
          {/* Sector Overview Strip (Clean, without colored icon box or changing bg) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] text-left">
            <div>
              <div className="flex items-baseline gap-2.5">
                <h3 className="font-art font-extrabold text-2xl sm:text-3xl text-[#1D1D1F] tracking-tight">
                  {activeSector.name}
                </h3>
                <span className="text-xs font-mono font-bold text-[#0071E3]">
                  {sectorIntel.hubs}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl font-normal leading-relaxed">
                {sectorIntel.narrative}
              </p>
            </div>

            <Link
              to={`/startups?sector=${encodeURIComponent(activeSector.name)}`}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold shadow-2xs transition-all apple-press shrink-0 self-start md:self-auto"
            >
              <span>View All {activeSector.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Verified Ventures Grid (Pure Canvas-Native, Zero Floating Box Containers) */}
          {sectorStartups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
              {sectorStartups.slice(0, 4).map((startup) => (
                <Link
                  key={startup.id}
                  to={`/startups/${startup.slug}`}
                  className="group flex flex-col justify-between p-2 rounded-xl hover:bg-black/[0.02] transition-colors apple-press-subtle text-left"
                >
                  <div className="space-y-2.5">
                    {/* Header: Logo + Name + Stage */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {startup.logoUrl ? (
                          <img
                            src={startup.logoUrl}
                            alt={startup.name}
                            className="w-full h-full object-contain rounded-md group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full rounded-md bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs flex items-center justify-center">
                            {startup.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-art font-extrabold text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                            {startup.name}
                          </h4>
                          <span className="text-[10px] font-mono font-semibold text-[#86868B]">
                            • {startup.stage || 'Active'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
                          <MapPin className="w-3 h-3 text-[#0071E3] shrink-0" />
                          <span className="truncate">{startup.district || 'Tamil Nadu'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="font-sans text-xs text-[#555558] line-clamp-2 leading-relaxed font-normal">
                      {startup.tagline || startup.description || 'Pioneering innovative solutions in Tamil Nadu.'}
                    </p>
                  </div>

                  {/* Direct Action Link */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0071E3]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <span>View Intelligence</span>
                      <ShieldCheck className="w-3 h-3 text-[#34C759]" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 border border-black/[0.06] text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-art font-extrabold text-base text-[#1D1D1F]">
                Discover {activeSector?.name} Startups
              </h4>
              <p className="text-xs text-[#86868B] max-w-md">
                Explore our full database of verified ventures in {activeSector?.name} across all 38 districts of Tamil Nadu.
              </p>
              <Link
                to={`/startups?sector=${encodeURIComponent(activeSector?.name || '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold shadow-2xs transition-all apple-press"
              >
                <span>Search {activeSector?.name} Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
