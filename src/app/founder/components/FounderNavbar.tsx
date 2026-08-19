import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const FounderNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full apple-glass transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group apple-press">
              <div className="w-8 h-8 rounded-xl bg-apple-text text-white flex items-center justify-center font-bold shadow-apple-sm">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base text-apple-text leading-tight">
                  TN Startup Map
                </span>
                <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">
                  Founder Studio
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-apple-secondary hover:text-apple-text bg-black/[0.03] hover:bg-black/[0.06] px-3 py-1.5 rounded-full transition-all apple-press-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Map</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-xs font-medium text-apple-text bg-white border border-black/[0.08] shadow-apple-sm px-3.5 py-1.5 rounded-full">
              <div className="w-5 h-5 rounded-full bg-apple-blue text-white flex items-center justify-center font-bold text-[10px]">
                {user?.name.charAt(0)}
              </div>
              <span className="font-semibold text-apple-text">{user?.name}</span>
              <span className="text-[10px] font-bold bg-apple-emerald/10 text-apple-emerald px-2 py-0.5 rounded-full border border-apple-emerald/20">
                FOUNDER
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 text-apple-secondary hover:text-apple-rose hover:bg-rose-50 rounded-full transition-all apple-press"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
