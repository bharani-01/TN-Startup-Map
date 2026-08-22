import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { District } from '../../../types';

interface DistrictCardProps {
  district: District;
}

export const DistrictCard: React.FC<DistrictCardProps> = ({ district }) => {
  return (
    <Link
      to={`/districts/${district.slug}`}
      className="group flex flex-col justify-between p-6 rounded-3xl bg-white/90 hover:bg-white border border-black/[0.06] hover:border-[#0071E3]/40 shadow-2xs hover:shadow-apple-sm transition-all duration-300 apple-press-subtle min-h-[250px] text-left"
    >
      <div className="space-y-3.5">
        {/* Header: Title + Startup Count */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
              {district.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#86868B] mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
              <span>HQ: {district.headquarters}</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/[0.04] text-[#1D1D1F] group-hover:bg-[#0071E3]/10 group-hover:text-[#0071E3] transition-colors shrink-0">
            {district.startupsCount || 0} Startups
          </span>
        </div>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm text-[#555558] line-clamp-2 leading-relaxed font-normal">
          {district.description || `Innovation ecosystem and venture hub in ${district.name}, Tamil Nadu.`}
        </p>

        {/* Key Specialization Pills */}
        {district.keySectors && district.keySectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {district.keySectors.slice(0, 3).map((sec) => (
              <span
                key={sec}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F5F7] text-[#555558] border border-black/[0.03]"
              >
                {sec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Incubators + Action */}
      <div className="pt-4 mt-4 border-t border-black/[0.04] flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[#86868B]">
          <Building2 className="w-3.5 h-3.5 text-[#5856D6]" />
          <span>{district.incubatorsCount || 1} Incubation Centers</span>
        </div>

        <span className="text-[#0071E3] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Explore Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
