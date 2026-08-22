import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Calendar, 
  Briefcase, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Code,
  Image as ImageIcon,
  MessageSquare,
  Award,
  Loader2,
  Lock,
  Mail,
  Phone,
  Send,
  MessageCircle,
  Copy,
  Hash,
  Newspaper,
  CheckCircle2,
  FileText,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { Startup, BANNER_PRESETS } from '../../../types';
import { ClaimModal } from '../components/ClaimModal';
import { StartupMap } from '../map/StartupMap';
import { useBookmarks } from '../../../context/BookmarkContext';

// Social Icon SVGs
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const SlackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const StartupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isBookmarked: checkIsBookmarked, toggleBookmark } = useBookmarks();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimOpen, setClaimOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [activeGalleryModal, setActiveGalleryModal] = useState<string | null>(null);

  const isBookmarked = startup ? checkIsBookmarked(startup.id) : false;

  useEffect(() => {
    setLogoError(false);
  }, [slug]);

  useEffect(() => {
    const fetchStartup = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/startups/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setStartup(data.data);
        } else {
          setError(data.message || 'Startup profile not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to database');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStartup();
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${startup?.name} — TN Startup Map`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    if (!startup?.contactEmail) return;
    navigator.clipboard.writeText(startup.contactEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleBookmarkToggle = () => {
    if (!startup) return;
    toggleBookmark(startup.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
        <p className="text-xs font-mono text-[#86868B]">Hydrating startup record...</p>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-black/[0.08] shadow-apple-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-art text-[#1D1D1F]">
            {error || 'Startup Entity Not Found'}
          </h2>
          <p className="text-xs text-[#86868B] leading-relaxed">
            The requested venture may have been restructured or moved in the Tamil Nadu directory.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/startups"
              className="px-5 py-2.5 rounded-full bg-[#0071E3] text-white font-semibold text-xs shadow-apple-sm apple-press"
            >
              Browse All Startups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const effectiveBanner = startup.bannerUrl || BANNER_PRESETS[0].url;
  const effectiveLogo = startup.logoUrl || `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${startup.website}&size=128`;
  const socials = startup.socialLinks || {};

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] pb-24 text-left">
      {/* Precision Blueprint Tech Grid Canvas Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />

      {/* Top Breadcrumbs & Action Bar */}
      <div className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-black/[0.06] sticky top-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#86868B] font-mono">
            <Link to="/startups" className="hover:text-[#1D1D1F] flex items-center gap-1 font-semibold apple-press-subtle">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Directory</span>
            </Link>
            <span>/</span>
            <span className="text-[#1D1D1F] font-bold">{startup.district}</span>
            <span>/</span>
            <span className="font-bold text-[#0071E3] truncate max-w-[180px] sm:max-w-none">
              {startup.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] hover:bg-slate-50 font-semibold shadow-2xs apple-press cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Share2 className="w-3.5 h-3.5 text-[#86868B]" />}
              <span>{copied ? 'Copied Link' : 'Share'}</span>
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-full border transition-all apple-press cursor-pointer ${
                isBookmarked
                  ? 'bg-[#0071E3]/10 border-[#0071E3]/30 text-[#0071E3] shadow-2xs'
                  : 'border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50 shadow-2xs'
              }`}
              title={isBookmarked ? 'Saved to Bookmarks' : 'Save profile'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0071E3] text-[#0071E3]' : 'text-[#86868B]'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header with Background Canvas Banner */}
      <div className="relative z-10">
        
        {/* Full-Bleed Top Banner */}
        <div className="w-full h-44 sm:h-64 lg:h-72 bg-slate-900 relative overflow-hidden">
          <img 
            src={effectiveBanner} 
            alt={`${startup.name} banner`} 
            className="w-full h-full object-cover object-center opacity-90" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-black/25 to-transparent" />
        </div>

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            
            {/* Logo Avatar + Title Layer */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <div className="-mt-14 sm:-mt-16 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-2xs border border-black/[0.08] shrink-0 flex items-center justify-center overflow-hidden z-20">
                {effectiveLogo && !logoError ? (
                  <img 
                    src={effectiveLogo} 
                    alt={startup.name} 
                    onError={() => setLogoError(true)} 
                    className="w-full h-full object-contain rounded-2xl" 
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#0071E3] text-white font-art font-extrabold text-3xl flex items-center justify-center shadow-inner">
                    {startup.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Startup Name, Verification Status & Tagline */}
              <div className="pt-1 sm:pt-2 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-art text-[#1D1D1F] tracking-tight">
                    {startup.name}
                  </h1>
                  {startup.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#34C759] font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>Verified TN Entity</span>
                    </span>
                  )}
                  {startup.isHiring && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      HIRING
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#555558] font-normal max-w-2xl leading-relaxed">
                  {startup.tagline}
                </p>
              </div>
            </div>

            {/* Social Channels Suite & Primary CTAs */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs shadow-2xs transition-all apple-press"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Website</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </a>

              {(socials.linkedin || startup.linkedin) && (
                <a
                  href={socials.linkedin || startup.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-black/[0.08] bg-white text-[#86868B] hover:text-[#0071E3] hover:bg-slate-50 transition-all shadow-2xs apple-press"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}

              {(socials.twitter || startup.twitter) && (
                <a
                  href={socials.twitter || startup.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50 transition-all shadow-2xs apple-press"
                  title="X (Twitter)"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}

              {(socials.github || startup.github) && (
                <a
                  href={socials.github || startup.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-black/[0.08] bg-white text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50 transition-all shadow-2xs apple-press"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}

              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-black/[0.08] bg-white text-[#86868B] hover:text-blue-600 hover:bg-slate-50 transition-all shadow-2xs apple-press"
                  title="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}

              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-black/[0.08] bg-white text-[#86868B] hover:text-red-600 hover:bg-slate-50 transition-all shadow-2xs apple-press"
                  title="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Key Metrics Quick Bar (Seamless Canvas Embedded) */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-3 px-5 rounded-2xl bg-white/70 border border-black/[0.06] backdrop-blur-md shadow-2xs text-xs">
          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">Total Capital</span>
            <span className="font-extrabold font-art text-[#1D1D1F] text-sm mt-0.5 block truncate">
              {startup.totalFundingInr || startup.fundingType}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">Venture Stage</span>
            <span className="font-extrabold text-[#1D1D1F] text-sm mt-0.5 block">
              {startup.stage}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">Founded Year</span>
            <span className="font-extrabold text-[#1D1D1F] text-sm mt-0.5 block">
              {startup.foundedYear}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">Team Members</span>
            <span className="font-extrabold text-[#1D1D1F] text-sm mt-0.5 block">
              {startup.teamSize}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">District Base</span>
            <span className="font-extrabold text-[#0071E3] text-sm mt-0.5 block">
              {startup.district}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#86868B] block">Business Model</span>
            <span className="font-extrabold text-[#1D1D1F] text-sm mt-0.5 block truncate">
              {startup.businessModel || startup.fundingType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content (2-Column Architecture, Zero Floating Box Containers) */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (8 Cols): Overview, Business, Milestones, Awards, Tech, Team */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About / Overview */}
            <div className="space-y-3 pb-6 border-b border-black/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                <Building2 className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Executive Overview</span>
              </div>

              <p className="font-sans text-sm sm:text-base text-[#1D1D1F] leading-relaxed font-normal">
                {startup.description}
              </p>

              {startup.extendedBio && (
                <div className="pt-2 text-xs sm:text-sm text-[#555558] leading-relaxed space-y-2">
                  <p>{startup.extendedBio}</p>
                </div>
              )}

              {/* Sectors Cloud */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-mono font-semibold text-[#86868B] mr-1">Industry Verticals:</span>
                {startup.sectors.map((sec) => (
                  <Link
                    key={sec}
                    to={`/startups?sector=${encodeURIComponent(sec)}`}
                    className="px-3 py-1 rounded-full bg-white/80 border border-black/[0.06] text-[#1D1D1F] font-semibold text-[11px] hover:text-[#0071E3] hover:border-[#0071E3]/40 transition-all apple-press-subtle shadow-2xs"
                  >
                    {sec}
                  </Link>
                ))}
              </div>
            </div>

            {/* Business Model & Market Classification */}
            {(startup.businessModel || startup.revenueModel || startup.revenueRange || startup.targetMarket || startup.competitiveEdge) && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                  <Layers className="w-3.5 h-3.5 text-[#5856D6]" />
                  <span>Market Position & Commercial Architecture</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {startup.businessModel && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] shadow-2xs space-y-1">
                      <span className="text-[10px] font-mono font-semibold text-[#86868B] uppercase tracking-wider block">
                        Business Model
                      </span>
                      <span className="font-bold text-xs text-[#1D1D1F] block">{startup.businessModel}</span>
                    </div>
                  )}

                  {startup.revenueModel && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] shadow-2xs space-y-1">
                      <span className="text-[10px] font-mono font-semibold text-[#86868B] uppercase tracking-wider block">
                        Revenue Model
                      </span>
                      <span className="font-bold text-xs text-[#1D1D1F] block truncate">{startup.revenueModel}</span>
                    </div>
                  )}

                  {startup.revenueRange && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] shadow-2xs space-y-1">
                      <span className="text-[10px] font-mono font-semibold text-[#86868B] uppercase tracking-wider block">
                        Annual Scale
                      </span>
                      <span className="font-bold text-xs text-[#34C759] block">{startup.revenueRange}</span>
                    </div>
                  )}

                  {startup.targetMarket && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] shadow-2xs space-y-1">
                      <span className="text-[10px] font-mono font-semibold text-[#86868B] uppercase tracking-wider block">
                        Target Geography
                      </span>
                      <span className="font-bold text-xs text-[#1D1D1F] block truncate">{startup.targetMarket}</span>
                    </div>
                  )}

                  {startup.isProfitable !== undefined && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] shadow-2xs space-y-1">
                      <span className="text-[10px] font-mono font-semibold text-[#86868B] uppercase tracking-wider block">
                        Profitability Status
                      </span>
                      <span className="font-bold text-xs text-[#1D1D1F] block">
                        {startup.isProfitable ? 'Cash-Flow Positive' : 'Growth Investing'}
                      </span>
                    </div>
                  )}
                </div>

                {startup.competitiveEdge && (
                  <div className="p-4 rounded-2xl bg-[#0071E3]/[0.03] border border-[#0071E3]/15 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0071E3]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Proprietary Unfair Advantage / Moat</span>
                    </div>
                    <p className="text-xs text-[#1D1D1F] leading-relaxed">
                      {startup.competitiveEdge}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Milestones Timeline */}
            {startup.milestones && startup.milestones.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Company Growth Milestones</span>
                  </div>
                  <span className="text-xs font-mono text-[#86868B]">
                    {startup.milestones.length} logged
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {startup.milestones.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-black/[0.05] space-y-1.5 shadow-2xs text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-art font-extrabold text-[#1D1D1F] text-sm">{m.title}</span>
                          {m.category && (
                            <span className="px-2 py-0.5 rounded-md bg-[#0071E3]/10 text-[#0071E3] font-bold text-[10px]">
                              {m.category}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[#86868B] text-[11px] shrink-0">{m.date}</span>
                      </div>
                      {m.description && (
                        <p className="text-[#555558] leading-relaxed">{m.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Honors & Awards */}
            {startup.awards && startup.awards.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Honors & State Recognitions</span>
                  </div>
                  <span className="text-xs font-mono text-amber-700">
                    {startup.awards.length} citations
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {startup.awards.map((a, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-black/[0.05] space-y-1 shadow-2xs text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-art font-extrabold text-[#1D1D1F] text-xs leading-snug">{a.title}</span>
                        {a.year && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 font-bold text-[10px] shrink-0">
                            {a.year}
                          </span>
                        )}
                      </div>
                      {a.organization && (
                        <p className="text-[#86868B] text-[11px]">{a.organization}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Clients / Enterprise Customers */}
            {startup.keyClients && startup.keyClients.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                  <Target className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Key Clients & Enterprise Users</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {startup.keyClients.map((c, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-black/[0.05] text-center space-y-1 shadow-2xs">
                      <span className="font-bold text-xs text-[#1D1D1F] block truncate">{c.name}</span>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#0071E3] hover:underline flex items-center justify-center gap-0.5">
                          <span>Partner Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Press Coverage */}
            {startup.pressMentions && startup.pressMentions.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                  <Newspaper className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Featured Press & Media Coverage</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {startup.pressMentions.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-black/[0.05] flex items-center justify-between gap-3 text-xs shadow-2xs">
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1D1D1F] text-xs truncate">{p.title}</span>
                          <span className="px-2 py-0.5 rounded-md bg-black/[0.04] text-[#86868B] font-bold text-[10px] shrink-0">
                            {p.publication}
                          </span>
                        </div>
                      </div>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-white border border-black/[0.08] text-[#0071E3] font-semibold text-xs hover:bg-slate-50 flex items-center gap-1 shrink-0"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {startup.techStack && startup.techStack.length > 0 && (
              <div className="space-y-3 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                  <Code className="w-3.5 h-3.5 text-[#5856D6]" />
                  <span>Technology Stack & Technical Architecture</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {startup.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.06] text-[#1D1D1F] text-xs font-semibold shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Media & Product Gallery */}
            {startup.galleryImages && startup.galleryImages.length > 0 && (
              <div className="space-y-3 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Media & Product Gallery</span>
                  </div>
                  <span className="text-xs font-mono text-[#86868B]">
                    {startup.galleryImages.length} assets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {startup.galleryImages.map((imgUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveGalleryModal(imgUrl)}
                      className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 cursor-pointer border border-black/[0.08] hover:border-[#0071E3] transition-all shadow-2xs apple-press-subtle"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${startup.name} gallery ${i + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leadership & Founders Spotlight */}
            {startup.founders && startup.founders.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                  <Users className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Leadership & Founders</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {startup.founders.map((f, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/70 border border-black/[0.05] space-y-2 shadow-2xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] text-white font-bold text-xs flex items-center justify-center">
                            {f.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-art font-extrabold text-[#1D1D1F] text-xs">{f.name}</h4>
                            <p className="text-[11px] font-semibold text-[#0071E3]">{f.role}</p>
                          </div>
                        </div>

                        {f.linkedin && (
                          <a 
                            href={f.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1.5 rounded-full border border-black/[0.08] text-[#86868B] hover:text-[#1D1D1F] bg-white shadow-2xs apple-press"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {f.education && (
                        <p className="text-[11px] text-[#86868B]">
                          <span className="font-medium text-[#1D1D1F]">Education:</span> {f.education}
                        </p>
                      )}

                      {f.bio && (
                        <p className="text-[11px] text-[#555558] leading-relaxed pt-1">
                          {f.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Funding Timeline */}
            {startup.fundingRounds && startup.fundingRounds.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                    <DollarSign className="w-3.5 h-3.5 text-[#34C759]" />
                    <span>Funding Milestones & Cap Table</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#34C759]">
                    Total: {startup.totalFundingInr || startup.totalFundingUsd}
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {startup.fundingRounds.map((round, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-black/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-art font-extrabold text-[#1D1D1F] text-sm">{round.roundType}</span>
                          <span className="text-[#86868B]">•</span>
                          <span className="font-mono text-[#86868B] text-xs">{round.date}</span>
                        </div>
                        {round.investors && round.investors.length > 0 && (
                          <p className="text-[11px] text-[#86868B] mt-1">
                            <span className="font-medium text-[#1D1D1F]">Key Investors:</span> {round.investors.join(', ')}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-art font-extrabold text-sm text-[#34C759] block">
                          {round.amountInr || round.amountUsd || 'Undisclosed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (4 Cols): Spatial Map, Contact HQ, & Registry Record */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contact & Official HQ Module */}
            <div className="p-5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                <Mail className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Contact & Facility</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {startup.contactEmail ? (
                  <div className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#86868B] uppercase tracking-wider block">
                      Direct Inquiry Channel
                    </span>
                    <div className="flex items-center justify-between">
                      <a
                        href={`mailto:${startup.contactEmail}`}
                        className="font-bold text-xs text-[#0071E3] hover:underline truncate"
                      >
                        {startup.contactEmail}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
                        title="Copy email"
                      >
                        {emailCopied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <a
                    href={`mailto:inquiry@${startup.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`}
                    className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.04] flex items-center justify-between text-[#0071E3] font-bold hover:bg-black/[0.04] transition-all"
                  >
                    <span>Send Partnership Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </a>
                )}

                {startup.contactPhone && (
                  <div className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#86868B] uppercase tracking-wider block">
                      Press & Office Line
                    </span>
                    <a
                      href={`tel:${startup.contactPhone}`}
                      className="font-bold text-xs text-[#1D1D1F] hover:text-[#0071E3]"
                    >
                      {startup.contactPhone}
                    </a>
                  </div>
                )}

                {startup.address && (
                  <div className="p-3 bg-black/[0.02] rounded-xl border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#86868B] uppercase tracking-wider block">
                      Physical Facility Address
                    </span>
                    <p className="font-semibold text-xs text-[#1D1D1F] leading-relaxed">
                      {startup.address}
                      {startup.pincode && `, PIN: ${startup.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Spatial Location & Map Module */}
            <div className="p-5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#86868B]">
                <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Spatial Location</span>
              </div>

              <div className="h-44 rounded-xl overflow-hidden border border-black/[0.06]">
                <StartupMap
                  startups={[startup]}
                  height="100%"
                  showDistrictLayer={false}
                />
              </div>

              <div className="space-y-1 text-xs pt-1">
                <p className="font-art font-extrabold text-[#1D1D1F]">{startup.city || startup.district}</p>
                <p className="text-[#86868B] text-[11px]">{startup.district} District, Tamil Nadu</p>
                <Link
                  to={`/map?district=${startup.districtSlug}`}
                  className="inline-flex items-center gap-1 text-[#0071E3] font-semibold text-xs hover:underline pt-1"
                >
                  <span>Explore {startup.district} Innovation Hub</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Ecosystem Accreditation & Registry Record */}
            <div className="p-5 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#34C759]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Official Registry Record</span>
              </div>
              <p className="text-[#86868B] text-xs leading-relaxed">
                Verified entity on the Tamil Nadu Spatial Innovation Map.
              </p>

              <div className="space-y-2 pt-1 font-mono text-[11px]">
                {startup.dpiitNumber && (
                  <div className="p-2.5 bg-black/[0.02] rounded-xl border border-black/[0.04]">
                    <span className="text-[#86868B] block text-[10px]">DPIIT Recognition:</span>
                    <span className="font-bold text-[#1D1D1F]">{startup.dpiitNumber}</span>
                  </div>
                )}

                {startup.incubator && (
                  <div className="p-2.5 bg-black/[0.02] rounded-xl border border-black/[0.04]">
                    <span className="text-[#86868B] block text-[10px]">Incubation Center:</span>
                    <span className="font-bold text-[#1D1D1F]">{startup.incubator}</span>
                  </div>
                )}

                {startup.accelerator && (
                  <div className="p-2.5 bg-black/[0.02] rounded-xl border border-black/[0.04]">
                    <span className="text-[#86868B] block text-[10px]">Accelerator Program:</span>
                    <span className="font-bold text-[#1D1D1F]">{startup.accelerator}</span>
                  </div>
                )}

                <div className="p-2.5 bg-black/[0.02] rounded-xl border border-black/[0.04]">
                  <span className="text-[#86868B] block text-[10px]">Verification Source:</span>
                  <span className="font-bold text-[#1D1D1F]">{startup.source}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-[11px]">
                <span className="text-[#86868B]">Need to update record?</span>
                <Link
                  to={`/support?tab=claim&startup=${startup.slug}`}
                  className="text-[#0071E3] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Support & Claims</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        startup={startup}
        isOpen={claimOpen}
        onClose={() => setClaimOpen(false)}
      />

      {/* Lightbox Modal (Apple Photo Viewer) */}
      {activeGalleryModal && (
        <div 
          onClick={() => setActiveGalleryModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-white p-2 border border-white/20">
            <img src={activeGalleryModal} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

    </div>
  );
};
