import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1c1c1e] border-b border-white/10 text-white">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity matching sidebar width */}
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <img
                src="/logo.webp"
                alt="Tamil Nadu"
                className="h-9 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-tight leading-tight">
                  Startup Connect
                </span>
                <span className="text-[10px] font-mono font-bold text-[#0071E3] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Platform</span>
            </Link>
          </div>

          {/* Right: Admin Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-xs text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-md bg-amber-500 text-black flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="font-medium text-slate-200">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                ADMIN
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
