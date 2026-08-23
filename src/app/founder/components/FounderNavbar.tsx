import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const FounderNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 text-slate-900">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <Link to="/founder" className="flex items-center gap-2.5 group">
              <img
                src="/logo.webp"
                alt="Tamil Nadu"
                className="h-9 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                  Startup Connect
                </span>
                <span className="text-[10px] font-mono font-bold text-[#0071E3] uppercase tracking-wider">
                  Founder Studio
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Map</span>
            </Link>
          </div>

          {/* Right: Founder Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 rounded-md bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'F'}
              </div>
              <span className="font-medium text-slate-800">{user?.name}</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                FOUNDER
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
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
