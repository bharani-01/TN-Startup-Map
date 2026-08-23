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
  Globe,
  Sparkles,
  Zap,
  Map as MapIcon,
  Check
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { District, Sector } from '../../../types';
import { MapLocationPicker } from '../../../components/MapLocationPicker';
import { AddressAutocomplete, AddressSuggestion } from '../../../components/AddressAutocomplete';

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

  // 4-Step Form State
  const [formData, setFormData] = useState({
    // Step 1: Venture Identity
    name: '',
    website: '',
    tagline: '',
    sectors: ['SaaS'] as string[],
    stage: 'Seed',
    fundingType: 'Bootstrapped',
    teamSize: '1-10',
    foundedYear: new Date().getFullYear(),
    
    // Step 2: Location & Map
    district: 'Chennai',
    city: '',
    address: '',
    pincode: '',
    latitude: 13.0827,
    longitude: 80.2707,
    
    // Step 3: Founder Contact
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
      latitude: matched?.latitude ? matched.latitude : prev.latitude,
      longitude: matched?.longitude ? matched.longitude : prev.longitude,
    }));
  };

  const handleAddressSuggestionSelect = (suggestion: AddressSuggestion) => {
    setFormData((prev) => {
      const updates: any = {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
      };
      if (suggestion.pincode) updates.pincode = suggestion.pincode;
      if (suggestion.city) updates.city = suggestion.city;
      
      if (suggestion.district) {
        const matched = districts.find(
          (d) => d.name.toLowerCase() === suggestion.district?.toLowerCase() ||
                 suggestion.district?.toLowerCase().includes(d.name.toLowerCase())
        );
        if (matched) updates.district = matched.name;
      }
      return { ...prev, ...updates };
    });
  };

  const handleLocationPickerChange = (lat: number, lng: number, placeName?: string) => {
    setFormData((prev) => {
      const updates: any = { latitude: lat, longitude: lng };
      if (placeName && !prev.address) {
        updates.address = placeName.split(',').slice(0, 3).join(',').trim();
      }
      return { ...prev, ...updates };
    });
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
        setError('Please enter the startup or company name.');
        return false;
      }
      if (!formData.website.trim()) {
        setError('Please enter the company website URL.');
        return false;
      }
      if (!formData.tagline.trim()) {
        setError('Please enter a brief one-line pitch.');
        return false;
      }
      if (formData.sectors.length === 0) {
        setError('Please choose at least one industry sector.');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.district.trim()) {
        setError('Please select a Tamil Nadu district.');
        return false;
      }
      if (!formData.city.trim()) {
        setError('Please enter a city, tech corridor, or area.');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!formData.founderName.trim()) {
        setError('Please enter the founder or representative name.');
        return false;
      }
      if (!formData.founderEmail.trim()) {
        setError('Please enter an official corporate email address.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(4, s + 1));
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!agreedConsent) {
      setError('Please agree to the Terms of Service to submit.');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Network error submitting startup');
    } finally {
      setLoading(false);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Venture', icon: Building2 },
    { num: 2, label: 'Location', icon: MapPin },
    { num: 3, label: 'Founder', icon: Users },
    { num: 4, label: 'Review', icon: ShieldCheck },
  ];

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-[#34C759]/10 text-[#34C759] rounded-full flex items-center justify-center mx-auto shadow-apple-sm border border-[#34C759]/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F]">
            Venture Mapped
          </h1>
          <p className="text-sm text-[#86868B] max-w-md mx-auto leading-relaxed">
            <strong>{formData.name}</strong> has been listed. You can now access your Founder Dashboard to enrich your profile with metrics, milestones, and hiring posts.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-black/[0.08] max-w-sm mx-auto text-left text-xs space-y-2 text-[#86868B] shadow-apple-card">
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>Venture:</span>
            <span className="font-semibold text-[#1D1D1F]">{formData.name}</span>
          </div>
          <div className="flex justify-between border-b border-black/[0.05] pb-2">
            <span>Location:</span>
            <span className="font-semibold text-[#1D1D1F]">{formData.city}, {formData.district}</span>
          </div>
          <div className="flex justify-between">
            <span>Coordinates:</span>
            <span className="font-mono font-medium text-[#0071E3]">{formData.latitude.toFixed(4)}°, {formData.longitude.toFixed(4)}°</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/founder"
            className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-full shadow-apple-sm apple-press"
          >
            Founder Dashboard
          </Link>
          <Link
            to="/map"
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#1D1D1F] font-semibold text-xs rounded-full border border-black/[0.08] shadow-2xs apple-press"
          >
            View Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <Helmet>
        <title>Submit Your Startup — Tamil Nadu Startup Connect</title>
        <meta name="description" content="List your startup on Tamil Nadu's venture directory." />
        <link rel="canonical" href={canonicalUrl('/submit')} />
      </Helmet>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
          Join the Tamil Nadu Startup Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto">
          Map your company across 38 districts to get discovered by investors, partners, and talent.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-black/[0.03] rounded-2xl border border-black/[0.04]">
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
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white text-[#0071E3] shadow-apple-sm'
                  : isCompleted
                  ? 'text-[#34C759] hover:bg-white/40'
                  : 'text-[#86868B] hover:bg-white/20'
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Venture Identity */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Company Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. AgniKul Cosmos, Freshworks, Ather Energy..."
                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">Official Website URL *</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourstartup.com"
                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">One-Line Pitch / Tagline *</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Making space accessible with single-piece 3D-printed rocket engines"
                className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1.5">Industry Sectors *</label>
              <div className="flex flex-wrap gap-1.5">
                {sectorsList.map((sec) => {
                  const isSelected = formData.sectors.includes(sec.name);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSectorToggle(sec.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs outline-none"
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
                <label className="block font-semibold text-[#1D1D1F] mb-1">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs outline-none"
                >
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Founded</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleChange('foundedYear', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Physical Address & Map Pin Location */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Tamil Nadu District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-medium text-[#1D1D1F] text-xs outline-none"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">City / Area / Tech Hub *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. OMR, Taramani, Saravanampatti..."
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Office / Tech Park Address
                </label>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={(val) => handleChange('address', val)}
                  onSelectSuggestion={handleAddressSuggestionSelect}
                  districtContext={formData.district}
                  placeholder="Type street, building, or tech park..."
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="e.g. 600113"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs font-mono outline-none"
                />
              </div>
            </div>

            {/* Seamless Interactive Map Surface */}
            <div className="pt-2">
              <MapLocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                districtName={formData.district}
                cityName={formData.city}
                onLocationChange={handleLocationPickerChange}
                height="300px"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Founder Contact */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Founder / Submitter Name *</label>
                <input
                  type="text"
                  value={formData.founderName}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  placeholder="e.g. Srinath Ravichandran"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  value={formData.founderEmail}
                  onChange={(e) => handleChange('founderEmail', e.target.value)}
                  placeholder="founder@yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={formData.founderRole}
                  onChange={(e) => handleChange('founderRole', e.target.value)}
                  placeholder="e.g. Co-Founder & CEO"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">LinkedIn Profile (Optional)</label>
                <input
                  type="url"
                  value={formData.founderLinkedin}
                  onChange={(e) => handleChange('founderLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Venture:</span>
                <span className="font-bold text-[#1D1D1F]">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Pitch:</span>
                <span className="font-medium text-[#1D1D1F] text-right max-w-xs">{formData.tagline}</span>
              </div>
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Location:</span>
                <span className="font-bold text-[#0071E3]">{formData.city}, {formData.district}</span>
              </div>
              {formData.address && (
                <div className="flex justify-between border-b border-black/[0.04] pb-2">
                  <span className="text-[#86868B]">Address:</span>
                  <span className="font-medium text-[#1D1D1F] text-right">{formData.address}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-black/[0.04] pb-2">
                <span className="text-[#86868B]">Sectors:</span>
                <span className="font-semibold text-[#1D1D1F]">{formData.sectors.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868B]">Founder:</span>
                <span className="font-medium text-[#1D1D1F]">{formData.founderName} ({formData.founderEmail})</span>
              </div>
            </div>

            {/* Readonly Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-black/[0.08]">
              <MapLocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={() => {}}
                height="160px"
                readOnly={true}
              />
            </div>

            {/* Consent */}
            <div className="p-3 rounded-2xl bg-white border border-black/[0.08] flex items-start gap-2.5">
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
                </Link>.
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs apple-press cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center gap-1.5 shadow-apple-sm transition-all apple-press cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !agreedConsent}
              className="px-6 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 shadow-apple-sm transition-all apple-press disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Submit Venture</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
