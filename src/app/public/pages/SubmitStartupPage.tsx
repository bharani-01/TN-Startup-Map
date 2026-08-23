import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { canonicalUrl, OG_DEFAULT_IMAGE } from '../../../utils/seo';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  DollarSign,
  Globe,
  FileText,
  Navigation,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Zap,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { District, Sector } from '../../../types';

export const SubmitStartupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [districts, setDistricts] = useState<District[]>([]);
  const [sectorsList, setSectorsList] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedConsent, setAgreedConsent] = useState(false);

  // Streamlined Form State (Basic Details to Join)
  const [formData, setFormData] = useState({
    // Step 1: Venture Identity & District
    name: '',
    website: '',
    tagline: '',
    district: 'Chennai',
    city: '',
    sectors: ['SaaS'] as string[],
    stage: 'Seed',
    fundingType: 'Bootstrapped',
    teamSize: '1-10',
    foundedYear: new Date().getFullYear(),
    latitude: '13.0827',
    longitude: '80.2707',
    
    // Step 2: Founder / Submitter
    founderName: user?.name || '',
    founderEmail: user?.email || '',
    founderPhone: '',
    founderRole: 'Founder / Co-Founder',
    founderLinkedin: '',
  });

  useEffect(() => {
    fetch('/api/districts')
      .then((r) => r.json())
      .then((d) => d.success && setDistricts(d.data));
    fetch('/api/sectors')
      .then((r) => r.json())
      .then((s) => s.success && setSectorsList(s.data));
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDistrictChange = (dName: string) => {
    const matched = districts.find((d) => d.name.toLowerCase() === dName.toLowerCase());
    setFormData((prev) => ({
      ...prev,
      district: dName,
      latitude: matched?.latitude ? matched.latitude.toString() : prev.latitude,
      longitude: matched?.longitude ? matched.longitude.toString() : prev.longitude,
    }));
  };

  const handleSectorToggle = (sectorName: string) => {
    setFormData((prev) => {
      const current = prev.sectors;
      if (current.includes(sectorName)) {
        if (current.length === 1) return prev;
        return { ...prev, sectors: current.filter((s) => s !== sectorName) };
      } else {
        return { ...prev, sectors: [...current, sectorName] };
      }
    });
  };

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Startup name is required');
        return false;
      }
      if (!formData.website.trim()) {
        setError('Website URL is required');
        return false;
      }
      if (!formData.tagline.trim()) {
        setError('One-line pitch / tagline is required');
        return false;
      }
      if (!formData.city.trim()) {
        setError('City / locality / tech corridor is required');
        return false;
      }
      if (formData.sectors.length === 0) {
        setError('Select at least one industry sector');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.founderName.trim()) {
        setError('Founder / Submitter name is required');
        return false;
      }
      if (!formData.founderEmail.trim()) {
        setError('Founder email is required');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(3, s + 1));
    }
  };

  const handleSubmit = async () => {
    if (!agreedConsent) {
      setError('Please accept the Terms of Service and Privacy Policy before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: formData.tagline,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Network error submitting startup');
    } finally {
      setLoading(false);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Venture & Hub', icon: Building2 },
    { num: 2, label: 'Founder Access', icon: Users },
    { num: 3, label: 'Confirm & Join', icon: ShieldCheck },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-[#34C759]/10 text-[#34C759] rounded-3xl flex items-center justify-center mx-auto shadow-apple-sm border border-[#34C759]/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F]">
            Venture Registered Successfully
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-lg mx-auto leading-relaxed">
            <strong>{formData.name}</strong> has been submitted. You can now access your Founder Dashboard to enrich your profile with milestones, client logos, awards, and verified business metrics.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-black/[0.08] max-w-md mx-auto text-left text-xs space-y-2.5 text-[#86868B] shadow-apple-card">
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>Startup:</span>
            <span className="font-bold text-[#1D1D1F]">{formData.name}</span>
          </div>
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>District & City:</span>
            <span className="font-bold text-[#1D1D1F]">{formData.city}, {formData.district}</span>
          </div>
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>Primary Sector:</span>
            <span className="font-bold text-[#0071E3]">{formData.sectors.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-bold text-[#34C759]">REGISTERED · PENDING_REVIEW</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/founder"
            className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-full shadow-apple-sm apple-press flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Open Founder Dashboard</span>
          </Link>
          <Link
            to="/startups"
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#1D1D1F] font-bold text-xs rounded-full border border-black/[0.08] shadow-2xs apple-press"
          >
            Explore Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <Helmet>
        <title>Submit Your Startup — Tamil Nadu Startup Connect</title>
        <meta name="description" content="List your startup on Tamil Nadu's premier venture directory. Get discovered by investors, partners, and talent across 38 districts." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl('/submit')} />
        <meta property="og:title" content="Submit Your Startup — Tamil Nadu Startup Connect" />
        <meta property="og:description" content="List your startup on Tamil Nadu's premier venture directory. Get discovered by investors, partners, and talent." />
        <meta property="og:url" content={canonicalUrl('/submit')} />
        <meta property="og:image" content={OG_DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Submit Your Startup — Tamil Nadu Startup Connect" />
        <meta name="twitter:description" content="List your startup on Tamil Nadu's premier venture directory." />
      </Helmet>

      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/[0.08] text-xs font-semibold text-[#0071E3] shadow-apple-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Quick 45-Second Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
          Join the Tamil Nadu Startup Map
        </h1>
        <p className="text-xs sm:text-sm text-[#86868B] max-w-xl mx-auto leading-relaxed">
          Provide basic details to get mapped immediately. You can complete your full business model, milestones, client logos, and funding cap table anytime in your Founder Dashboard.
        </p>
      </div>

      {/* 3-Step Stepper Bar */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-black/[0.07] shadow-apple-sm">
        {stepsHeader.map((s) => {
          const Icon = s.icon;
          const isCompleted = step > s.num;
          const isCurrent = step === s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num < step || validateStep(step)) {
                  setStep(s.num);
                }
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl text-center transition-all ${
                isCurrent
                  ? 'bg-[#0071E3] text-white shadow-apple-sm'
                  : isCompleted
                  ? 'text-[#34C759] hover:bg-black/[0.03]'
                  : 'text-[#86868B] hover:bg-black/[0.02]'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              <span className="font-bold text-xs">{s.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Basic Venture Identity & District */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Step 1: Venture Identity & District Location
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Fill the fundamental details to place your entity on the 38-district Tamil Nadu map.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. AgniKul Cosmos, Freshworks, Ather Energy..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Official Website URL *</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourstartup.com"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">One-Line Tagline / Pitch *</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Making space accessible with single-piece 3D-printed rocket engines"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Tamil Nadu District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-medium text-[#1D1D1F]"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">City / Locality / Tech Hub *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. OMR, IITM Research Park, Hosur SIPCOT..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            {/* Sectors Selection */}
            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Primary Industry Sectors (Select at least 1) *</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {sectorsList.map((sec) => {
                  const isSelected = formData.sectors.includes(sec.name);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSectorToggle(sec.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#0071E3] text-white shadow-2xs'
                          : 'bg-black/[0.03] text-[#86868B] hover:text-[#1D1D1F] border border-black/[0.04]'
                      }`}
                    >
                      {sec.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Venture Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                >
                  <option value="Idea">Idea</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                  <option value="Bootstrapped">Bootstrapped</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                >
                  <option value="1-10">1-10 Members</option>
                  <option value="11-50">11-50 Members</option>
                  <option value="51-200">51-200 Members</option>
                  <option value="200+">200+ Members</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founded Year</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleChange('foundedYear', Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Founder / Submitter Details */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Step 2: Founder Access & Verification Details
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                We link your entity to this founder email for profile management and verified badges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founder / Submitter Name *</label>
                <input
                  type="text"
                  value={formData.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  placeholder="e.g. Srinath Ravichandran"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  value={formData.founderEmail}
                  onChange={(e) => handleChange('founderEmail', e.target.value)}
                  placeholder="founder@yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Your Role / Designation</label>
                <input
                  type="text"
                  value={formData.founderRole}
                  onChange={(e) => handleChange('founderRole', e.target.value)}
                  placeholder="e.g. Co-Founder & CEO"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founder LinkedIn Profile (Optional)</label>
                <input
                  type="url"
                  value={formData.founderLinkedin}
                  onChange={(e) => handleChange('founderLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Step 3: Review Basic Submission
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Confirm your venture details before publishing to the directory queue.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2.5">
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Venture Name:</span>
                <span className="font-bold text-[#1D1D1F]">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Tagline:</span>
                <span className="font-medium text-[#1D1D1F] text-right">{formData.tagline}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Hub Location:</span>
                <span className="font-bold text-[#0071E3]">{formData.city}, {formData.district}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Industry Sectors:</span>
                <span className="font-semibold text-[#1D1D1F]">{formData.sectors.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Founder Submitter:</span>
                <span className="font-bold text-[#1D1D1F]">{formData.founderName} ({formData.founderEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868B]">Stage:</span>
                <span className="font-bold text-[#1D1D1F]">{formData.stage}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-800 text-[11px] leading-relaxed">
              <strong>Progressive Completion:</strong> After joining, you will be directed to your Founder Dashboard where you can add milestones, enterprise client logos, awards, and complete your data profile.
            </div>

            {/* Terms & Privacy Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-2xs flex items-start gap-3">
              <input
                type="checkbox"
                id="submitConsent"
                checked={agreedConsent}
                onChange={(e) => setAgreedConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded accent-[#0071E3] cursor-pointer shrink-0"
              />
              <label htmlFor="submitConsent" className="text-xs text-[#424245] leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="font-semibold text-[#0071E3] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" className="font-semibold text-[#0071E3] hover:underline">
                  Privacy Policy
                </Link>, and certify that I am an authorized representative submitting truthful and verifiable company metrics.
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs apple-press"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center gap-1.5 shadow-apple-sm transition-all apple-press"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !agreedConsent}
              className="px-7 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 shadow-apple-sm transition-all apple-press disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Venture...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Confirm & Join Directory</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
