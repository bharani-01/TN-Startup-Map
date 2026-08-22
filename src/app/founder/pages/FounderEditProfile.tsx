import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  Check,
  Award,
  TrendingUp,
  ShieldCheck,
  Video,
  FileCheck,
  Newspaper,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Startup, 
  FounderInfo, 
  CompanyPost, 
  CustomProfileSection, 
  StartupMilestone, 
  StartupAward, 
  StartupClient, 
  StartupPress, 
  BANNER_PRESETS 
} from '../../../types';

export const FounderEditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [targetTransferEmail, setTargetTransferEmail] = useState<string>('');

  const initialTab = (searchParams.get('tab') as any) || 'brand';
  const [activeTab, setActiveTab] = useState<
    'brand' | 'business' | 'milestones' | 'clients' | 'credentials' | 'team' | 'tech' | 'gallery' | 'posts' | 'sections' | 'transfer'
  >(initialTab);

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
    fundingType: 'Bootstrapped' as any,
    totalFundingInr: '',
    totalFundingUsd: '',
    isHiring: false,
    
    // Extended fields
    businessModel: '',
    revenueModel: '',
    revenueRange: '',
    targetMarket: '',
    customerSegments: [] as string[],
    incubator: '',
    accelerator: '',
    dpiitNumber: '',
    demoVideoUrl: '',
    pitchDeckUrl: '',
    competitiveEdge: '',
    isProfitable: false,
    
    // Lists
    milestones: [] as StartupMilestone[],
    awards: [] as StartupAward[],
    keyClients: [] as StartupClient[],
    pressMentions: [] as StartupPress[],
    techStack: [] as string[],
    galleryImages: [] as string[],
    founders: [] as FounderInfo[],
    posts: [] as CompanyPost[],
    customSections: [] as CustomProfileSection[],
  });

  // Helper inputs
  const [newTech, setNewTech] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // New milestone state
  const [newMilestone, setNewMilestone] = useState<StartupMilestone>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Product Milestone',
  });

  // New award state
  const [newAward, setNewAward] = useState<StartupAward>({
    title: '',
    organization: '',
    year: new Date().getFullYear(),
    url: '',
  });

  // New client state
  const [newClient, setNewClient] = useState<StartupClient>({
    name: '',
    logoUrl: '',
    website: '',
  });

  // New press mention state
  const [newPress, setNewPress] = useState<StartupPress>({
    title: '',
    publication: '',
    url: '',
    publishedDate: new Date().toISOString().split('T')[0],
  });

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
    return localStorage.getItem('tn_active_startup_id') || '';
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
        const res = await fetch('/api/founder/my-startups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.data?.startups && data.data.startups.length > 0) {
          const list: Startup[] = data.data.startups;
          const s = list.find((item) => item.id === activeStartupId || item.slug === activeStartupId) || list[0];
          setStartup(s);
          setActiveStartupId(s.id);
          localStorage.setItem('tn_active_startup_id', s.id);
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
            bannerUrl: s.bannerUrl || '',
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
            fundingType: s.fundingType || 'Bootstrapped',
            totalFundingInr: s.totalFundingInr || '',
            totalFundingUsd: s.totalFundingUsd || '',
            isHiring: Boolean(s.isHiring),
            businessModel: s.businessModel || '',
            revenueModel: s.revenueModel || '',
            revenueRange: s.revenueRange || '',
            targetMarket: s.targetMarket || '',
            customerSegments: s.customerSegments || [],
            incubator: s.incubator || '',
            accelerator: s.accelerator || '',
            dpiitNumber: s.dpiitNumber || '',
            demoVideoUrl: s.demoVideoUrl || '',
            pitchDeckUrl: s.pitchDeckUrl || '',
            competitiveEdge: s.competitiveEdge || '',
            isProfitable: Boolean(s.isProfitable),
            milestones: s.milestones || [],
            awards: s.awards || [],
            keyClients: s.keyClients || [],
            pressMentions: s.pressMentions || [],
            techStack: s.techStack || [],
            galleryImages: s.galleryImages || [],
            founders: s.founders || [],
            posts: s.posts || [],
            customSections: s.customSections || [],
          });
        } else {
          setStartup(null);
        }
      } catch (err) {
        console.error('Error fetching startup for editing:', err);
        setStartup(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStartup();
    } else {
      setLoading(false);
    }
  }, [token, user, activeStartupId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (!formData.techStack.includes(newTech.trim())) {
      setFormData((prev) => ({ ...prev, techStack: [...prev.techStack, newTech.trim()] }));
    }
    setNewTech('');
  };

  const handleRemoveTech = (item: string) => {
    setFormData((prev) => ({ ...prev, techStack: prev.techStack.filter((t) => t !== item) }));
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, newGalleryUrl.trim()] }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  // Milestone handlers
  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) return;
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { ...newMilestone, id: `mls-${Date.now()}` }
      ]
    }));
    setNewMilestone({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Product Milestone',
    });
  };

  const handleRemoveMilestone = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx)
    }));
  };

  // Award handlers
  const handleAddAward = () => {
    if (!newAward.title.trim()) return;
    setFormData((prev) => ({
      ...prev,
      awards: [
        ...prev.awards,
        { ...newAward, id: `awd-${Date.now()}` }
      ]
    }));
    setNewAward({
      title: '',
      organization: '',
      year: new Date().getFullYear(),
      url: '',
    });
  };

  const handleRemoveAward = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== idx)
    }));
  };

  // Client handlers
  const handleAddClient = () => {
    if (!newClient.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      keyClients: [
        ...prev.keyClients,
        { ...newClient, id: `clt-${Date.now()}` }
      ]
    }));
    setNewClient({
      name: '',
      logoUrl: '',
      website: '',
    });
  };

  const handleRemoveClient = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      keyClients: prev.keyClients.filter((_, i) => i !== idx)
    }));
  };

  // Press handlers
  const handleAddPress = () => {
    if (!newPress.title.trim() || !newPress.publication.trim()) return;
    setFormData((prev) => ({
      ...prev,
      pressMentions: [
        ...prev.pressMentions,
        { ...newPress, id: `prs-${Date.now()}` }
      ]
    }));
    setNewPress({
      title: '',
      publication: '',
      url: '',
      publishedDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleRemovePress = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      pressMentions: prev.pressMentions.filter((_, i) => i !== idx)
    }));
  };

  // Founder handlers
  const handleAddFounder = () => {
    if (!newFounder.name?.trim() || !newFounder.role?.trim()) return;
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

  // Custom section handlers
  const handleAddSection = () => {
    if (!newSection.title?.trim() || !newSection.content?.trim()) return;
    setFormData((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: `sec-${Date.now()}`,
          title: newSection.title!,
          content: newSection.content!,
        },
      ],
    }));
    setNewSection({ title: '', content: '' });
  };

  const handleRemoveSection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
    }));
  };

  // Company post handlers
  const handleAddPost = () => {
    if (!newPost.title?.trim() || !newPost.content?.trim()) return;
    setFormData((prev) => ({
      ...prev,
      posts: [
        {
          id: `post-${Date.now()}`,
          title: newPost.title!,
          content: newPost.content!,
          tag: newPost.tag || 'Milestone',
          date: newPost.date || new Date().toISOString().split('T')[0],
          linkUrl: newPost.linkUrl || '',
        },
        ...(prev.posts || []),
      ],
    }));
    setNewPost({
      title: '',
      content: '',
      tag: 'Milestone',
      date: new Date().toISOString().split('T')[0],
      linkUrl: '',
    });
  };

  const handleRemovePost = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      posts: (prev.posts || []).filter((p) => p.id !== id),
    }));
  };

  const handleSave = async () => {
    if (!startup) return;
    setSaving(true);
    setError(null);
    setSaved(false);

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
      if (!data.success) {
        throw new Error(data.message || 'Failed to update startup profile');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Network error while saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startup || !targetTransferEmail.trim()) return;
    setTransferLoading(true);
    setTransferSuccess(null);
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
      if (!data.success) {
        throw new Error(data.message || 'Ownership transfer failed');
      }

      setTransferSuccess(data.message || 'Company profile transferred successfully.');
      setTargetTransferEmail('');
    } catch (err: any) {
      setError(err.message || 'Error executing ownership transfer');
    } finally {
      setTransferLoading(false);
    }
  };

  const tabs = [
    { id: 'brand', label: 'Core Identity', icon: Building2 },
    { id: 'business', label: 'Business & Market', icon: DollarSign },
    { id: 'milestones', label: 'Milestones & Awards', icon: Award },
    { id: 'clients', label: 'Clients & Press', icon: Newspaper },
    { id: 'credentials', label: 'Credentials & Media', icon: ShieldCheck },
    { id: 'team', label: 'Founders & Team', icon: Users },
    { id: 'tech', label: 'Tech Stack', icon: Code },
    { id: 'gallery', label: 'Product Media', icon: ImageIcon },
    { id: 'posts', label: 'Company Posts', icon: MessageSquare },
    { id: 'sections', label: 'Custom Sections', icon: Layers },
    { id: 'transfer', label: 'Transfer Access', icon: UserCheck },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
        <p className="text-xs text-[#86868B]">Loading startup editor...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-black/[0.08] shadow-apple-card space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#1D1D1F]">No Linked Venture Found</h2>
        <p className="text-xs text-[#86868B]">You must have a verified or claimed startup to edit its details.</p>
        <Link to="/founder" className="inline-block px-4 py-2 rounded-lg bg-[#0071E3] text-white text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/founder')}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bold text-xl sm:text-2xl text-slate-900">
              Edit Profile: {startup.name}
            </h1>
            <p className="text-xs text-slate-500">
              Update your public presence, verified metrics, milestones, and credentials on the Tamil Nadu map.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/startups/${startup.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes successfully published to the live platform.</span>
        </div>
      )}

      {/* Main Tab Navigation Header */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-black/[0.03] rounded-2xl border border-black/[0.04] scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#0071E3] shadow-apple-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8 space-y-6">
        
        {/* TAB 1: CORE IDENTITY */}
        {activeTab === 'brand' && (
          <div className="space-y-5 text-xs">
            <h3 className="font-display font-bold text-base text-[#1D1D1F] border-b border-black/[0.06] pb-3">
              Core Identity & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Official Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">One-Line Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Making space accessible with single-piece 3D-printed rocket engines"
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Company Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Extended Bio / Background Narrative</label>
              <textarea
                rows={4}
                value={formData.extendedBio}
                onChange={(e) => handleChange('extendedBio', e.target.value)}
                placeholder="In-depth founding story, mission philosophy, and technical architecture..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Cover Banner URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) => handleChange('bannerUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Current Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-medium"
                >
                  <option value="Idea">Idea</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                  <option value="Bootstrapped">Bootstrapped</option>
                  <option value="Acquired">Acquired</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleChange('teamSize', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-medium"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Actively Hiring?</label>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHiring}
                      onChange={(e) => handleChange('isHiring', e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]"
                    />
                    <span className="font-semibold text-[#1D1D1F]">Display "Hiring" Beacon</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS & MARKET */}
        {activeTab === 'business' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Business Model & Market Classification
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                These fields allow institutional investors, angels, and corporate procurement teams to benchmark your venture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Business Model Type</label>
                <input
                  type="text"
                  value={formData.businessModel}
                  onChange={(e) => handleChange('businessModel', e.target.value)}
                  placeholder="e.g. B2B SaaS, B2C Marketplace, D2C Hardware, B2B2C..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Revenue Model</label>
                <input
                  type="text"
                  value={formData.revenueModel}
                  onChange={(e) => handleChange('revenueModel', e.target.value)}
                  placeholder="e.g. Annual Recurring Subscription, Transaction Fee (2.5%), Usage-based API..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Estimated Annual Revenue Range</label>
                <select
                  value={formData.revenueRange}
                  onChange={(e) => handleChange('revenueRange', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-medium"
                >
                  <option value="">Select Revenue Bracket (Optional)</option>
                  <option value="Pre-revenue">Pre-revenue (R&D Stage)</option>
                  <option value="< ₹1 Crore">&lt; ₹1 Crore ($0 - $120K)</option>
                  <option value="₹1 - 10 Crore">₹1 - 10 Crore ($120K - $1.2M)</option>
                  <option value="₹10 - 50 Crore">₹10 - 50 Crore ($1.2M - $6M)</option>
                  <option value="₹50 - 250 Crore">₹50 - 250 Crore ($6M - $30M)</option>
                  <option value="₹250 Crore+">₹250 Crore+ ($30M+ Scale)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Target Geographic Market</label>
                <input
                  type="text"
                  value={formData.targetMarket}
                  onChange={(e) => handleChange('targetMarket', e.target.value)}
                  placeholder="e.g. Pan-India, North America & Europe, South East Asia..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Company Profitability Status</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isProfitable"
                    checked={formData.isProfitable === true}
                    onChange={() => handleChange('isProfitable', true)}
                    className="text-[#0071E3] focus:ring-[#0071E3]"
                  />
                  <span className="font-semibold text-[#1D1D1F]">Profitable / Cash-flow Positive</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isProfitable"
                    checked={formData.isProfitable === false}
                    onChange={() => handleChange('isProfitable', false)}
                    className="text-[#0071E3] focus:ring-[#0071E3]"
                  />
                  <span className="font-semibold text-[#1D1D1F]">Growth Investing / Pre-profit</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Competitive Advantage / Moat Narrative</label>
              <textarea
                rows={3}
                value={formData.competitiveEdge}
                onChange={(e) => handleChange('competitiveEdge', e.target.value)}
                placeholder="What is your proprietary unfair advantage? e.g. Patented hardware architecture, exclusive Tamil Nadu distribution tie-ups, proprietary datasets..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 3: MILESTONES & AWARDS */}
        {activeTab === 'milestones' && (
          <div className="space-y-6 text-xs">
            {/* MILESTONES SECTION */}
            <div className="space-y-4">
              <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                    Company Milestones & Growth Timeline
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Chronological timeline of your venture's key accomplishments, launches, and scale events.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                  {formData.milestones.length} Recorded
                </span>
              </div>

              {/* Add Milestone Form */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
                <div className="font-bold text-[#1D1D1F] text-xs">Add New Milestone</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Milestone Title (e.g. Maiden Orbital Flight Launch)"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Description / Context (e.g. Successfully launched Agnibaan SOrTeD from Sriharikota)"
                      value={newMilestone.description || ''}
                      onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={newMilestone.category || 'Product Milestone'}
                      onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    >
                      <option value="Mission Milestone">Mission Milestone</option>
                      <option value="Product Innovation">Product Innovation</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Facility Expansion">Facility Expansion</option>
                      <option value="User Milestone">User Milestone</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {/* Milestones List */}
              <div className="space-y-2">
                {formData.milestones.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1D1F]">{m.title}</span>
                        {m.category && (
                          <span className="px-2 py-0.5 rounded-md bg-black/[0.04] text-[#86868B] text-[10px] font-semibold">
                            {m.category}
                          </span>
                        )}
                        <span className="text-[10px] text-[#86868B] font-mono">{m.date}</span>
                      </div>
                      {m.description && (
                        <p className="text-[#86868B] text-[11px] leading-normal">{m.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AWARDS SECTION */}
            <div className="space-y-4 pt-4 border-t border-black/[0.06]">
              <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                    Honors, Citations & Recognitions
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Document national awards, state recognitions (StartupTN), and industry citations.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 font-bold text-xs">
                  {formData.awards.length} Recorded
                </span>
              </div>

              {/* Add Award Form */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
                <div className="font-bold text-[#1D1D1F] text-xs">Add Recognition / Award</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Award Name (e.g. National Startup Award)"
                      value={newAward.title}
                      onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Conferring Organization (e.g. DPIIT, Govt. of India)"
                      value={newAward.organization || ''}
                      onChange={(e) => setNewAward({ ...newAward, organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Year (e.g. 2024)"
                      value={newAward.year || ''}
                      onChange={(e) => setNewAward({ ...newAward, year: Number(e.target.value) || undefined })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddAward}
                  className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Award</span>
                </button>
              </div>

              {/* Awards List */}
              <div className="space-y-2">
                {formData.awards.map((a, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1D1F]">{a.title}</span>
                        {a.year && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-semibold">
                            {a.year}
                          </span>
                        )}
                      </div>
                      {a.organization && (
                        <p className="text-[#86868B] text-[11px]">{a.organization}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLIENTS & PRESS */}
        {activeTab === 'clients' && (
          <div className="space-y-6 text-xs">
            {/* CLIENTS SECTION */}
            <div className="space-y-4">
              <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                    Key Customers & Enterprise Client Logos
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Highlight prominent commercial partners and enterprise customers using your solution.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                  {formData.keyClients.length} Added
                </span>
              </div>

              {/* Add Client Form */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
                <div className="font-bold text-[#1D1D1F] text-xs">Add Customer / Client</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Client Name (e.g. Amazon India)"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Client Website (https://...)"
                      value={newClient.website || ''}
                      onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Client Logo URL (Optional)"
                      value={newClient.logoUrl || ''}
                      onChange={(e) => setNewClient({ ...newClient, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddClient}
                  className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Customer Logo</span>
                </button>
              </div>

              {/* Clients List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.keyClients.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5 truncate">
                      <span className="font-bold text-[#1D1D1F] block truncate">{c.name}</span>
                      {c.website && (
                        <span className="text-[10px] text-[#0071E3] truncate block">{c.website}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveClient(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PRESS MENTIONS SECTION */}
            <div className="space-y-4 pt-4 border-t border-black/[0.06]">
              <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                    Press & Media Coverage
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    Links to news articles, launch announcements, and media features.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-xs">
                  {formData.pressMentions.length} Articles
                </span>
              </div>

              {/* Add Press Form */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
                <div className="font-bold text-[#1D1D1F] text-xs">Add News / Press Link</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Headline / Article Title"
                      value={newPress.title}
                      onChange={(e) => setNewPress({ ...newPress, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Publication Name (e.g. The Hindu, Mint, TechCrunch)"
                      value={newPress.publication}
                      onChange={(e) => setNewPress({ ...newPress, publication: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="url"
                      placeholder="Article URL (https://...)"
                      value={newPress.url}
                      onChange={(e) => setNewPress({ ...newPress, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={newPress.publishedDate || ''}
                      onChange={(e) => setNewPress({ ...newPress, publishedDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddPress}
                  className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Article Link</span>
                </button>
              </div>

              {/* Press List */}
              <div className="space-y-2">
                {formData.pressMentions.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1D1F] truncate">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-black/[0.04] text-[#86868B] text-[10px] font-semibold">
                          {p.publication}
                        </span>
                      </div>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#0071E3] hover:underline flex items-center gap-1">
                        <span>{p.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePress(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CREDENTIALS & MEDIA */}
        {activeTab === 'credentials' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Ecosystem Credentials & Investor Media
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Official accreditation, government recognition (DPIIT), incubator affiliation, and investor deck links.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">DPIIT Recognition Number</label>
                <input
                  type="text"
                  value={formData.dpiitNumber}
                  onChange={(e) => handleChange('dpiitNumber', e.target.value)}
                  placeholder="e.g. DIPP29841"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Incubation Center / Institution</label>
                <input
                  type="text"
                  value={formData.incubator}
                  onChange={(e) => handleChange('incubator', e.target.value)}
                  placeholder="e.g. IIT Madras Incubation Cell (IITMIC), PSG-STEP, Forge..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Accelerator Program (Optional)</label>
                <input
                  type="text"
                  value={formData.accelerator}
                  onChange={(e) => handleChange('accelerator', e.target.value)}
                  placeholder="e.g. Y Combinator, Techstars, IN-SPACe Accelerator..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Demo / Product Video URL (YouTube / Loom)</label>
                <input
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => handleChange('demoVideoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1D1D1F] mb-1">Investor Pitch Deck Link (DocSend / Google Drive)</label>
              <input
                type="url"
                value={formData.pitchDeckUrl}
                onChange={(e) => handleChange('pitchDeckUrl', e.target.value)}
                placeholder="https://docsend.com/view/..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>
          </div>
        )}

        {/* TAB 6: FOUNDERS & TEAM */}
        {activeTab === 'team' && (
          <div className="space-y-6 text-xs">
            <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                  Founding Team & Leadership
                </h3>
                <p className="text-xs text-[#86868B]">
                  Profiles of the core founders, their roles, alma maters, and LinkedIn links.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs">
                {formData.founders.length} Documented
              </span>
            </div>

            {/* Add Founder Form */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <div className="font-bold text-[#1D1D1F] text-xs">Add Founder / Key Leader</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Srinath Ravichandran)"
                    value={newFounder.name || ''}
                    onChange={(e) => setNewFounder({ ...newFounder, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Role Title (e.g. Co-Founder & CEO)"
                    value={newFounder.role || ''}
                    onChange={(e) => setNewFounder({ ...newFounder, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Alma Mater (e.g. IIT Madras, CEG Guindy)"
                    value={newFounder.education || ''}
                    onChange={(e) => setNewFounder({ ...newFounder, education: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={newFounder.linkedin || ''}
                    onChange={(e) => setNewFounder({ ...newFounder, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddFounder}
                className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Founder Member</span>
              </button>
            </div>

            {/* Founders List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.founders.map((f, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-black/[0.06] flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-[#1D1D1F] block">{f.name}</span>
                    <span className="text-[11px] text-[#0071E3] font-semibold block">{f.role}</span>
                    {f.education && (
                      <span className="text-[10px] text-[#86868B] block">{f.education}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFounder(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TECH STACK */}
        {activeTab === 'tech' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Engineering & Technology Stack
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Frameworks, programming languages, proprietary hardware tools, and cloud infrastructure.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add technology tag (e.g. Additive Manufacturing, RTOS, PyTorch, Rust, AWS...)"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-5 py-2.5 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-2xl shadow-apple-sm transition-all"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] text-[#1D1D1F] font-semibold text-xs border border-black/[0.05]"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-[#86868B] hover:text-rose-600 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GALLERY & MEDIA */}
        {activeTab === 'gallery' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Product Photos & Factory Gallery
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                High-resolution imagery of your hardware, cleanrooms, office corridors, or app screenshots.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste high-res image URL (https://images.unsplash.com/...)"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-5 py-2.5 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-2xl shadow-apple-sm transition-all"
              >
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-black/[0.08] aspect-video bg-slate-100">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: COMPANY POSTS */}
        {activeTab === 'posts' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Founder Updates & Ecosystem Posts
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Publish milestones, hiring notices, and product updates on your company profile stream.
              </p>
            </div>

            {/* Add Post Form */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <div className="font-bold text-[#1D1D1F]">Create New Update</div>
              <input
                type="text"
                placeholder="Post Headline (e.g. Agnibaan Maiden Flight Mission Completed)"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
              />
              <textarea
                rows={3}
                placeholder="Full announcement content..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs leading-relaxed"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Category Tag (e.g. Mission Milestone, Hiring Update)"
                  value={newPost.tag}
                  onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                />
                <input
                  type="url"
                  placeholder="External Announcement URL (Optional)"
                  value={newPost.linkUrl}
                  onChange={(e) => setNewPost({ ...newPost, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPost}
                className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Update</span>
              </button>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {(formData.posts || []).map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white border border-black/[0.06] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1D1D1F]">{p.title}</span>
                      {p.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0071E3]/10 text-[#0071E3] font-bold text-[10px]">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePost(p.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[#86868B] text-[11px] leading-relaxed">{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CUSTOM SECTIONS */}
        {activeTab === 'sections' && (
          <div className="space-y-5 text-xs">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Dynamic Custom Profile Sections
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Add unlimited custom content blocks (e.g. ESG Metrics, Patent Specifications, R&D Labs).
              </p>
            </div>

            {/* Add Section Form */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
              <div className="font-bold text-[#1D1D1F]">Add Custom Block</div>
              <input
                type="text"
                placeholder="Section Title (e.g. Patented Technology & Innovation)"
                value={newSection.title || ''}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs"
              />
              <textarea
                rows={3}
                placeholder="Section Content / Narrative description..."
                value={newSection.content || ''}
                onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-xs leading-relaxed"
              />
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Section</span>
              </button>
            </div>

            {/* Sections List */}
            <div className="space-y-3">
              {formData.customSections.map((sec) => (
                <div key={sec.id} className="p-4 rounded-2xl bg-white border border-black/[0.06] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1D1D1F]">{sec.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sec.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[#86868B] text-[11px] leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: TRANSFER OWNERSHIP */}
        {activeTab === 'transfer' && (
          <div className="space-y-5 text-xs max-w-xl">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="font-display font-bold text-base text-[#1D1D1F]">
                Transfer Profile Ownership
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Transfer management access of this startup entity to a co-founder or corporate communications team.
              </p>
            </div>

            {transferSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{transferSuccess}</span>
              </div>
            )}

            <form onSubmit={handleTransferOwnership} className="space-y-4">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Recipient Account Email</label>
                <input
                  type="email"
                  required
                  placeholder="cofounder@yourcompany.com"
                  value={targetTransferEmail}
                  onChange={(e) => setTargetTransferEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>Important Notice:</strong> Transferring ownership will immediately grant full editing and publishing rights to the recipient account.
              </div>

              <button
                type="submit"
                disabled={transferLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-full shadow-apple-sm transition-all disabled:opacity-50"
              >
                {transferLoading ? 'Transferring Ownership...' : 'Execute Ownership Transfer'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
