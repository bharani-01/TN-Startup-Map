import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Startup } from '../../../types';
import { StartupCard } from './StartupCard';

interface RecentlyAddedProps {
  startups: Startup[];
}

export const RecentlyAdded: React.FC<RecentlyAddedProps> = ({ startups }) => {
  if (!startups || startups.length === 0) return null;

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-apple-blue/10 text-apple-blue">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-apple-text tracking-tight">
              Recently Added Startups
            </h2>
          </div>
          <p className="text-sm text-apple-secondary mt-1 max-w-2xl">
            Newest innovation ventures indexed and verified in the Tamil Nadu directory.
          </p>
        </div>

        <Link
          to="/startups?sortBy=recent"
          className="text-sm font-semibold text-apple-blue hover:text-apple-blueHover flex items-center gap-1 shrink-0 apple-press"
        >
          <span>View All Newly Added</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {startups.slice(0, 8).map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </section>
  );
};
