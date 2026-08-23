import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Lock, Mail, User, Loader2, AlertCircle, Building2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!agreedToTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to create an account');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const res = await register(name, email, password, 'USER');
    if (res.success) {
      navigate('/startups');
    } else {
      setError(res.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
      <Helmet>
        <title>Create Account — Tamil Nadu Startup Connect</title>
        <meta name="description" content="Create your Tamil Nadu Startup Connect explorer account." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-apple-card p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <img
            src="/logo.webp"
            alt="Tamil Nadu"
            className="h-16 w-auto object-contain mx-auto"
          />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1D1F] tracking-tight">
            Join Startup Connect
          </h1>
          <p className="text-xs text-[#86868B]">
            Create an explorer account to save bookmarks, connect with teams, and discover ventures.
          </p>
        </div>

        {/* Founder Notice Banner */}
        <div className="p-4 bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#1D1D1F]">
            <Building2 className="w-4 h-4 text-[#0071E3] shrink-0" />
            <span>Are you a Startup Founder?</span>
          </div>
          <p className="text-[11px] text-[#86868B] leading-relaxed">
            Founder accounts are provisioned via our verification protocol. Please <Link to="/submit" className="font-bold text-[#0071E3] underline">submit your startup</Link> or claim an existing company.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1D1D1F] mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditi Sundaram"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1D1D1F] mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1D1D1F] mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.12] bg-white focus:bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all outline-none"
              />
            </div>
          </div>

          {/* Legal Consent Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-[#0071E3] cursor-pointer shrink-0"
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-[#86868B] leading-relaxed cursor-pointer select-none">
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="font-semibold text-[#0071E3] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="font-semibold text-[#0071E3] hover:underline">
                Privacy Policy
              </Link>.
            </label>
          </div>

          {/* Solid High Contrast Submit Button */}
          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-bold text-sm tracking-tight transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-[#0071E3] mt-2 cursor-pointer apple-press disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Create Community Account</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#86868B] pt-2 border-t border-black/[0.06]">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-[#0071E3] hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
