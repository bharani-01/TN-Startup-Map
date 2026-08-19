import React, { useEffect, useState } from 'react';
import { Layers, Search, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { DistrictCard } from '../components/DistrictCard';
import { District } from '../../../types';

export const DistrictExplorerPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/districts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDistricts(data.data);
        }
      })
      .catch((err) => console.error('Error fetching districts:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.headquarters.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>All 38 Districts of Tamil Nadu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Tamil Nadu District Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] mt-1">
            Browse verified startup clusters, incubation centers, and innovation hubs across every district.
          </p>
        </div>

        {/* Search Capsule Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search district by name or HQ..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white/90 border border-black/[0.08] rounded-full focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] shadow-apple-sm transition-all"
          />
        </div>
      </div>

      {/* District Cards Grid (4 columns on desktop) */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-[#86868B] font-medium">Loading 38 Tamil Nadu districts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDistricts.map((district) => (
            <DistrictCard key={district.id} district={district} />
          ))}
        </div>
      )}
    </div>
  );
};
