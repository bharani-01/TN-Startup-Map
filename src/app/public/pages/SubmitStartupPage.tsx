import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Compass,
  Navigation,
  Layers,
  Sparkles,
  Phone,
  Mail
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

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    website: '',
    tagline: '',
    description: '',
    linkedin: '',
    
    // Step 2: Choose Location & Map Coordinates
    district: 'Chennai',
    city: '',
    address: '',
    pincode: '',
    latitude: '13.0827',
    longitude: '80.2707',

    // Step 3: Sectors & Tech
    sectors: ['SaaS'] as string[],
    stage: 'Seed',
    fundingType: 'Bootstrapped',
    foundedYear: 2024,
    teamSize: '1-10',

    // Step 4: Founder & Verification Details
    founderName: user?.name || '',
    founderEmail: user?.email || '',
    founderPhone: '',
    founderLinkedin: '',
    sourceUrl: '',
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
      return true;
    }
    if (currentStep === 2) {
      if (!formData.district) {
        setError('Please select a Tamil Nadu district');
        return false;
      }
      if (!formData.city.trim()) {
        setError('City / locality / tech corridor is required');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (formData.sectors.length === 0) {
        setError('Select at least one industry sector');
        return false;
      }
      return true;
    }
    if (currentStep === 4) {
      if (!formData.founderName.trim()) {
        setError('Founder name is required');
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
      setStep((s) => Math.min(5, s + 1));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    { num: 1, label: 'Identity', icon: Building2 },
    { num: 2, label: 'Choose Location', icon: MapPin },
    { num: 3, label: 'Sectors & Stage', icon: Layers },
    { num: 4, label: 'Founder & Team', icon: Users },
    { num: 5, label: 'Review & Confirm', icon: ShieldCheck },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-[#34C759]/10 text-[#34C759] rounded-3xl flex items-center justify-center mx-auto shadow-apple-sm border border-[#34C759]/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F]">
            Startup Submitted for Verification!
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-lg mx-auto leading-relaxed">
            Thank you for listing <strong>{formData.name}</strong>. Your submission is now in the administrative review queue. Once approved, it will be published to the interactive Tamil Nadu map with verified badges.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-black/[0.08] max-w-md mx-auto text-left text-xs space-y-2.5 text-[#86868B] shadow-apple-card">
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>Startup Name:</span>
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
            <span>Review Status:</span>
            <span className="font-bold text-amber-600">PENDING_ADMIN_REVIEW</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            to="/startups"
            className="px-6 py-2.5 bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs rounded-full shadow-apple-sm apple-press"
          >
            Explore Directory
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                name: '',
                website: '',
                tagline: '',
                description: '',
                linkedin: '',
                district: 'Chennai',
                city: '',
                address: '',
                pincode: '',
                latitude: '13.0827',
                longitude: '80.2707',
                sectors: ['SaaS'],
                founderName: user?.name || '',
                founderEmail: user?.email || '',
                founderPhone: '',
                founderLinkedin: '',
                foundedYear: 2024,
                stage: 'Seed',
                fundingType: 'Bootstrapped',
                teamSize: '1-10',
                sourceUrl: '',
              });
            }}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#1D1D1F] font-bold text-xs rounded-full border border-black/[0.08] shadow-2xs apple-press"
          >
            Submit Another Startup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/[0.08] text-xs font-semibold text-[#0071E3] shadow-apple-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tamil Nadu Innovation Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
          List Your Venture
        </h1>
        <p className="text-xs sm:text-sm text-[#86868B] max-w-xl mx-auto">
          Get verified, connect with regional incubators, and gain spatial visibility across all 38 districts of Tamil Nadu.
        </p>
      </div>

      {/* 5-Step Stepper Bar */}
      <div className="grid grid-cols-5 gap-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-black/[0.07] shadow-apple-sm">
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
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                isCurrent
                  ? 'bg-[#0071E3] text-white shadow-apple-sm'
                  : isCompleted
                  ? 'text-[#34C759] hover:bg-black/[0.03]'
                  : 'text-[#86868B] hover:bg-black/[0.02]'
              }`}
            >
              <div className="flex items-center gap-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline font-bold text-[11px]">{s.label}</span>
              </div>
              <span className="md:hidden text-[10px] font-bold mt-0.5">Step {s.num}</span>
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
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Basic Info & Pitch */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Step 1: Startup Identity & Web Presence
            </h3>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Startup Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. AgniKul Cosmos, Ather Energy, Netcon..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">One-Line Pitch / Tagline *</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Making space accessible with 3D-printed rocket engines"
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

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Company Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief summary of your product, technology, problem solved, and traction..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Company LinkedIn Profile (Optional)</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourstartup"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Choose Location & Map Pin (Dedicated Step!) */}
        {step === 2 && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0071E3]" />
                <span>Step 2: Choose Location & Map Coordinates</span>
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Pinpoint your startup headquarters or incubation center on the Tamil Nadu Spatial Map.
              </p>
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
                      {d.name} ({d.startupsCount || 0} Startups)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">City / Tech Hub / Locality *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. OMR, Guindy, Peelamedu, Hosur SIPCOT, Madurai IT Park..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Office Address / Incubation Facility (Optional)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. IITM Research Park, Module 4, Kanagam Road, Taramani"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>

            {/* Coordinates & Map Pin Box */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0071E3] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map GPS Coordinates</span>
                </span>
                <span className="text-[10px] text-[#86868B] font-medium">Auto-generated for {formData.district}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] mb-1">Latitude</label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="13.0827"
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868B] mb-1">Longitude</label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="80.2707"
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: Sectors, Stage & Funding */}
        {step === 3 && (
          <div className="space-y-5 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Step 3: Industry Sectors & Growth Stage
            </h3>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-2">
                Industry Sectors * (Select one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {sectorsList.map((sec) => {
                  const selected = formData.sectors.includes(sec.name);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSectorToggle(sec.name)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                        selected
                          ? 'bg-[#0071E3] text-white shadow-apple-sm'
                          : 'bg-black/[0.04] text-[#1D1D1F] hover:bg-black/[0.08]'
                      }`}
                    >
                      {sec.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Venture Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-[#1D1D1F] font-semibold"
                >
                  <option value="Idea">Idea / Research</option>
                  <option value="Pre-seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                  <option value="Bootstrapped">Profitable / Bootstrapped</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Funding Structure</label>
                <select
                  value={formData.fundingType}
                  onChange={(e) => handleChange('fundingType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-[#1D1D1F] font-semibold"
                >
                  <option value="Bootstrapped">Bootstrapped / Self-funded</option>
                  <option value="Angel">Angel Funded</option>
                  <option value="Pre-seed">Institutional Pre-Seed</option>
                  <option value="Seed">Institutional Seed</option>
                  <option value="Venture funded">Institutional Venture Backed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founded Year</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleChange('foundedYear', parseInt(e.target.value) || 2024)}
                  min={2000}
                  max={2030}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-[#1D1D1F] font-semibold"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="200+">200+ Employees</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Founder Verification */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Step 4: Founder Verification & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founder / Submitter Name *</label>
                <input
                  type="text"
                  value={formData.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  placeholder="e.g. Srinath Ravichandran"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founder Contact Email *</label>
                <input
                  type="email"
                  value={formData.founderEmail}
                  onChange={(e) => handleChange('founderEmail', e.target.value)}
                  placeholder="founder@yourstartup.com"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.founderPhone}
                  onChange={(e) => handleChange('founderPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Founder LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.founderLinkedin}
                  onChange={(e) => handleChange('founderLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/founder"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Verification Reference / Press URL (Optional)</label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => handleChange('sourceUrl', e.target.value)}
                placeholder="https://yourstory.com/or-press-release"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Review & Confirm */}
        {step === 5 && (
          <div className="space-y-5 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Step 5: Review & Confirm Your Submission
            </h3>

            <div className="p-5 bg-black/[0.02] rounded-3xl border border-black/[0.06] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-[#1D1D1F]">{formData.name}</h4>
                  <p className="text-xs text-[#86868B]">{formData.tagline}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                  {formData.stage}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-black/[0.05]">
                <div>
                  <span className="text-[#86868B] block text-[11px]">Location Pin:</span>
                  <span className="font-bold text-[#1D1D1F]">{formData.city}, {formData.district}</span>
                </div>
                <div>
                  <span className="text-[#86868B] block text-[11px]">Sectors:</span>
                  <span className="font-bold text-[#0071E3]">{formData.sectors.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[#86868B] block text-[11px]">Founder:</span>
                  <span className="font-bold text-[#1D1D1F]">{formData.founderName} ({formData.founderEmail})</span>
                </div>
                <div>
                  <span className="text-[#86868B] block text-[11px]">Website:</span>
                  <span className="font-bold text-[#0071E3] truncate block">{formData.website}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#86868B] leading-relaxed">
              By clicking "Submit for Verification", you confirm that this venture is headquartered or operates an R&D/engineering center within Tamil Nadu.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all apple-press"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition-all shadow-apple-sm apple-press"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#34C759] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md apple-press"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Submit for Verification</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
