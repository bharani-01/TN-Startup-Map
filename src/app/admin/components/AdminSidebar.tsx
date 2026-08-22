import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  ShieldCheck, 
  Building2, 
  Users, 
  BookOpen,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const links = [
    { label: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Pending Submissions', path: '/admin/submissions', icon: Inbox },
    { label: 'Founder Claims', path: '/admin/claims', icon: ShieldCheck },
    { label: 'Startup Entities', path: '/admin/startups', icon: Building2 },
    { label: 'Jobs Moderation', path: '/admin/jobs', icon: Briefcase },
    { label: 'Stories & Blogs', path: '/admin/blogs', icon: BookOpen },
    { label: 'User Roles & Access', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#1c1c1e]/90 backdrop-blur-2xl border-r border-white/10 text-white min-h-[calc(100vh-64px)] p-4 space-y-6">
      <div className="px-3 py-1">
        <span className="text-[10px] font-bold text-apple-secondary uppercase tracking-wider block">
          Ecosystem Administration
        </span>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all apple-press-subtle ${
                  isActive
                    ? 'bg-apple-blue text-white shadow-apple-sm'
                    : 'text-apple-secondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/10">
        <a
          href="/startups"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-apple-secondary hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <span>Live Directory</span>
          <ExternalLink className="w-3.5 h-3.5 text-apple-tertiary" />
        </a>
      </div>
    </aside>
  );
};
