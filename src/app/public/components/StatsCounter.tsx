import React from 'react';
import { Building2, MapPin, Briefcase, Zap, Layers, Award, Sparkles } from 'lucide-react';
import { EcosystemStats } from '../../../types';

interface StatsCounterProps {
  stats: EcosystemStats | null;
  loading?: boolean;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ stats, loading = false }) => {
  const statItems = [
    {
      label: 'Verified Startups',
      value: stats?.totalStartups ?? 0,
      icon: Building2,
      color: 'text-apple-blue',
      bg: 'bg-apple-blue/10 text-apple-blue',
      border: 'hover:border-apple-blue/30',
    },
    {
      label: 'Districts Covered',
      value: stats?.totalDistricts ?? 38,
      icon: MapPin,
      color: 'text-apple-emerald',
      bg: 'bg-apple-emerald/10 text-apple-emerald',
      border: 'hover:border-apple-emerald/30',
    },
    {
      label: 'Industry Sectors',
      value: stats?.totalSectors ?? 17,
      icon: Layers,
      color: 'text-apple-indigo',
      bg: 'bg-apple-indigo/10 text-apple-indigo',
      border: 'hover:border-apple-indigo/30',
    },
    {
      label: 'Incubation Hubs',
      value: stats?.totalIncubators ?? 0,
      icon: Award,
      color: 'text-apple-purple',
      bg: 'bg-apple-purple/10 text-apple-purple',
      border: 'hover:border-apple-purple/30',
    },
    {
      label: 'Actively Hiring',
      value: stats?.startupsHiring ?? 0,
      icon: Briefcase,
      color: 'text-apple-amber',
      bg: 'bg-apple-amber/10 text-apple-amber',
      border: 'hover:border-apple-amber/30',
    },
    {
      label: 'Funded Ventures',
      value: stats?.recentlyFundedCount ?? 0,
      icon: Zap,
      color: 'text-apple-rose',
      bg: 'bg-apple-rose/10 text-apple-rose',
      border: 'hover:border-apple-rose/30',
    },
  ];

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`apple-glass-card rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center justify-between border border-white/80 shadow-apple-card apple-card transition-all duration-200 ${item.border}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} mb-3 shadow-2xs`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-apple-text tracking-[-0.03em] leading-tight">
                {loading ? (
                  <div className="w-16 h-8 bg-black/[0.05] animate-pulse rounded-md mx-auto" />
                ) : (
                  <span>{item.value}</span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-apple-secondary mt-1.5 tracking-normal">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
