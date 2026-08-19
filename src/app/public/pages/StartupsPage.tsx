import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Grid3X3, 
  List, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw 
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
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Tamil Nadu Ecosystem Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Discover Tamil Nadu Startups
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] mt-1">
            Browse, filter, and discover verified technology ventures across all 38 districts.
          </p>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 bg-black/[0.04] p-1.5 rounded-full border border-black/[0.04] self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all apple-press-subtle ${
              viewMode === 'grid'
                ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
            title="Grid View"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all apple-press-subtle ${
              viewMode === 'list'
                ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Multi-facet Filter Panel */}
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
          <p className="text-xs text-[#86868B] font-medium">Loading startups from Tamil Nadu database...</p>
        </div>
      ) : startups.length === 0 ? (
        <div className="py-16 text-center apple-glass-card rounded-3xl border border-black/[0.06] p-8 space-y-4 shadow-apple-sm">
          <Building2 className="w-12 h-12 text-apple-tertiary mx-auto" />
          <h3 className="text-lg font-bold text-[#1D1D1F] font-display">No Startups Found</h3>
          <p className="text-xs text-[#86868B] max-w-md mx-auto">
            No ventures match your active filters. Try clearing some filters or searching for another term.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-apple-sm apple-press"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {startups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {startups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} viewMode="list" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-black/[0.06] pt-6 text-xs text-[#86868B]">
          <p>
            Showing page <span className="font-bold text-[#1D1D1F]">{page}</span> of{' '}
            <span className="font-bold text-[#1D1D1F]">{totalPages}</span> ({totalStartups} total)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all apple-press shadow-2xs"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-black/[0.04] rounded-full font-bold text-[#1D1D1F]">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all apple-press shadow-2xs"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
