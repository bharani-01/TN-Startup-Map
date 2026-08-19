import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, DollarSign, Calendar } from 'lucide-react';
import { Startup } from '../../../types';

interface RecentlyFundedProps {
  startups: Startup[];
}

export const RecentlyFunded: React.FC<RecentlyFundedProps> = ({ startups }) => {
  // Extract recent rounds
  const fundedItems: Array<{
    startup: Startup;
    round: any;
  }> = [];

  startups.forEach((s) => {
    if (s.fundingRounds && s.fundingRounds.length > 0) {
      const latest = s.fundingRounds[s.fundingRounds.length - 1];
      fundedItems.push({
        startup: s,
        round: latest,
      });
    }
  });

  if (fundedItems.length === 0) return null;

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-apple-rose/10 text-apple-rose">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-apple-text tracking-tight">
              Recently Funded Rounds
            </h2>
          </div>
          <p className="text-sm text-apple-secondary mt-1 max-w-2xl">
            Latest capital infusions, seed checks, and venture investments in Tamil Nadu.
          </p>
        </div>

        <Link
          to="/startups?fundingType=Venture+funded"
          className="text-sm font-semibold text-apple-blue hover:text-apple-blueHover flex items-center gap-1 shrink-0 apple-press"
        >
          <span>View All Funded Startups</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fundedItems.slice(0, 8).map(({ startup, round }) => (
          <Link
            key={`${startup.id}-${round.date}`}
            to={`/startups/${startup.slug}`}
            className="group apple-card p-6 sm:p-7 bg-white/95 hover:bg-white rounded-3xl border border-black/[0.07] hover:border-apple-blue/30 shadow-apple-card hover:shadow-apple-hover flex flex-col justify-between apple-press-subtle min-h-[290px]"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-black/[0.08] shadow-apple-sm flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-apple-text via-slate-900 to-slate-800 text-white font-display font-bold text-base flex items-center justify-center">
                        {startup.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-apple-text group-hover:text-apple-blue transition-colors truncate">
                      {startup.name}
                    </h3>
                    <p className="text-xs text-apple-secondary font-medium truncate">{startup.district}, TN</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-apple-emerald/10 text-apple-emerald border border-apple-emerald/20 shrink-0 whitespace-nowrap">
                  {round.amountInr || round.amountUsd || 'Undisclosed'}
                </span>
              </div>

              {/* Round Details Pill Card */}
              <div className="mt-5 p-4 rounded-2xl bg-black/[0.03] border border-black/[0.04] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-apple-secondary font-medium">Round:</span>
                  <span className="font-bold text-apple-text">{round.roundType}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-apple-secondary font-medium">Date:</span>
                  <span className="text-apple-text font-medium">{round.date}</span>
                </div>

                {round.investors && round.investors.length > 0 && (
                  <div className="pt-2 border-t border-black/[0.06]">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-apple-tertiary block mb-0.5">Key Investors</span>
                    <p className="font-medium text-apple-text text-xs line-clamp-1">
                      {round.investors.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-black/[0.05] flex items-center justify-between text-xs sm:text-sm text-apple-secondary">
              <span className="text-apple-tertiary">{startup.sectors[0]} Sector</span>
              <span className="text-apple-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
