import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Lock, Mail, Loader2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Building2, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: currentUser, isAuthenticated, login, register } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectParam = searchParams.get('redirect');

  const getDestinationForUser = (role: string, targetRedirect?: string | null): string => {
    if (targetRedirect && targetRedirect !== '/login' && targetRedirect !== '/') {
      if (targetRedirect.startsWith('/admin') && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return role === 'FOUNDER' ? '/founder/dashboard' : '/startups';
      }
      if (targetRedirect.startsWith('/founder') && role === 'USER') {
        return '/startups';
      }
      return targetRedirect;
    }

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return '/admin';
    }
    if (role === 'FOUNDER') {
      return '/founder/dashboard';
    }
    return '/startups';
  };

  // Auto redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      const destination = getDestinationForUser(currentUser.role, redirectParam);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, redirectParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, 'USER');
      if (res.success) {
        navigate('/startups', { replace: true });
      } else {
        setError(res.error || 'Registration failed');
        setLoading(false);
      }
    } else {
      const res = await login(email, password);
      if (res.success && res.user) {
        const destination = getDestinationForUser(res.user.role, redirectParam);
        navigate(destination, { replace: true });
      } else {
        setError(res.error || 'Invalid email or password');
        setLoading(false);
      }
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setMode('login');
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-9 space-y-6">
        
        {/* Brand Icon Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center mx-auto shadow-md">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-[#1D1D1F] tracking-tight">
              {mode === 'login' ? 'Ecosystem Portal' : 'Join TN Startup Map'}
            </h1>
            <p className="text-xs text-[#86868B] mt-0.5">
              {mode === 'login'
                ? 'Sign in to access founder tools, bookmark ventures, or govern data.'
                : 'Create an account to explore startups, save bookmarks, and connect.'}
            </p>
          </div>
        </div>

        {/* Apple Segmented Control Tab Switcher */}
        <div className="p-1 bg-black/[0.04] rounded-2xl flex items-center gap-1 border border-black/[0.04]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sundaram"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-4 focus:ring-[#0071E3]/15 focus:border-[#0071E3] transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#1D1D1F] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-4 focus:ring-[#0071E3]/15 focus:border-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1D1D1F] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••••••'}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-4 focus:ring-[#0071E3]/15 focus:border-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          {/* High-Contrast Solid Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-bold text-sm tracking-tight transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-[#0071E3] mt-2 cursor-pointer apple-press"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login Presets for Evaluators */}
        {mode === 'login' && (
          <div className="p-4 bg-black/[0.02] rounded-3xl border border-black/[0.05] space-y-2.5">
            <span className="font-bold text-[#86868B] block uppercase tracking-wider text-[10px]">
              One-Click Quick Login Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@tnstartupmap.in', 'Admin@12345')}
                className="p-3 rounded-2xl bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-apple-sm text-left transition-all apple-press-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1D1D1F] text-xs">Admin</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
                </div>
                <p className="text-[10px] text-[#86868B] truncate mt-0.5">admin@tnstartupmap.in</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('srinath@agnikul.in', 'Founder@12345')}
                className="p-3 rounded-2xl bg-white border border-black/[0.08] hover:border-[#0071E3]/40 shadow-apple-sm text-left transition-all apple-press-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1D1D1F] text-xs">Founder</span>
                  <Building2 className="w-3.5 h-3.5 text-[#34C759]" />
                </div>
                <p className="text-[10px] text-[#86868B] truncate mt-0.5">srinath@agnikul.in</p>
              </button>
            </div>
          </div>
        )}

        {/* Founder prompt */}
        <div className="text-center text-xs text-[#86868B] pt-2 border-t border-black/[0.05]">
          <span>Are you an unlisted founder? </span>
          <Link to="/submit" className="font-bold text-[#0071E3] hover:underline">
            Submit Your Startup
          </Link>
        </div>

      </div>
    </div>
  );
};
