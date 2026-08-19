import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Users, 
  Layers, 
  MessageSquare, 
  ExternalLink, 
  Code, 
  FileText,
  Briefcase,
  Sparkles,
  Calendar,
  Link as LinkIcon,
  Globe,
  Phone,
  Mail,
  MapPin,
  Share2,
  Send,
  UserCheck,
  Palette,
  Check
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Startup, FounderInfo, CompanyPost, CustomProfileSection, BANNER_PRESETS } from '../../../types';

export const FounderEditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [targetTransferEmail, setTargetTransferEmail] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'brand' | 'banner' | 'contact' | 'tech' | 'team' | 'gallery' | 'posts' | 'sections' | 'transfer'
  >('brand');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    extendedBio: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    pincode: '',
    linkedin: '',
    twitter: '',
    github: '',
    logoUrl: '',
    bannerUrl: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      facebook: '',
      slack: '',
      discord: '',
      youtube: '',
      blog: '',
    },
    teamSize: '1-10',
    stage: 'Seed' as any,
    isHiring: false,
    techStack: [] as string[],
    galleryImages: [] as string[],
    founders: [] as FounderInfo[],
    posts: [] as CompanyPost[],
    customSections: [] as CustomProfileSection[],
  });

  // Helper inputs
  const [newTech, setNewTech] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // New post modal state
  const [newPost, setNewPost] = useState<Partial<CompanyPost>>({
    title: '',
    content: '',
    tag: 'Milestone',
    date: new Date().toISOString().split('T')[0],
    linkUrl: '',
  });

  // New founder state
  const [newFounder, setNewFounder] = useState<Partial<FounderInfo>>({
    name: '',
    role: '',
    bio: '',
    linkedin: '',
    education: '',
  });

  // New custom section state
  const [newSection, setNewSection] = useState<Partial<CustomProfileSection>>({
    title: '',
    content: '',
  });

  const [activeStartupId, setActiveStartupId] = useState<string>(() => {
    return localStorage.getItem('tn_active_startup_id') || user?.claimedStartupId || 'agnikul-cosmos';
  });

  useEffect(() => {
    const handleSwitched = (e: any) => {
      if (e.detail?.startupId) {
        setActiveStartupId(e.detail.startupId);
      }
    };
    window.addEventListener('startup-switched', handleSwitched);
    return () => window.removeEventListener('startup-switched', handleSwitched);
  }, []);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setLoading(true);
        const target = activeStartupId || user?.claimedStartupId || 'agnikul-cosmos';
        const res = await fetch(`/api/startups/${target}`);
        const data = await res.json();
        if (data.success && data.data) {
          const s = data.data as Startup;
          setStartup(s);
          setFormData({
            name: s.name || '',
            tagline: s.tagline || '',
            description: s.description || '',
            extendedBio: s.extendedBio || '',
            website: s.website || '',
            contactEmail: s.contactEmail || '',
            contactPhone: s.contactPhone || '',
            address: s.address || '',
            pincode: s.pincode || '',
            linkedin: s.linkedin || '',
            twitter: s.twitter || '',
            github: s.github || '',
            logoUrl: s.logoUrl || '',
            bannerUrl: s.bannerUrl || BANNER_PRESETS[0].url,
            socialLinks: {
              linkedin: s.socialLinks?.linkedin || s.linkedin || '',
              twitter: s.socialLinks?.twitter || s.twitter || '',
              github: s.socialLinks?.github || s.github || '',
              facebook: s.socialLinks?.facebook || '',
              slack: s.socialLinks?.slack || '',
              discord: s.socialLinks?.discord || '',
              youtube: s.socialLinks?.youtube || '',
              blog: s.socialLinks?.blog || '',
            },
            teamSize: s.teamSize || '1-10',
            stage: s.stage || 'Seed',
            isHiring: Boolean(s.isHiring),
            techStack: s.techStack || [],
            galleryImages: s.galleryImages || [],
            founders: s.founders || [],
            posts: s.posts || [],
            customSections: s.customSections || [],
          });
        } else {
          setError(data.message || 'Could not load startup profile');
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [user, activeStartupId]);

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (!formData.techStack.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()],
      }));
    }
    setNewTech('');
  };

  const handleRemoveTech = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tag),
    }));
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleAddFounder = () => {
    if (!newFounder.name || !newFounder.role) return;
    setFormData((prev) => ({
      ...prev,
      founders: [
        ...prev.founders,
        {
          name: newFounder.name!,
          role: newFounder.role!,
          bio: newFounder.bio || '',
          linkedin: newFounder.linkedin || '',
          education: newFounder.education || '',
        },
      ],
    }));
    setNewFounder({ name: '', role: '', bio: '', linkedin: '', education: '' });
  };

  const handleRemoveFounder = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      founders: prev.founders.filter((_, i) => i !== index),
    }));
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: CompanyPost = {
      id: `post-${Date.now()}`,
      title: newPost.title!,
      content: newPost.content!,
      date: newPost.date || new Date().toISOString().split('T')[0],
      tag: newPost.tag || 'Milestone',
      linkUrl: newPost.linkUrl || '',
    };
    setFormData((prev) => ({
      ...prev,
      posts: [post, ...prev.posts],
    }));
    setNewPost({ title: '', content: '', tag: 'Milestone', date: new Date().toISOString().split('T')[0], linkUrl: '' });
  };

  const handleRemovePost = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
    }));
  };

  const handleAddCustomSection = () => {
    if (!newSection.title || !newSection.content) return;
    const section: CustomProfileSection = {
      id: `sec-${Date.now()}`,
      title: newSection.title!,
      content: newSection.content!,
    };
    setFormData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, section],
    }));
    setNewSection({ title: '', content: '' });
  };

  const handleRemoveCustomSection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
    }));
  };

  const handleTransferOwnership = async () => {
    if (!targetTransferEmail.trim()) {
      alert('Please enter the target founder email address.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to transfer ownership of "${formData.name}" to ${targetTransferEmail}? You will no longer manage this startup.`
    );
    if (!confirmed || !startup) return;

    setTransferLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/startups/${startup.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail: targetTransferEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTransferSuccess(`Company ownership successfully transferred to ${targetTransferEmail}!`);
        setTargetTransferEmail('');
        setTimeout(() => {
          navigate('/founder/dashboard');
        }, 2500);
      } else {
        setError(data.message || 'Transfer failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during company transfer');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startup) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/startups/${startup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setError(data.message || 'Failed to save updates');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while saving updates');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-36 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs text-[#86868B] font-medium">Loading startup studio data...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'brand', label: 'Identity & Story', icon: Building2 },
    { id: 'banner', label: 'Banner Design', icon: Palette },
    { id: 'contact', label: 'Contact & Socials', icon: Share2 },
    { id: 'tech', label: 'Tech Stack', icon: Code },
    { id: 'team', label: 'Leadership', icon: Users },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
    { id: 'posts', label: 'Milestones & News', icon: MessageSquare },
    { id: 'sections', label: 'Custom Sections', icon: Layers },
    { id: 'transfer', label: 'Company Transfer', icon: UserCheck },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-black/[0.08] shadow-apple-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
              Founder Studio
            </span>
            <span className="text-xs text-[#86868B] font-medium">Live Profile Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1D1D1F] tracking-tight mt-1">
            Edit Company Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
            Customize how {formData.name || 'your startup'} appears across the Tamil Nadu Startup Map.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/founder/dashboard"
            className="px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-white text-xs font-semibold text-[#1D1D1F] hover:bg-slate-50 transition-all apple-press"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 apple-press border border-[#0071E3]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-xs flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34C759]" />
          <span className="font-bold">Profile updates saved and published successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {transferSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-bold">{transferSuccess}</span>
        </div>
      )}

      {/* Segmented Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-black/[0.04] p-1.5 rounded-2xl border border-black/[0.04] no-scrollbar scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all apple-press-subtle ${
                isActive
                  ? 'bg-white text-[#1D1D1F] shadow-apple-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels Container */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
        
        {/* TAB 1: Brand & Identity */}
        {activeTab === 'brand' && (
          <div className="space-y-5 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Brand Assets & Core Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AgniKul Cosmos"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">One-Line Tagline *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Making space accessible to everyone"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Short Description (Directory Summary)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="High-level description of what your startup builds and solves..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Extended Story & Deep Dive</label>
              <textarea
                rows={4}
                value={formData.extendedBio}
                onChange={(e) => setFormData({ ...formData, extendedBio: e.target.value })}
                placeholder="Detailed founder narrative, technological breakthroughs, origins, and mission..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://.../logo.png"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isHiring}
                  onChange={(e) => setFormData({ ...formData, isHiring: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]"
                />
                <span className="font-bold text-[#1D1D1F]">Actively Recruiting & Hiring in Tamil Nadu</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: Banner Design & Curated Presets */}
        {activeTab === 'banner' && (
          <div className="space-y-6 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#0071E3]" />
                <span>Profile Background Banner</span>
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Set a custom banner URL or pick from curated Tamil Nadu ecosystem presets.
              </p>
            </div>

            {/* Live Banner Preview Card */}
            <div className="space-y-2">
              <label className="block font-bold text-[#1D1D1F]">Live Banner Preview</label>
              <div className="relative rounded-3xl overflow-hidden aspect-[21/6] bg-slate-900 border border-black/[0.1] shadow-apple-card">
                <img
                  src={formData.bannerUrl || BANNER_PRESETS[0].url}
                  alt="Banner preview"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-black/[0.08] shadow-apple-sm flex items-center justify-center">
                      {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <span className="font-bold text-base text-[#1D1D1F]">{formData.name.charAt(0) || 'S'}</span>
                      )}
                    </div>
                    <div className="text-white">
                      <p className="font-bold text-base">{formData.name || 'Startup Name'}</p>
                      <p className="text-xs text-white/80">{formData.tagline || 'Tagline preview'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Banner Input */}
            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Custom Image URL</label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                placeholder="https://.../your-custom-banner.jpg"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 font-mono text-xs"
              />
            </div>

            {/* Curated Presets Grid */}
            <div className="space-y-3 pt-2">
              <label className="block font-bold text-[#1D1D1F]">
                Curated Tamil Nadu Ecosystem Banner Presets
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BANNER_PRESETS.map((preset) => {
                  const isSelected = formData.bannerUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setFormData({ ...formData, bannerUrl: preset.url })}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1.5 bg-white shadow-2xs hover:shadow-apple-sm ${
                        isSelected
                          ? 'border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-apple-sm'
                          : 'border-black/[0.08] hover:border-black/[0.2]'
                      }`}
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={preset.previewUrl}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#0071E3] text-white text-[10px] font-bold flex items-center gap-1 shadow-apple-sm">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] font-semibold">
                          {preset.category}
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-xs text-[#1D1D1F] truncate">{preset.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Contact & Comprehensive Social Networks */}
        {activeTab === 'contact' && (
          <div className="space-y-6 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#0071E3]" />
                <span>Contact Info & Community Channels</span>
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Provide public channels for investors, candidates, and ecosystem partners to reach your venture.
              </p>
            </div>

            {/* Direct Contact Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#86868B]">Official Direct Inquiries</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Official Inquiries Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="contact@yourstartup.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Press / Office Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 44 1234 5678"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#1D1D1F] mb-1">HQ Address / Facility</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Module 4, IIT Madras Research Park, Taramani"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Postal PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="600113"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>
            </div>

            {/* Social & Community Channels */}
            <div className="space-y-4 pt-3 border-t border-black/[0.06]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#86868B]">
                Social & Community Links (GitHub, X, Slack, Discord, FB, YouTube)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">GitHub Organization / Repo</label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/your-org"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">X (Formerly Twitter)</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="https://x.com/yourhandle"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">LinkedIn Page</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/yourstartup"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Facebook / Meta Page</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Slack Community Invite URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks.slack}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, slack: e.target.value },
                      })
                    }
                    placeholder="https://join.slack.com/t/..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Discord Community Server</label>
                  <input
                    type="url"
                    value={formData.socialLinks.discord}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, discord: e.target.value },
                      })
                    }
                    placeholder="https://discord.gg/..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">YouTube Channel / Demos</label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Engineering Blog / Substack</label>
                  <input
                    type="url"
                    value={formData.socialLinks.blog}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, blog: e.target.value },
                      })
                    }
                    placeholder="https://blog.yourstartup.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Tech Stack */}
        {activeTab === 'tech' && (
          <div className="space-y-5 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Engineering Architecture & Technology Stack
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="e.g. PyTorch, Rust, 3D Printing, React, SolidWorks..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-apple-sm transition-all apple-press flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tech</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] font-bold text-[#1D1D1F]"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-[#86868B] hover:text-rose-600 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Leadership & Key Team Members */}
        {activeTab === 'team' && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                  Leadership & Key Team Members
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">Showcase founders, executive officers, and scientific advisors.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                {formData.founders.length} Members
              </span>
            </div>

            {/* Add Team Member Card Box */}
            <div className="p-5 rounded-3xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <h4 className="font-bold text-[#1D1D1F] text-xs flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Add New Team Member / Founder</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newFounder.name}
                  onChange={(e) => setNewFounder({ ...newFounder, name: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Co-Founder & CEO) *"
                  value={newFounder.role}
                  onChange={(e) => setNewFounder({ ...newFounder, role: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="LinkedIn Profile URL"
                  value={newFounder.linkedin}
                  onChange={(e) => setNewFounder({ ...newFounder, linkedin: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
                <input
                  type="text"
                  placeholder="Education / Alma Mater (e.g. IIT Madras)"
                  value={newFounder.education}
                  onChange={(e) => setNewFounder({ ...newFounder, education: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <textarea
                placeholder="Short biographical summary / background..."
                rows={2}
                value={newFounder.bio}
                onChange={(e) => setNewFounder({ ...newFounder, bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />

              <button
                type="button"
                onClick={handleAddFounder}
                className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-apple-sm transition-all apple-press flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Team Member</span>
              </button>
            </div>

            {/* Existing Founders List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.founders.map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-apple-sm space-y-1.5 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveFounder(i)}
                    className="absolute top-3 right-3 text-[#86868B] hover:text-rose-600 p-1"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="font-bold text-[#1D1D1F] text-sm">{f.name}</p>
                  <p className="text-[#0071E3] font-bold text-xs">{f.role}</p>
                  {f.education && <p className="text-[#86868B] text-[11px]">{f.education}</p>}
                  {f.bio && <p className="text-[#86868B] text-[11px] line-clamp-2 mt-1">{f.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Media & Product Screenshots */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                  Media & Product Screenshots
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">Add high-resolution product visuals, facility photos, and patents.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                {formData.galleryImages.length} Images
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="https://.../product-screenshot.png"
                className="flex-1 px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-apple-sm transition-all apple-press flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Screenshot / Media</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-black/[0.08] shadow-apple-sm group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Company Milestones & News Releases */}
        {activeTab === 'posts' && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                  Company Milestones & News Releases
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">Post funding announcements, product launches, and regulatory approvals.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                {formData.posts.length} Milestones
              </span>
            </div>

            {/* Add Milestone Card Box */}
            <div className="p-5 rounded-3xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <h4 className="font-bold text-[#1D1D1F] text-xs flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Publish New Milestone / News Release</span>
              </h4>

              <input
                type="text"
                placeholder="Update Title (e.g. Closed $20M Series B Funding) *"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              />

              <textarea
                placeholder="Content & details of this achievement or press release..."
                rows={3}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="External Press Link URL"
                  value={newPost.linkUrl}
                  onChange={(e) => setNewPost({ ...newPost, linkUrl: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
                <input
                  type="text"
                  placeholder="Category Tag (e.g. Funding, Product, Launch, Award)"
                  value={newPost.tag}
                  onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                  className="px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPost}
                className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-apple-sm transition-all apple-press flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Company Milestone / News</span>
              </button>
            </div>

            {/* Existing Posts List */}
            <div className="space-y-3">
              {formData.posts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-apple-sm space-y-1.5 relative">
                  <button
                    type="button"
                    onClick={() => handleRemovePost(post.id)}
                    className="absolute top-3 right-3 text-[#86868B] hover:text-rose-600 p-1"
                    title="Remove milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                    {post.tag}
                  </span>
                  <h4 className="font-bold text-[#1D1D1F] text-sm">{post.title}</h4>
                  <p className="text-[#86868B] text-xs leading-relaxed">{post.content}</p>
                  {post.linkUrl && (
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0071E3] font-bold text-[11px] flex items-center gap-1 hover:underline pt-1"
                    >
                      <span>Read Press Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Custom Sections */}
        {activeTab === 'sections' && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                  Custom Content Modules
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">Create custom profile sections (e.g. Patent Portfolio, Research Grants, ESG).</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                {formData.customSections.length} Sections
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <h4 className="font-bold text-[#1D1D1F] text-xs">Add Custom Section</h4>
              <input
                type="text"
                placeholder="Section Title (e.g. Patent Portfolio, ESG Impact) *"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
              />
              <textarea
                placeholder="Description / detailed content for this section..."
                rows={3}
                value={newSection.content}
                onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
              <button
                type="button"
                onClick={handleAddCustomSection}
                className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-apple-sm transition-all apple-press flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Custom Section</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.customSections.map((sec) => (
                <div key={sec.id} className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-apple-sm space-y-1.5 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSection(sec.id)}
                    className="absolute top-3 right-3 text-[#86868B] hover:text-rose-600 p-1"
                    title="Remove section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <h4 className="font-bold text-[#1D1D1F] text-sm">{sec.title}</h4>
                  <p className="text-[#86868B] text-xs leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: Transfer Company Ownership */}
        {activeTab === 'transfer' && (
          <div className="space-y-6 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F] flex items-center gap-2 text-rose-700">
                <UserCheck className="w-4 h-4 text-rose-600" />
                <span>Transfer Company Ownership</span>
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Hand over management rights of <strong>{formData.name}</strong> to a verified co-founder or new company administrator.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-rose-900">Transfer Guidelines & Safeguards</h4>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Transferring company ownership immediately grants the recipient full management rights over this profile, team members, metrics, and hiring status. The recipient must already have a registered account on the platform.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-rose-200/60">
                <label className="block font-bold text-[#1D1D1F]">
                  Target Recipient Email Address *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={targetTransferEmail}
                    onChange={(e) => setTargetTransferEmail(e.target.value)}
                    placeholder="cofounder@yourcompany.com"
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleTransferOwnership}
                    disabled={transferLoading || !targetTransferEmail.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-apple-sm transition-all apple-press flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {transferLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Confirm & Transfer</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Sticky Bottom Floating Action Bar (Always Visible While Scrolling) */}
      <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-2xl p-4 rounded-3xl border border-black/[0.08] shadow-apple-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse" />
          <span className="font-bold text-[#1D1D1F]">Founder Studio Editor</span>
          <span className="text-[#86868B] hidden sm:inline">• Unsaved changes will publish directly to public profile</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/founder/dashboard"
            className="px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-white text-xs font-semibold text-[#1D1D1F] hover:bg-slate-50 transition-all apple-press"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 apple-press border border-[#0071E3]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish Changes</span>
          </button>
        </div>
      </div>

    </form>
  );
};
