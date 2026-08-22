import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Building2, Layers, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f5f5f7] text-apple-secondary text-xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-black/[0.06]">
          
          {/* Col 1 & 2: Platform Bio */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 apple-press inline-flex">
              <img
                src="/logo.png"
                alt="Tamil Nadu"
                className="h-9 w-auto object-contain shrink-0 drop-shadow-xs"
              />
              <span className="font-display font-extrabold text-base text-apple-text tracking-tight">
                Startup Connect
              </span>
            </Link>

            <p className="text-apple-secondary text-xs leading-relaxed max-w-sm">
              The premier open-access intelligence and discovery layer for Tamil Nadu’s innovation ecosystem. Tracking verified ventures, funding milestones, and regional hubs across all 38 districts.
            </p>

            {/* System Status Capsule */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-apple-sm text-[11px] text-apple-text">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-emerald"></span>
              </span>
              <span className="font-semibold">All Systems Operational</span>
              <span className="text-apple-tertiary">•</span>
              <span className="text-apple-secondary font-mono">Live DB</span>
            </div>
          </div>

          {/* Col 3: Ecosystem Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-apple-text text-xs uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/map" className="hover:text-apple-blue transition-colors flex items-center gap-1">
                  <span>Interactive Map</span>
                </Link>
              </li>
              <li>
                <Link to="/startups" className="hover:text-apple-blue transition-colors">
                  Startup Directory
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#0071E3] transition-colors">
                  Spatial Map & Clusters
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-apple-blue transition-colors flex items-center gap-1">
                  <span>List a Startup</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-apple-blue/10 text-apple-blue font-semibold">Free</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Hubs */}
          <div className="space-y-3">
            <h4 className="font-semibold text-apple-text text-xs uppercase tracking-wider">
              Key Hubs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/districts/chennai" className="hover:text-apple-blue transition-colors">
                  Chennai (SaaS & DeepTech)
                </Link>
              </li>
              <li>
                <Link to="/districts/coimbatore" className="hover:text-apple-blue transition-colors">
                  Coimbatore (Smart Mfg)
                </Link>
              </li>
              <li>
                <Link to="/districts/krishnagiri" className="hover:text-apple-blue transition-colors">
                  Hosur (EV & Hardware)
                </Link>
              </li>
              <li>
                <Link to="/districts/madurai" className="hover:text-apple-blue transition-colors">
                  Madurai (Agritech & Health)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Roles */}
          <div className="space-y-3">
            <h4 className="font-semibold text-apple-text text-xs uppercase tracking-wider">
              Portals & Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support?tab=claim" className="hover:text-apple-blue transition-colors text-apple-blue font-medium">
                  Claim Startup Profile
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-apple-blue transition-colors">
                  Ecosystem Support
                </Link>
              </li>
              <li>
                <Link to="/founder/dashboard" className="hover:text-apple-blue transition-colors">
                  Founder Verification
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-apple-blue transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-apple-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-apple-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-feedback-prompt'))}
                  className="hover:text-apple-blue transition-colors text-left cursor-pointer font-medium text-[#0071E3]"
                >
                  Share Feedback 💬
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}
                  className="hover:text-apple-blue transition-colors text-left cursor-pointer"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-apple-secondary">
          <p>© {new Date().getFullYear()} Tamil Nadu Startup Connect. Open innovation initiative for Tamil Nadu.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to="/privacy" className="hover:text-apple-text transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-apple-text transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <button
              onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}
              className="hover:text-apple-text transition-colors cursor-pointer"
            >
              Cookie Choices
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>Crafted for Tamil Nadu</span>
              <Heart className="w-3 h-3 text-apple-rose fill-apple-rose" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
