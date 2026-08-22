import React from 'react';
import { Search, RotateCcw, MapPin, Layers, Briefcase, Calendar, ArrowUpDown, X } from 'lucide-react';
import { District, Sector } from '../../../types';

interface FilterState {
  district: string;
  sector: string;
  stage: string;
  foundedYear: string;
  fundingType: string;
  isHiring: boolean;
  search: string;
  sortBy: string;
}

interface StartupFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  districts: District[];
  sectors: Sector[];
  totalResults: number;
}

const TOP_SECTORS = [
  'All',
  'AI',
  'SaaS',
  'DeepTech',
  'EV',
  'Mobility',
  'FinTech',
  'EdTech',
  'Agritech',
  'SpaceTech',
  'Cybersecurity',
  'Robotics',
];

const STAGES = ['All', 'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Acquired'];
const YEARS = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', 'Earlier'];

export const StartupFilters: React.FC<StartupFiltersProps> = ({
  filters,
  onChange,
  onReset,
  districts,
  sectors,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.district !== 'all' ||
    filters.sector !== 'all' ||
    filters.stage !== 'all' ||
    filters.foundedYear !== 'all' ||
    filters.fundingType !== 'all' ||
    filters.isHiring ||
    Boolean(filters.search);

  const updateField = (key: keyof FilterState, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* 1. Primary Search & Quick Sector Pills Bar (Canvas Native) */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Input Capsule */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
            placeholder="Search by venture name, domain, tags, or founders..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/90 hover:bg-white border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 focus:outline-hidden text-xs sm:text-sm font-medium text-[#1D1D1F] placeholder:text-[#86868B] transition-all shadow-2xs"
          />
          {filters.search && (
            <button
              onClick={() => updateField('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05]"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Match Info */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#86868B]" />
            <span className="text-[#86868B]">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateField('sortBy', e.target.value)}
              className="bg-transparent font-bold text-[#1D1D1F] focus:outline-hidden cursor-pointer"
            >
              <option value="trending">Trending Score</option>
              <option value="recent">Recently Added</option>
              <option value="founded">Founded Year</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 rounded-2xl transition-all apple-press shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Instant Quick Sector Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
        {TOP_SECTORS.map((sec) => {
          const isSelected = (sec === 'All' && filters.sector === 'all') || filters.sector.toLowerCase() === sec.toLowerCase();
          return (
            <button
              key={sec}
              onClick={() => updateField('sector', sec === 'All' ? 'all' : sec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer apple-press-subtle ${
                isSelected
                  ? 'bg-[#1D1D1F] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
              }`}
            >
              {sec}
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Facet Selectors (District, Stage, Year, Hiring) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        
        {/* District Selector */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-black/[0.06] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs">
            <MapPin className="w-3 h-3 text-[#0071E3] shrink-0" />
            <select
              value={filters.district}
              onChange={(e) => updateField('district', e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#1D1D1F] focus:outline-hidden cursor-pointer truncate"
            >
              <option value="all">All 38 Districts</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} {d.startupsCount ? `(${d.startupsCount})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Selector */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-black/[0.06] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs">
            <Briefcase className="w-3 h-3 text-[#5856D6] shrink-0" />
            <select
              value={filters.stage}
              onChange={(e) => updateField('stage', e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#1D1D1F] focus:outline-hidden cursor-pointer truncate"
            >
              <option value="all">All Venture Stages</option>
              {STAGES.filter((s) => s !== 'All').map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Founded Year */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-black/[0.06] text-xs font-medium text-[#1D1D1F] transition-all shadow-2xs">
            <Calendar className="w-3 h-3 text-[#34C759] shrink-0" />
            <select
              value={filters.foundedYear}
              onChange={(e) => updateField('foundedYear', e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#1D1D1F] focus:outline-hidden cursor-pointer truncate"
            >
              <option value="all">All Founded Years</option>
              {YEARS.filter((y) => y !== 'All').map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hiring Filter Toggle */}
        <button
          onClick={() => updateField('isHiring', !filters.isHiring)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer apple-press-subtle shadow-2xs ${
            filters.isHiring
              ? 'bg-[#FF9500] text-white border-[#FF9500]'
              : 'bg-white/80 hover:bg-white text-[#1D1D1F] border-black/[0.06]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Hiring Only</span>
        </button>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#86868B] font-mono pt-1">
        <span>Showing <strong className="text-[#1D1D1F]">{totalResults}</strong> verified Tamil Nadu startups</span>
        {hasActiveFilters && (
          <span className="text-[#0071E3] font-sans font-medium">Filtered Results</span>
        )}
      </div>

    </div>
  );
};
