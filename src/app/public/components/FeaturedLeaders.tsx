import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedLeaders: React.FC = () => {
  const featuredVentures = [
    { name: 'Zoho', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://zoho.com&size=128', sector: 'Enterprise SaaS' },
    { name: 'Freshworks', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://freshworks.com&size=128', sector: 'CRM / SaaS' },
    { name: 'AgniKul Cosmos', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://agnikul.in&size=128', sector: 'SpaceTech' },
    { name: 'Ather Energy', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://atherenergy.com&size=128', sector: 'EV & Mobility' },
    { name: 'GUVI', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://guvi.in&size=128', sector: 'EdTech' },
    { name: 'Detect Technologies', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://detecttechnologies.com&size=128', sector: 'Industrial AI' },
    { name: 'Mindgrove', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mindgrovetech.in&size=128', sector: 'Semiconductors' },
    { name: 'Chargebee', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chargebee.com&size=128', sector: 'FinTech / SaaS' },
  ];

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 -mt-10 sm:-mt-14 lg:-mt-16 relative z-20">
      <div className="p-4 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.07] shadow-apple-card">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#86868B]">
              Spotlight on Tamil Nadu Innovation Leaders
            </span>
          </div>
          <Link 
            to="/startups" 
            className="text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] flex items-center gap-1 transition-colors apple-press-subtle"
          >
            <span>Explore All 500+</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {featuredVentures.map((v) => (
            <Link
              key={v.name}
              to={`/startups?search=${encodeURIComponent(v.name)}`}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.06] hover:border-[#0071E3]/30 shadow-2xs hover:shadow-apple-sm transition-all apple-press-subtle"
              title={`${v.name} (${v.sector})`}
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-black/[0.06] flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <img src={v.logo} alt={v.name} className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="font-bold text-[11px] text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate max-w-full">
                {v.name}
              </span>
              <span className="text-[9px] text-[#86868B] truncate max-w-full">
                {v.sector}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
