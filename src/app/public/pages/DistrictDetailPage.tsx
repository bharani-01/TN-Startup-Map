import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { canonicalUrl, OG_DEFAULT_IMAGE } from '../../../utils/seo';
import { MapPin, Building2, Award, ArrowLeft, Layers, Compass, Loader2 } from 'lucide-react';
import { District, Startup } from '../../../types';
import { StartupCard } from '../components/StartupCard';
import { StartupMap } from '../map/StartupMap';

export const DistrictDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [district, setDistrict] = useState<District | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistrict = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/districts/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setDistrict(data.data.district);
          setStartups(data.data.startups);
        } else {
          setError(data.message || 'District not found');
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDistrict();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-36 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs text-[#86868B] font-medium">Loading district hub...</p>
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1D1D1F] font-display">District Not Found</h2>
        <button
          onClick={() => navigate('/map')}
          className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-2xs apple-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Spatial Map</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-12 space-y-8">
      <Helmet>
        <title>{district.name} District — Tamil Nadu Startup Connect</title>
        <meta name="description" content={`Explore the startup ecosystem in ${district.name}, Tamil Nadu. Discover ${startups.length} verified ventures, innovation clusters, and founders in this district.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl(`/districts/${district.slug}`)} />
        <meta property="og:title" content={`${district.name} District — Tamil Nadu Startup Connect`} />
        <meta property="og:description" content={`Explore ${startups.length} verified startups and the innovation ecosystem in ${district.name}, Tamil Nadu.`} />
        <meta property="og:url" content={canonicalUrl(`/districts/${district.slug}`)} />
        <meta property="og:image" content={OG_DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${district.name} District — Tamil Nadu Startup Connect`} />
        <meta name="twitter:description" content={`Explore ${startups.length} verified startups in ${district.name}, Tamil Nadu.`} />
      </Helmet>

      
      {/* Top Back Navigation Pill */}
      <div>
        <Link
          to="/map"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] bg-white/80 px-4 py-2 rounded-full border border-black/[0.08] shadow-2xs hover:bg-white transition-all apple-press cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Spatial Map & Districts</span>
        </Link>
      </div>

      {/* District Presentation Hero Card */}
      <div className="apple-glass-card rounded-3xl border border-white/80 shadow-apple-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center font-bold text-2xl font-display shadow-apple-sm shrink-0">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1D1D1F]">
                  {district.name} District
                </h1>
                <span className="px-3.5 py-0.5 rounded-full text-xs font-bold bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20">
                  {startups.length} Startups Active
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#86868B]">
                Headquarters: <span className="text-[#1D1D1F]">{district.headquarters}</span>
              </p>
              <p className="text-xs sm:text-sm text-[#86868B] max-w-3xl leading-relaxed pt-1 font-normal">
                {district.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/map?district=${district.slug}`}
              className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs sm:text-sm rounded-full shadow-apple-sm flex items-center gap-2 transition-all apple-press"
            >
              <Compass className="w-4 h-4" />
              <span>Explore on Map</span>
            </Link>
          </div>
        </div>

        {/* Key Sectors Cloud */}
        {district.keySectors && district.keySectors.length > 0 && (
          <div className="pt-4 border-t border-black/[0.05] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#86868B] font-medium">Leading Sectors:</span>
            {district.keySectors.map((sec) => (
              <span
                key={sec}
                className="px-3.5 py-1 rounded-full bg-black/[0.03] text-[#1D1D1F] font-semibold border border-black/[0.04]"
              >
                {sec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Startups in this District Hub */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1D1D1F] tracking-tight">
            Startups in {district.name} ({startups.length})
          </h2>
          <Link
            to={`/submit?district=${encodeURIComponent(district.name)}`}
            className="text-xs sm:text-sm font-semibold text-[#0071E3] hover:underline apple-press"
          >
            + Submit a startup in {district.name}
          </Link>
        </div>

        {startups.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-[#86868B]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-bold text-[#1D1D1F]">No startups in {district.name} yet</p>
              <p className="text-sm text-[#86868B] max-w-xs mx-auto leading-relaxed">Be the first venture from this district to join the Tamil Nadu Startup Map.</p>
            </div>
            <a href="/submit" className="px-5 py-2.5 bg-[#1D1D1F] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 apple-press">
              Register Your Startup
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
