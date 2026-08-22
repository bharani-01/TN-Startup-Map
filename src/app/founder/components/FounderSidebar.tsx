import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, ExternalLink, ShieldCheck, ChevronDown, Plus, PenTool } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup } from '../../../types';

export const FounderSidebar: React.FC = () => {
  const { user, token } = useAuth();
  const [startupsList, setStartupsList] = useState<Startup[]>([]);
  const [activeStartup, setActiveStartup] = useState<string>(() => {
    return localStorage.getItem('tn_active_startup_id') || '';
  });

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch('/api/founder/my-startups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.data?.startups) {
          const list: Startup[] = data.data.startups;
          setStartupsList(list);
          if (list.length > 0) {
            const currentActive = list.find((s) => s.id === activeStartup) || list[0];
            setActiveStartup(currentActive.id);
            localStorage.setItem('tn_active_startup_id', currentActive.id);
          } else {
            setActiveStartup('');
            localStorage.removeItem('tn_active_startup_id');
          }
        }
      } catch (err) {
        console.error('Error fetching founder startups in sidebar:', err);
      }
    };

    if (token) {
      fetchStartups();
    }
  }, [token, user]);

  const handleSelectStartup = (id: string) => {
    setActiveStartup(id);
    localStorage.setItem('tn_active_startup_id', id);
    window.dispatchEvent(new CustomEvent('startup-switched', { detail: { startupId: id } }));
  };

  const currentStartupName =
    startupsList.find((s) => s.id === activeStartup)?.name || user?.companyName || 'No Startup Linked';

  const links = [
    { label: 'Overview & Analytics', path: '/founder/dashboard', icon: LayoutDashboard },
    { label: 'Edit Startup Profile', path: '/founder/edit', icon: Building2 },
    { label: 'Write Founder Story', path: '/blog/new', icon: PenTool },
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-2xl border-r border-black/[0.08] min-h-[calc(100vh-64px)] p-4 space-y-6">
      
      {/* Startup Badge Card & Switcher */}
      <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-apple-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider block">
            {startupsList.length > 1 ? `Managed Startups (${startupsList.length})` : 'Managed Startup'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#34C759]">
            <ShieldCheck className="w-3 h-3 text-[#34C759]" />
            Verified
          </span>
        </div>

        {startupsList.length > 1 ? (
          <div className="space-y-1">
            <select
              value={activeStartup}
              onChange={(e) => handleSelectStartup(e.target.value)}
              className="w-full text-xs font-bold text-[#1D1D1F] bg-black/[0.03] px-2.5 py-1.5 rounded-xl border border-black/[0.06] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 cursor-pointer truncate"
            >
              {startupsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.district})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#86868B]">Switch between your managed ventures</p>
          </div>
        ) : (
          <p className="font-bold text-sm text-[#1D1D1F] truncate">
            {currentStartupName}
          </p>
        )}

        <div className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[10px] text-[#86868B]">
          <span>Account Ref:</span>
          <span className="font-mono font-bold text-[#1D1D1F] bg-black/[0.04] px-1.5 py-0.5 rounded-md">
            {user?.displayId || 'TN-FND-1001'}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all apple-press-subtle ${
                  isActive
                    ? 'bg-[#0071E3] text-white shadow-apple-sm'
                    : 'text-[#1D1D1F] hover:bg-black/[0.05] hover:text-[#0071E3]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick View Public Profile */}
      <div className="pt-4 border-t border-black/[0.06] space-y-2">
        <Link
          to={`/startups/${activeStartup}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] rounded-2xl hover:bg-black/[0.04] transition-all"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#86868B]" />
        </Link>

        <Link
          to="/submit"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] rounded-2xl hover:bg-[#0071E3]/5 transition-all"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            <span>List Another Venture</span>
          </div>
        </Link>
      </div>
    </aside>
  );
};
