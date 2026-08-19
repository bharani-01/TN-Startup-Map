import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Filter, Building2, MapPin, ArrowRight } from 'lucide-react';
import { Startup } from '../../../types';

interface MapDrawerProps {
  startups: Startup[];
  selectedStartup: Startup | null;
  onSelectStartup: (s: Startup) => void;
  onFilterClick?: () => void;
}

export const MapDrawer: React.FC<MapDrawerProps> = ({
  startups,
  selectedStartup,
  onSelectStartup,
  onFilterClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-30 apple-glass-elevated rounded-t-[32px] border-t border-black/[0.08] shadow-apple-modal transition-all duration-300 ease-out ${
        isOpen ? 'h-[75vh]' : 'h-24'
      }`}
    >
      {/* Apple Drag Handle / Header Bar */}
      <div 
        className="px-5 py-3 border-b border-black/[0.06] flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-1 bg-black/[0.2] rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-apple-blue" />
            <span className="font-bold text-sm text-apple-text">
              {startups.length} Startups in TN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {onFilterClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterClick();
              }}
              className="px-3 py-1 text-apple-text bg-black/[0.04] rounded-full text-xs font-semibold flex items-center gap-1 apple-press"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}
          <button className="p-1.5 text-apple-secondary hover:text-apple-text rounded-full">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer Scrollable Content Stream */}
      <div className="h-[calc(100%-60px)] overflow-y-auto p-4 space-y-3">
        {startups.map((s) => {
          const isSelected = selectedStartup?.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelectStartup(s)}
              className={`p-4 rounded-2xl border text-xs transition-all apple-press-subtle ${
                isSelected
                  ? 'border-apple-blue bg-apple-blue/10 shadow-apple-sm ring-1 ring-apple-blue'
                  : 'border-black/[0.06] bg-white hover:border-black/[0.12]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-apple-text">{s.name}</h4>
                  <p className="text-apple-secondary text-[11px] mt-0.5">{s.sectors.join(' • ')}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/[0.04] text-apple-secondary">
                  {s.stage}
                </span>
              </div>

              <p className="text-apple-secondary text-xs mt-2 line-clamp-2 leading-relaxed font-normal">
                {s.tagline || s.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-apple-secondary">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-apple-tertiary" />
                  <span>{s.district}</span>
                </div>
                <span className="text-apple-blue font-semibold flex items-center gap-0.5">
                  View on Map <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
