import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, X, Check, Sliders, ChevronDown } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('tn_cookie_consent');
    if (!consent) {
      // Small delay for natural Apple spring entrance
      const timer = setTimeout(() => setVisible(true), 1000);
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
    <div className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-50 max-w-xl mx-auto animate-in slide-in-from-bottom-8 duration-300">
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/15 text-white shadow-apple-modal space-y-4">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/20 text-[#0071E3] border border-[#0071E3]/30 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                Cookie & Privacy Choices
              </h3>
              <p className="text-[11px] text-slate-400">
                Tamil Nadu Startup Connect
              </p>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explanatory Content */}
        <p className="text-xs text-slate-300 leading-relaxed">
          We use strictly necessary cookies to keep you signed in securely and first-party telemetry to understand ecosystem discovery traffic. We never sell your personal data or use cross-site trackers.
        </p>

        {/* Detailed Preferences Panel (Collapsible) */}
        {showPreferences && (
          <div className="pt-2 space-y-3 border-t border-white/10 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-white block">Essential System Cookies</span>
                <p className="text-[11px] text-slate-400">Required for authentication, session verification, and security tokens.</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0071E3]/20 text-[#0071E3] border border-[#0071E3]/30 shrink-0">
                ALWAYS ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-white block">Ecosystem Traffic Telemetry</span>
                <p className="text-[11px] text-slate-400">Anonymized view & click metrics to help admin measure startup reach and regional engagement.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0071E3] cursor-pointer shrink-0"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-3 text-[11px] text-slate-400 justify-center sm:justify-start">
            <Link to="/privacy" className="hover:text-white underline transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white underline transition-colors">
              Terms of Use
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!showPreferences ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all apple-press cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all apple-press cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-apple-sm transition-all apple-press cursor-pointer"
                >
                  Accept All
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-apple-sm transition-all apple-press cursor-pointer"
              >
                Save Preferences
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
