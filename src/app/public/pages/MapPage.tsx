import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { canonicalUrl, OG_DEFAULT_IMAGE } from '../../../utils/seo';
import { 
  Filter, 
  Search, 
  Layers, 
  Building2, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  X, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowUpDown,
  Bookmark
} from 'lucide-react';
import { StartupMap } from '../map/StartupMap';
import { Startup, District, Sector } from '../../../types';
import { useBookmarks } from '../../../context/BookmarkContext';

export const MapPage: React.FC = () => {
  const { isBookmarked: checkIsBookmarked, toggleBookmark } = useBookmarks();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [startups, setStartups] = useState<Startup[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // Interactive Filters
  const [search, setSearch] = useState<string>(searchParams.get('q') || '');
  const [districtFilter, setDistrictFilter] = useState<string>(searchParams.get('district') || 'all');
  const [sectorFilter, setSectorFilter] = useState<string>(searchParams.get('sector') || 'all');
  const [stageFilter, setStageFilter] = useState<string>(searchParams.get('stage') || 'all');
  const [hiringOnly, setHiringOnly] = useState<boolean>(searchParams.get('isHiring') === 'true');
  const [sortBy, setSortBy] = useState<string>('trending');

  useEffect(() => {
    // Fetch reference data
    const fetchMetadata = async () => {
      try {
        const [distRes, secRes] = await Promise.all([
          fetch('/api/districts').then((r) => r.json()),
          fetch('/api/sectors').then((r) => r.json()),
        ]);
        if (distRes.success) setDistricts(distRes.data);
        if (secRes.success) setSectors(secRes.data);
      } catch (err) {
        console.error('Failed to load map reference data:', err);
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    // Fetch filtered startups for map
    const fetchFilteredStartups = async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (districtFilter !== 'all') params.append('district', districtFilter);
      if (sectorFilter !== 'all') params.append('sector', sectorFilter);
      if (stageFilter !== 'all') params.append('stage', stageFilter);
      if (hiringOnly) params.append('isHiring', 'true');
      if (sortBy) params.append('sortBy', sortBy);
      params.append('limit', '500');

      try {
        const res = await fetch(`/api/startups?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStartups(data.data);
        }
      } catch (err) {
        console.error('Failed to load map startups:', err);
      }
    };

    fetchFilteredStartups();
  }, [search, districtFilter, sectorFilter, stageFilter, hiringOnly, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setDistrictFilter('all');
    setSectorFilter('all');
    setStageFilter('all');
    setHiringOnly(false);
    setSortBy('trending');
    setSelectedStartup(null);
  };

  const activeDistrictObj = districts.find(
    (d) => d.slug.toLowerCase() === districtFilter.toLowerCase() || d.name.toLowerCase() === districtFilter.toLowerCase()
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-apple-bg">
      <Helmet>
        <title>Interactive Startup Map — Tamil Nadu Startup Connect</title>
        <meta name="description" content="Explore Tamil Nadu's startup ecosystem on an interactive map. Discover clusters, district boundaries, and verified innovation ventures across all 38 districts." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl('/map')} />
        <meta property="og:title" content="Interactive Startup Map — Tamil Nadu Startup Connect" />
        <meta property="og:description" content="Explore Tamil Nadu's startup ecosystem on an interactive map across all 38 districts." />
        <meta property="og:url" content={canonicalUrl('/map')} />
        <meta property="og:image" content={OG_DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Interactive Startup Map — Tamil Nadu Startup Connect" />
        <meta name="twitter:description" content="Explore Tamil Nadu's startup ecosystem on an interactive map across all 38 districts." />
      </Helmet>

      
      {/* 1. Full-Bleed 100% Map Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <StartupMap
          startups={startups}
          districts={districts}
          selectedStartup={selectedStartup}
          selectedDistrict={districtFilter}
          onSelectStartup={setSelectedStartup}
          onSelectDistrict={(districtSlugOrName) => {
            if (!districtSlugOrName) {
              setDistrictFilter('all');
              return;
            }
            const match = districts.find(
              (d) =>
                d.slug.toLowerCase() === districtSlugOrName.toLowerCase() ||
                d.name.toLowerCase() === districtSlugOrName.toLowerCase()
            );
            if (match) {
              setDistrictFilter(match.slug);
            } else {
              setDistrictFilter(districtSlugOrName.toLowerCase());
            }
            // Automatically switch sort to top momentum for the focused district
            setSortBy('trending');
          }}
          height="100%"
          showDistrictLayer={true}
        />
      </div>

      {/* 2. Floating "Show Stream" Button (Visible only when sidebar is hidden) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden md:flex absolute top-4 left-4 z-30 items-center gap-2 px-4 py-2.5 rounded-full apple-glass-elevated border border-black/[0.08] shadow-apple-modal text-xs font-semibold text-[#1D1D1F] hover:bg-white transition-all apple-press animate-in fade-in duration-200"
        >
          <PanelLeftOpen className="w-4 h-4 text-[#0071E3]" />
          <span>Show Stream ({startups.length})</span>
        </button>
      )}

      {/* 3. Floating Apple Glass Sidebar Card */}
      <div
        className={`hidden md:flex flex-col absolute top-4 left-4 bottom-4 w-96 z-30 rounded-3xl apple-glass-elevated border border-white/80 shadow-apple-modal overflow-hidden transition-all duration-300 ease-out ${
          sidebarOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-black/[0.06] space-y-3 bg-white/60 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-sm text-[#1D1D1F]">
                Venture Stream
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                {startups.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {(districtFilter !== 'all' || sectorFilter !== 'all' || search || stageFilter !== 'all' || hiringOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] rounded-lg hover:bg-black/[0.05] apple-press"
                  title="Reset all filters"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] rounded-lg hover:bg-black/[0.05] apple-press"
                title="Hide sidebar stream"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active District Highlight Pill */}
          {activeDistrictObj && (
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0071E3]/10 border border-[#0071E3]/20 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                <span className="font-bold text-[#1D1D1F] truncate">{activeDistrictObj.name} District</span>
              </div>
              <button
                onClick={() => setDistrictFilter('all')}
                className="p-0.5 text-[#0071E3] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.05]"
                title="Clear district filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, tech, founders..."
              className="w-full text-xs pl-8 pr-7 py-2 bg-black/[0.04] border border-black/[0.06] rounded-2xl placeholder:text-[#86868B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Filter & Sort Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full text-[11px] bg-black/[0.03] border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-[#1D1D1F] font-medium cursor-pointer"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.startupsCount || 0})
                </option>
              ))}
            </select>

            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full text-[11px] bg-black/[0.03] border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-[#1D1D1F] font-medium cursor-pointer"
            >
              <option value="all">All Sectors</option>
              {sectors.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name} ({s.startupsCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-[#86868B] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-[11px] bg-black/[0.03] border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-[#1D1D1F] font-semibold cursor-pointer"
            >
              <option value="trending">Sort: Top Momentum</option>
              <option value="funding">Sort: Highest Funding</option>
              <option value="recent">Sort: Recently Added</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Startups List Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-black/[0.04] bg-white/40 backdrop-blur-md">
          {startups.map((s) => {
            const isSelected = selectedStartup?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStartup(s)}
                className={`p-3.5 rounded-2xl cursor-pointer text-xs transition-all apple-press-subtle ${
                  isSelected
                    ? 'bg-[#0071E3]/10 border border-[#0071E3]/30 shadow-apple-sm'
                    : 'bg-white/80 hover:bg-white border border-black/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white p-0.5 border border-black/[0.08] shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                      {s.logoUrl ? (
                        <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-[#1D1D1F] text-white font-bold flex items-center justify-center text-xs">
                          {s.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-[#1D1D1F] truncate">{s.name}</h4>
                        {s.verificationStatus === 'VERIFIED' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] fill-[#34C759]/10 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#86868B] truncate">{s.sectors.join(', ')}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/[0.04] text-[#86868B] shrink-0">
                    {s.stage}
                  </span>
                </div>

                <p className="text-[#86868B] text-[11px] mt-2 line-clamp-2 leading-relaxed">
                  {s.tagline || s.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[10px] text-apple-tertiary">
                  <div className="flex items-center gap-1 font-medium text-[#86868B]">
                    <MapPin className="w-3 h-3 text-[#0071E3]" />
                    <span>{s.city || s.district}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.isHiring && (
                      <span className="text-[#34C759] font-semibold flex items-center gap-0.5">
                        <Briefcase className="w-2.5 h-2.5" />
                        <span>Hiring</span>
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(s.id);
                      }}
                      className={`p-1 rounded-full transition-all apple-press ${
                        checkIsBookmarked(s.id)
                          ? 'text-[#0071E3]'
                          : 'text-[#86868B] hover:text-[#1D1D1F]'
                      }`}
                      title={checkIsBookmarked(s.id) ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${checkIsBookmarked(s.id) ? 'fill-[#0071E3] text-[#0071E3]' : ''}`} />
                    </button>
                    <Link
                      to={`/startups/${s.slug}`}
                      className="font-bold text-[#0071E3] hover:underline flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {startups.length === 0 && (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-[#86868B]" />
              </div>
              <p className="text-xs font-semibold text-[#1D1D1F]">No startups here yet</p>
              <p className="text-[11px] text-[#86868B] leading-relaxed">The directory is empty or no results match your filters. Reset filters or add your startup.</p>
              <div className="flex gap-2 justify-center flex-wrap pt-1">
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 bg-[#1D1D1F] text-white rounded-full text-[11px] font-semibold apple-press"
                >
                  Reset Filters
                </button>
                <a href="/submit" className="px-3 py-1.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-[11px] font-semibold apple-press">
                  Add Startup
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
