import React from 'react';
import { Filter, RotateCcw, MapPin, Layers, Briefcase, Calendar, ArrowUpDown } from 'lucide-react';
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

export const StartupFilters: React.FC<StartupFiltersProps> = ({
  filters,
  onChange,
  onReset,
  districts,
  sectors,
  totalResults,
}) => {
  const STAGES = ['All', 'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Acquired'];
  const YEARS = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', 'Earlier'];

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
    <div className="apple-glass-card rounded-3xl p-5 sm:p-6 space-y-4 border border-black/[0.06] shadow-apple-card">
      {/* Top Filter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-black/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] text-apple-text flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-apple-text">Filter Directory</span>
            <span className="text-xs text-apple-secondary font-medium ml-2">({totalResults} matches)</span>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-apple-rose hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/15 rounded-full transition-all apple-press"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* District Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-apple-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-apple-tertiary" />
            District
          </label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => updateField('district', e.target.value)}
              className="w-full text-xs font-medium text-apple-text bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all cursor-pointer"
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

        {/* Sector Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-apple-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-apple-tertiary" />
            Sector / Industry
          </label>
          <select
            value={filters.sector}
            onChange={(e) => updateField('sector', e.target.value)}
            className="w-full text-xs font-medium text-apple-text bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all cursor-pointer"
          >
            <option value="all">All Sectors</option>
            {sectors.map((sec) => (
              <option key={sec.slug} value={sec.name}>
                {sec.name} {sec.startupsCount ? `(${sec.startupsCount})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-apple-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-apple-tertiary" />
            Venture Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => updateField('stage', e.target.value)}
            className="w-full text-xs font-medium text-apple-text bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all cursor-pointer"
          >
            {STAGES.map((stg) => (
              <option key={stg} value={stg === 'All' ? 'all' : stg}>
                {stg === 'All' ? 'All Stages' : stg}
              </option>
            ))}
          </select>
        </div>

        {/* Founded Year */}
        <div>
          <label className="block text-[11px] font-semibold text-apple-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-apple-tertiary" />
            Founded Year
          </label>
          <select
            value={filters.foundedYear}
            onChange={(e) => updateField('foundedYear', e.target.value)}
            className="w-full text-xs font-medium text-apple-text bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.06] rounded-2xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all cursor-pointer"
          >
            {YEARS.map((yr) => (
              <option key={yr} value={yr === 'All' ? 'all' : yr}>
                {yr === 'All' ? 'All Years' : yr}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Secondary Bar: Tactile Toggle Pills & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Hiring Toggle Pill */}
          <button
            onClick={() => updateField('isHiring', !filters.isHiring)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all apple-press ${
              filters.isHiring
                ? 'bg-apple-amber text-white border-apple-amber shadow-apple-sm'
                : 'bg-black/[0.03] text-apple-text border-black/[0.06] hover:bg-black/[0.06]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Actively Hiring Startups Only</span>
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-apple-secondary font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value)}
            className="text-xs font-semibold text-apple-text bg-black/[0.03] hover:bg-black/[0.05] border border-black/[0.06] rounded-full px-3 py-1.5 focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="trending">Trending Score</option>
            <option value="recent">Recently Added</option>
            <option value="founded">Founded Year</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
