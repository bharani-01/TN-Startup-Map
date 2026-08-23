import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Compass, 
  Building2, 
  Layers, 
  Plus, 
  Search, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Bookmark,
  BookOpen,
  LayoutDashboard,
  Edit3,
  PenTool
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useBookmarks } from '../../../context/BookmarkContext';

interface PublicNavbarProps {
  onOpenSearch: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isFounder, isAdmin, isUser, logout } = useAuth();
  const { count: bookmarkedCount } = useBookmarks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Map', path: '/map', icon: Compass },
    { label: 'Startups', path: '/startups', icon: Building2 },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Stories', path: '/blog', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full apple-glass transition-colors">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 apple-press group">
              <img
                src="/logo.webp"
                alt="Tamil Nadu"
                className="h-10 sm:h-12 w-auto object-contain shrink-0 drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base sm:text-lg text-[#1D1D1F] tracking-tight leading-tight group-hover:text-[#0071E3] transition-colors">
                  Startup Connect
                </span>
                <span className="text-[10px] text-[#86868B] font-medium tracking-wide hidden sm:inline">
                  Startup & Ecosystem Directory
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Unified Segmented Pill) */}
          <nav className="hidden lg:flex items-center bg-black/[0.04] p-1 rounded-full border border-black/[0.04] h-9 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 h-7 rounded-full text-xs font-semibold transition-all duration-200 apple-press-subtle ${
                    active
                      ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                      : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Bookmarks, Submit & Auth Actions (Strictly Harmonized Heights) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            
            {/* Spotlight Search Capsule */}
            <button
              onClick={onOpenSearch}
              className="hidden xl:flex items-center gap-2 px-3.5 h-9 rounded-full text-xs text-[#86868B] bg-black/[0.03] hover:bg-black/[0.06] hover:text-[#1D1D1F] border border-black/[0.06] transition-all apple-press cursor-pointer shrink-0"
              title="Search startups or press Cmd+K"
            >
              <Search className="w-3.5 h-3.5 text-[#86868B]" />
              <span className="font-normal">Search ecosystem...</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#86868B] bg-white/90 rounded-md border border-black/[0.08] shadow-2xs font-semibold ml-1">
                ⌘K
              </kbd>
            </button>

            {/* Compact Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex xl:hidden items-center justify-center w-9 h-9 rounded-full text-[#86868B] hover:text-[#1D1D1F] bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] apple-press shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Saved Bookmarks Capsule */}
            <Link
              to="/bookmarks"
              className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold border transition-all apple-press shrink-0 ${
                isActive('/bookmarks')
                  ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3]'
                  : 'bg-white hover:bg-slate-50 border-black/[0.08] text-[#1D1D1F]'
              }`}
              title="View Saved Startups"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedCount > 0 ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
              <span className="hidden xl:inline">Saved</span>
              {bookmarkedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0071E3] text-white">
                  {bookmarkedCount}
                </span>
              )}
            </Link>

            {/* List Startup Button */}
            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-[#1D1D1F] border border-black/[0.08] shadow-apple-sm transition-all apple-press shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>List Startup</span>
            </Link>

            {/* Divider */}
            <div className="h-4 w-px bg-black/[0.08] hidden sm:block" />

            {/* User Dropdown or Sign In / Sign Up */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 h-9 rounded-full bg-white hover:bg-slate-50 border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] shadow-apple-sm transition-all apple-press shrink-0"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-[#86868B]" />
                </button>

                {userDropdownOpen && (
                    <div 
                    className="absolute right-0 mt-2 w-64 rounded-3xl apple-glass-elevated py-2 z-50 shadow-apple-card border border-black/[0.08] animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-black/[0.06] bg-black/[0.02]">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-[#1D1D1F] truncate">{user.name}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          isAdmin 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : isFounder 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#86868B] truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Founder Studio Links - Only for Founders and Admins */}
                    {isFounder && (
                      <div className="py-1 border-b border-black/[0.06]">
                        <span className="px-4 py-1 text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                          Founder Studio
                        </span>
                        <Link
                          to="/founder/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1D1D1F] hover:bg-[#0071E3]/5 hover:text-[#0071E3] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>Founder Dashboard</span>
                        </Link>
                        <Link
                          to="/founder/edit"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#1D1D1F] hover:bg-[#0071E3]/5 hover:text-[#0071E3] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#86868B]" />
                          <span>Edit Company Profile</span>
                        </Link>
                        <Link
                          to="/blog/new"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#1D1D1F] hover:bg-[#0071E3]/5 hover:text-[#0071E3] transition-colors"
                        >
                          <PenTool className="w-3.5 h-3.5 text-[#86868B]" />
                          <span>Write Founder Story</span>
                        </Link>
                      </div>
                    )}

                    {/* Community Member Links */}
                    {isUser && (
                      <div className="py-1 border-b border-black/[0.06]">
                        <span className="px-4 py-1 text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                          Community Hub
                        </span>
                        <Link
                          to="/submit"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1D1D1F] hover:bg-[#0071E3]/5 hover:text-[#0071E3] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>Submit Your Startup</span>
                        </Link>
                      </div>
                    )}

                    {/* Saved & Quick Links */}
                    <div className="py-1 border-b border-black/[0.06]">
                      <Link
                        to="/bookmarks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-medium text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>Saved Startups</span>
                        </div>
                        {bookmarkedCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0071E3] text-white">
                            {bookmarkedCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Admin Console (If Admin) */}
                    {isAdmin && (
                      <div className="py-1 border-b border-black/[0.06]">
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50/60 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Console</span>
                        </Link>
                      </div>
                    )}

                    {/* Sign Out */}
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/60 text-left transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/login"
                  className="px-3 h-9 flex items-center text-xs font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors apple-press-subtle"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 h-9 flex items-center text-xs font-semibold bg-[#1D1D1F] hover:bg-black text-white rounded-full shadow-apple-sm transition-all apple-press"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.05]"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1D1D1F] rounded-full hover:bg-black/[0.05] apple-press"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#0071E3]/10 text-[#0071E3]'
                      : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/bookmarks"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                isActive('/bookmarks')
                  ? 'bg-[#0071E3]/10 text-[#0071E3]'
                  : 'text-[#1D1D1F] hover:bg-black/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-[#0071E3]" />
                <span>Saved Startups</span>
              </div>
              {bookmarkedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#0071E3] text-white">
                  {bookmarkedCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-3 border-t border-black/[0.06] space-y-2">
            <Link
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#0071E3] text-white text-xs font-bold shadow-apple-sm"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Startup</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="space-y-1 pt-2">
                {isFounder && (
                  <>
                    <Link
                      to="/founder/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#1D1D1F] rounded-xl hover:bg-black/[0.04]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#0071E3]" />
                      <span>Founder Dashboard</span>
                    </Link>
                    <Link
                      to="/founder/edit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#1D1D1F] rounded-xl hover:bg-black/[0.04]"
                    >
                      <Edit3 className="w-4 h-4 text-[#86868B]" />
                      <span>Edit Company Profile</span>
                    </Link>
                    <Link
                      to="/blog/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#1D1D1F] rounded-xl hover:bg-black/[0.04]"
                    >
                      <PenTool className="w-4 h-4 text-[#86868B]" />
                      <span>Write Founder Story</span>
                    </Link>
                  </>
                )}
                {isUser && (
                  <Link
                    to="/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#1D1D1F] rounded-xl hover:bg-black/[0.04]"
                  >
                    <Plus className="w-4 h-4 text-[#0071E3]" />
                    <span>Submit Your Startup</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-amber-700 rounded-xl hover:bg-amber-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50/60 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-[#1D1D1F] rounded-2xl border border-black/[0.08]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold bg-[#1D1D1F] text-white rounded-2xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
