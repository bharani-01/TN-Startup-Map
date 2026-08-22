import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Grid3X3, 
  List, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { StartupCard } from '../components/StartupCard';
import { StartupFilters } from '../components/StartupFilters';
import { Startup, District, Sector } from '../../../types';

export const StartupsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStartups, setTotalStartups] = useState<number>(0);

  // Filters state
  const [filters, setFilters] = useState({
    district: searchParams.get('district') || 'all',
    sector: searchParams.get('sector') || 'all',
    stage: searchParams.get('stage') || 'all',
    foundedYear: searchParams.get('foundedYear') || 'all',
    fundingType: searchParams.get('fundingType') || 'all',
    isHiring: searchParams.get('isHiring') === 'true',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'trending',
  });

  // Load reference metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [distRes, secRes] = await Promise.all([
          fetch('/api/districts').then((r) => r.json()),
          fetch('/api/sectors').then((r) => r.json()),
        ]);
        if (distRes.success) setDistricts(distRes.data);
        if (secRes.success) setSectors(secRes.data);
      } catch (err) {
        console.error('Failed to load reference data:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch startups whenever filters or page change
  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.district !== 'all') params.append('district', filters.district);
      if (filters.sector !== 'all') params.append('sector', filters.sector);
      if (filters.stage !== 'all') params.append('stage', filters.stage);
      if (filters.foundedYear !== 'all') params.append('foundedYear', filters.foundedYear);
      if (filters.fundingType !== 'all') params.append('fundingType', filters.fundingType);
      if (filters.isHiring) params.append('isHiring', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      params.append('page', String(page));
      params.append('limit', '12');

      setSearchParams(params);

      try {
        const res = await fetch(`/api/startups?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStartups(data.data);
          if (data.meta) {
            setTotalPages(data.meta.totalPages || 1);
            setTotalStartups(data.meta.total || data.data.length);
          }
        }
      } catch (err) {
        console.error('Error fetching startups directory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [filters, page, setSearchParams]);

  const handleResetFilters = () => {
    setFilters({
      district: 'all',
      sector: 'all',
      stage: 'all',
      foundedYear: 'all',
      fundingType: 'all',
      isHiring: false,
      search: '',
      sortBy: 'trending',
    });
    setPage(1);
  };

  return (
    <div className="relative min-h-screen pb-24 bg-[#F5F5F7]">
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />

      {/* Main Content Layer */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-12 space-y-8">
        
        {/* SOTA Canvas-Native Page Header (Unboxed, Pure Art & Editorial) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-2.5">
            {/* Live Beacon Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071E3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071E3]" />
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                Indexed Intelligence • All 38 Districts
              </span>
            </div>

            {/* Majestic Headline */}
            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1D1D1F] tracking-[-0.035em] leading-[1.08] pb-1">
              Verified Tamil Nadu <br />
              <span className="inline-block text-3xl sm:text-5xl lg:text-6xl text-[#0071E3] pr-3 sm:pr-5 pb-1">
                Startup Directory
              </span>
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#555558] max-w-2xl font-normal leading-relaxed">
              Explore 500+ verified technology companies, deeptech spin-offs, and high-velocity startups across all 38 districts of Tamil Nadu.
            </p>
          </div>

          {/* View Mode Segmented Control (Canvas Native) */}
          <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-black/[0.06] shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all apple-press-subtle cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all apple-press-subtle cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Multi-facet Filter Toolbar (Zero Floating Containers) */}
        <StartupFilters
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
          onReset={handleResetFilters}
          districts={districts}
          sectors={sectors}
          totalResults={totalStartups}
        />

        {/* Startup Grid / Stream */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
            <p className="text-xs text-[#86868B] font-mono">Loading verified startups from database...</p>
          </div>
        ) : startups.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#86868B]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#1D1D1F] font-display">No startups here yet</h3>
              <p className="text-sm text-[#86868B] max-w-sm mx-auto leading-relaxed">
                No ventures match your current filters, or the directory is being populated. Try resetting your filters or be the first to add your startup.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-2xs apple-press cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <a
                href="/submit"
                className="px-5 py-2.5 bg-[#F5F5F7] text-[#1D1D1F] text-xs font-semibold rounded-full inline-flex items-center gap-1.5 apple-press cursor-pointer"
              >
                <span>Add Your Startup</span>
              </a>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} viewMode="list" />
            ))}
          </div>
        )}

        {/* Pagination Controls (Canvas Native) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/[0.06] pt-6 text-xs text-[#86868B]">
            <p className="font-mono">
              Page <span className="font-bold text-[#1D1D1F]">{page}</span> of{' '}
              <span className="font-bold text-[#1D1D1F]">{totalPages}</span> ({totalStartups} total indexed)
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all apple-press shadow-2xs cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3.5 py-1 bg-white/90 border border-black/[0.06] rounded-full font-bold font-mono text-[#1D1D1F] shadow-2xs">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all apple-press shadow-2xs cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
