import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { CookieConsent } from '../components/CookieConsent';

export const PublicLayout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Public Navbar */}
      <PublicNavbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet context={{ onOpenSearch: () => setSearchOpen(true) }} />
      </main>

      {/* Public Footer */}
      <PublicFooter />

      {/* Cookie & Privacy Consent Banner */}
      <CookieConsent />

      {/* Command Palette Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
