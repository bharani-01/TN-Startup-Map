import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Award, ArrowRight } from 'lucide-react';
import { District } from '../../../types';

interface DistrictCardProps {
  district: District;
}

export const DistrictCard: React.FC<DistrictCardProps> = ({ district }) => {
  return (
    <Link
      to={`/districts/${district.slug}`}
      className="group apple-card relative flex flex-col justify-between p-6 sm:p-7 bg-white/95 hover:bg-white rounded-3xl border border-black/[0.07] hover:border-apple-blue/30 shadow-apple-card hover:shadow-apple-hover apple-press-subtle min-h-[260px]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-apple-blue/10 text-apple-blue font-bold flex items-center justify-center font-display text-base group-hover:bg-apple-blue group-hover:text-white transition-colors duration-200 shadow-2xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-apple-text group-hover:text-apple-blue transition-colors">
                {district.name}
              </h3>
              <p className="text-xs text-apple-secondary font-medium">
                HQ: {district.headquarters}
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
            {district.startupsCount || 0} Startups
          </span>
        </div>

        <p className="text-sm text-apple-secondary mt-4 line-clamp-2 leading-relaxed font-normal">
          {district.description}
        </p>

        {/* Key Sectors Pills */}
        {district.keySectors && district.keySectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {district.keySectors.slice(0, 3).map((sec) => (
              <span
                key={sec}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-black/[0.03] text-apple-text border border-black/[0.05]"
              >
                {sec}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center justify-between text-xs sm:text-sm text-apple-secondary">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-apple-purple" />
          <span>{district.incubatorsCount || 1} Incubation Hubs</span>
        </div>

        <span className="text-apple-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Explore Hub</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};
