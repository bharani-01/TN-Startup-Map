import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Compass, ArrowRight, Layers, MapPin, Sparkles } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedLeaders } from '../components/FeaturedLeaders';
import { StartupMap } from '../map/StartupMap';
import { DistrictCard } from '../components/DistrictCard';
import { NearMeSection } from '../components/NearMeSection';
import { RecentlyAdded } from '../components/RecentlyAdded';
import { RecentlyFunded } from '../components/RecentlyFunded';
import { TrendingStartups } from '../components/TrendingStartups';
import { Startup, District, Sector, EcosystemStats, BlogPost } from '../../../types';

export const HomePage: React.FC = () => {
  const { onOpenSearch } = useOutletContext<{ onOpenSearch: () => void }>();
  const [stats, setStats] = useState<EcosystemStats | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
  const [trendingStartups, setTrendingStartups] = useState<Startup[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [statsRes, startupsRes, districtsRes, sectorsRes, recentRes, trendingRes, blogsRes] = await Promise.all([
          fetch('/api/stats').then((r) => r.json()),
          fetch('/api/startups?limit=100').then((r) => r.json()),
          fetch('/api/districts').then((r) => r.json()),
          fetch('/api/sectors').then((r) => r.json()),
          fetch('/api/startups/recent?limit=8').then((r) => r.json()),
          fetch('/api/startups/trending?limit=8').then((r) => r.json()),
          fetch('/api/blogs/featured?limit=3').then((r) => r.json()),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (startupsRes.success) setStartups(startupsRes.data);
        if (districtsRes.success) setDistricts(districtsRes.data);
        if (sectorsRes.success) setSectors(sectorsRes.data);
        if (recentRes.success) setRecentStartups(recentRes.data);
        if (trendingRes.success) setTrendingStartups(trendingRes.data);
        if (blogsRes.success) setFeaturedBlogs(blogsRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage ecosystem data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="relative min-h-screen pb-24 bg-[#F5F5F7]">
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />

      {/* Main Page Content Layer */}
      <div className="relative z-10">
        {/* 1. Keynote Hero Section */}
        <HeroSection onOpenSearch={onOpenSearch} />

        <div className="space-y-10 sm:space-y-14 pt-4 sm:pt-6">
          {/* 2. Featured Innovation Leaders Showcase */}
          <FeaturedLeaders />

      {/* 3. Sectors Explorer Strip */}
      {sectors.length > 0 && (
        <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-[#86868B] uppercase tracking-wider">
              Explore by Industry Sector
            </h3>
            <Link to="/startups" className="text-xs sm:text-sm font-semibold text-[#0071E3] hover:text-[#0077ED] apple-press">
              View All Sectors →
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
            {sectors.map((sec) => (
              <Link
                key={sec.id}
                to={`/startups?sector=${encodeURIComponent(sec.name)}`}
                className="group flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 rounded-full border border-black/[0.07] hover:border-[#0071E3]/40 shadow-2xs hover:shadow-apple-sm shrink-0 transition-all text-xs font-semibold text-[#1D1D1F] hover:text-[#0071E3] apple-press-subtle"
              >
                <div
                  className="w-2 h-2 rounded-full shadow-2xs"
                  style={{ backgroundColor: sec.color || '#0071E3' }}
                />
                <span>{sec.name}</span>
                <span className="text-[10px] font-bold text-[#86868B] group-hover:text-[#0071E3] bg-black/[0.04] px-1.5 py-0.2 rounded-full">
                  {sec.startupsCount || 0}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Interactive Map Spatial Intelligence Layer Preview */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="apple-glass-card rounded-3xl p-6 sm:p-10 space-y-6 border border-white/80 shadow-apple-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs sm:text-sm font-semibold mb-2">
                <Compass className="w-4 h-4" />
                <span>Spatial Intelligence Layer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1D1D1F] tracking-tight">
                Interactive Tamil Nadu Startup Map
              </h2>
              <p className="text-sm text-[#86868B] mt-1 max-w-2xl">
                Explore clusters, district boundaries, and verified innovation ventures across Tamil Nadu.
              </p>
            </div>

            <Link
              to="/map"
              className="px-6 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-apple-sm flex items-center justify-center gap-2 transition-all shrink-0 apple-press"
            >
              <span>Launch Full-Screen Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Embedded Map Container */}
          <div className="h-[480px] sm:h-[600px] w-full rounded-2xl overflow-hidden shadow-inner border border-black/[0.06]">
            <StartupMap
              startups={startups}
              districts={districts}
              height="100%"
              showDistrictLayer={true}
            />
          </div>
        </div>
      </section>

      {/* 5. Trending Startups Section */}
      <TrendingStartups startups={trendingStartups} />

      {/* 6. Hyperlocal "Near Me" Section */}
      <NearMeSection />

      {/* 7. Tamil Nadu District Hubs */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-[#5856D6]/10 text-[#5856D6]">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1D1D1F] tracking-tight">
                Tamil Nadu District Hubs
              </h2>
            </div>
            <p className="text-sm text-[#86868B] mt-1 max-w-2xl">
              From Chennai's SaaS corridor to Hosur's EV ecosystem and Coimbatore's advanced engineering.
            </p>
          </div>

          <Link
            to="/districts"
            className="text-sm font-semibold text-[#0071E3] hover:text-[#0077ED] flex items-center gap-1 shrink-0 apple-press"
          >
            <span>View All 38 Districts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {districts.slice(0, 8).map((district) => (
            <DistrictCard key={district.id} district={district} />
          ))}
        </div>
      </section>

      {/* 8. Recently Added Startups */}
      <RecentlyAdded startups={recentStartups} />

      {/* 9. Recently Funded Rounds */}
      <RecentlyFunded startups={startups} />

      {/* 10. Ecosystem Stories & Founder Insights */}
      {featuredBlogs.length > 0 && (
        <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-[#0071E3]/10 text-[#0071E3]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1D1D1F] tracking-tight">
                  Ecosystem Stories & Founder Insights
                </h2>
              </div>
              <p className="text-sm text-[#86868B] mt-1 max-w-2xl">
                Engineering breakthroughs, manufacturing playbooks, and venture building stories from Tamil Nadu founders.
              </p>
            </div>

            <Link
              to="/blog"
              className="text-sm font-semibold text-[#0071E3] hover:text-[#0077ED] flex items-center gap-1 shrink-0 apple-press"
            >
              <span>Explore All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((b) => (
              <article
                key={b.id}
                className="bg-white rounded-3xl overflow-hidden border border-black/[0.08] shadow-apple-card hover:shadow-apple-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link to={`/blog/${b.slug}`} className="block h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={b.coverImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'}
                      alt={b.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1D1D1F] shadow-apple-sm">
                        {b.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#86868B]">
                      <span>{new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{b.readTimeMinutes} min read</span>
                    </div>
                    <h4 className="text-base font-bold font-display text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors line-clamp-2">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h4>
                    {b.subtitle && (
                      <p className="text-xs text-[#86868B] line-clamp-2 leading-relaxed">
                        {b.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4 bg-slate-50/50 border-t border-black/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                      {b.authorName.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-[#1D1D1F] truncate max-w-[150px]">{b.authorName}</span>
                  </div>
                  <Link to={`/blog/${b.slug}`} className="text-xs font-semibold text-[#0071E3] flex items-center gap-1 hover:underline">
                    Read Story →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
        </div>
      </div>
    </div>
  );
};
