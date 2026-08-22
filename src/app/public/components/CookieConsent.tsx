import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, Sliders, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('tn_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom open event from footer
  useEffect(() => {
    const handleOpen = () => {
      setVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener('open-cookie-preferences', handleOpen);
    return () => window.removeEventListener('open-cookie-preferences', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('tn_cookie_consent', JSON.stringify({ essential: true, analytics: true }));
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('tn_cookie_consent', JSON.stringify({ essential: true, analytics: false }));
    setVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('tn_cookie_consent', JSON.stringify({ essential: true, analytics: analyticsConsent }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] text-[#1D1D1F] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] space-y-3.5">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#1D1D1F] tracking-tight">
                Privacy & Data Preferences
              </h3>
              <p className="text-[10px] text-[#86868B] font-medium">
                Tamil Nadu Startup Connect
              </p>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-[#515154] leading-relaxed">
          We use strictly essential tokens for secure authentication and first-party telemetry to understand ecosystem discovery. We do not sell data or use third-party ad trackers.
        </p>

        {/* Preferences Drawer */}
        {showPreferences && (
          <div className="pt-2 space-y-2 border-t border-black/[0.06] text-[11px]">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
              <div>
                <span className="font-bold text-[#1D1D1F] block">Essential Session Tokens</span>
                <span className="text-[10px] text-[#86868B]">Security & logged-in state</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                REQUIRED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
              <div>
                <span className="font-bold text-[#1D1D1F] block">Native Ecosystem Telemetry</span>
                <span className="text-[10px] text-[#86868B]">Anonymized page views & link clicks</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0071E3] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Footer & Actions */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] text-[#86868B]">
            <Link to="/privacy" className="hover:text-[#0071E3] underline transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#0071E3] underline transition-colors">
              Terms
            </Link>
            <span>•</span>
            <button
              onClick={() => setShowPreferences((p) => !p)}
              className="hover:text-[#0071E3] underline transition-colors cursor-pointer"
            >
              {showPreferences ? 'Hide Options' : 'Customize'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!showPreferences ? (
              <>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-xs font-semibold transition-all apple-press cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-4 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-apple-sm transition-all apple-press cursor-pointer"
                >
                  Accept All
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto px-4 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-apple-sm transition-all apple-press cursor-pointer"
              >
                Save Choices
              </button>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
};
