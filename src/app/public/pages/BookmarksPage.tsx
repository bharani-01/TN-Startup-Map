import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, LayoutGrid, List, Trash2, ArrowRight, Building2, MapPin, Layers, Lock, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { useBookmarks } from '../../../context/BookmarkContext';
import { useAuth } from '../../../context/AuthContext';
import { Startup } from '../../../types';
import { StartupCard } from '../components/StartupCard';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, clearBookmarks } = useBookmarks();
  
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBookmarkedStartups = async () => {
      if (bookmarkedIds.length === 0) {
        setStartups([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/startups?limit=5000');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const filtered = data.data.filter((s: Startup) => bookmarkedIds.includes(s.id));
          setStartups(filtered);
        }
      } catch (err) {
        console.error('Error fetching bookmarked startups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedStartups();
  }, [bookmarkedIds]);

  // Derived filter options
  const sectors = React.useMemo(() => {
    const set = new Set<string>();
    startups.forEach((s) => s.sectors.forEach((sec) => set.add(sec)));
    return Array.from(set).sort();
  }, [startups]);

  const districts = React.useMemo(() => {
    const set = new Set<string>();
    startups.forEach((s) => set.add(s.district));
    return Array.from(set).sort();
  }, [startups]);

  const displayedStartups = startups.filter((s) => {
    if (sectorFilter !== 'all' && !s.sectors.includes(sectorFilter)) return false;
    if (districtFilter !== 'all' && s.district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="apple-glass-card rounded-3xl border border-black/[0.08] p-8 sm:p-12 shadow-apple-card max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#1D1D1F] text-white flex items-center justify-center mx-auto shadow-apple-sm">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1D1F] tracking-tight">
              Sign In to View Bookmarks
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              Create an account or sign in to save startups, track venture funding milestones, and sync your bookmarks across sessions.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login?redirect=/bookmarks"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs shadow-md transition-all apple-press"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.08] text-[#1D1D1F] font-semibold text-xs shadow-apple-sm transition-all apple-press"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8 min-h-[calc(100vh-64px)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-600">
              <Bookmark className="w-5 h-5 fill-amber-500" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#1D1D1F] tracking-tight">
              My Saved Startups
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0071E3]/10 text-[#0071E3]">
              {bookmarkedIds.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#86868B] mt-1">
            Personalized collection of Tamil Nadu ventures saved for tracking, investment, or hiring.
          </p>
        </div>

        {bookmarkedIds.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={clearBookmarks}
              className="px-3.5 py-2 rounded-full border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-all apple-press"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <Link
              to="/startups"
              className="px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold shadow-apple-sm transition-all apple-press flex items-center gap-1.5"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {bookmarkedIds.length === 0 ? (
        /* Empty State */
        <div className="apple-glass-card rounded-3xl border border-black/[0.06] p-12 text-center max-w-lg mx-auto space-y-4 shadow-apple-sm my-12">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#1D1D1F]">
              No Saved Startups Yet
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Click the bookmark icon on any startup card across the interactive map or directory to save ventures here for quick access.
            </p>
          </div>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/map"
              className="px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold shadow-md transition-all apple-press flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Spatial Map</span>
            </Link>
            <Link
              to="/startups"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-black/[0.08] text-[#1D1D1F] text-xs font-semibold shadow-apple-sm transition-all apple-press"
            >
              <span>Browse Startups</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-black/[0.02] p-3 rounded-2xl border border-black/[0.04]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {sectors.length > 1 && (
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-[#1D1D1F] font-semibold cursor-pointer shadow-2xs"
                >
                  <option value="all">All Sectors ({startups.length})</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}

              {districts.length > 1 && (
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-[#1D1D1F] font-semibold cursor-pointer shadow-2xs"
                >
                  <option value="all">All Districts ({startups.length})</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black/[0.08] shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1D1D1F] text-white shadow-2xs'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1D1D1F] text-white shadow-2xs'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid / List */}
          {displayedStartups.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#86868B]">
              No saved startups match your active sector/district filter.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedStartups.map((s) => (
                <StartupCard key={s.id} startup={s} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedStartups.map((s) => (
                <StartupCard key={s.id} startup={s} viewMode="list" />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};
