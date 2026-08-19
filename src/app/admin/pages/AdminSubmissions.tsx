import React, { useEffect, useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Key,
  Copy,
  Check,
  X,
  Eye,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Layers,
  Code
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminSubmissions: React.FC = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // View Profile / Detailed Review Modal
  const [previewSub, setPreviewSub] = useState<any | null>(null);

  // Credentials / Notification Modal
  const [credentialsModal, setCredentialsModal] = useState<{
    startupName: string;
    founderEmail: string;
    isNewUser: boolean;
    tempPassword?: string | null;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes: 'Verified and approved by admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Startup approved and published to live directory and map with Verified badge.' });
        
        if (data.data?.founderAccount) {
          setCredentialsModal({
            startupName: data.data.startup?.name || 'Startup',
            founderEmail: data.data.founderAccount.email,
            isNewUser: Boolean(data.data.founderAccount.isNewUser),
            tempPassword: data.data.founderAccount.tempPassword,
          });
        }
        
        if (previewSub?.id === id) {
          setPreviewSub(null);
        }
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Approval failed' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide reason for rejection:');
    if (!reason) return;

    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Submission rejected.' });
        if (previewSub?.id === id) {
          setPreviewSub(null);
        }
        fetchSubmissions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Rejection failed' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setActionLoading(null);
    }
  };

  const copyPassword = () => {
    if (credentialsModal?.tempPassword) {
      navigator.clipboard.writeText(credentialsModal.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Pending Startup Submissions
        </h1>
        <p className="text-xs sm:text-sm text-apple-secondary mt-1">
          Review community and founder proposals. Inspect complete submissions and one-click approve to publish to the live map.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-apple-emerald/10 border border-apple-emerald/20 text-apple-emerald'
              : 'bg-rose-950/40 border border-rose-800 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-apple-blue animate-spin mx-auto" />
          <p className="text-xs text-apple-secondary">Loading review queue...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-[#1c1c1e] rounded-3xl border border-white/10 space-y-3 shadow-apple-modal">
          <CheckCircle2 className="w-12 h-12 text-apple-emerald mx-auto" />
          <h3 className="text-base font-bold text-white font-display">Queue All Clear</h3>
          <p className="text-xs text-apple-secondary max-w-sm mx-auto">
            No pending submissions awaiting review. Check back later or test by submitting a new startup!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const rawData = sub?.data || {};
            const displayName = sub?.name || rawData.name || sub?.startupName || 'Startup';
            const displayInitial = displayName.charAt(0).toUpperCase();
            const displayTagline = sub?.tagline || rawData.tagline || sub?.shortDescription || '';
            const displayCity = sub?.city || rawData.city || '';
            const displayDistrict = sub?.district || rawData.district || '';
            const displaySectors = Array.isArray(sub?.sectors) ? sub.sectors : (Array.isArray(rawData.sectors) ? rawData.sectors : []);
            const displayFounder = sub?.founderName || rawData.founderName || 'Founder';
            const displayDate = sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recently';

            return (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-[#1c1c1e] border border-white/10 shadow-apple-modal space-y-4 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-apple-blue text-white font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-apple-sm">
                      {displayInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-white">{displayName}</h3>
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-apple-amber/20 text-apple-amber border border-apple-amber/30">
                          {sub?.status || 'Pending'}
                        </span>
                        <span className="text-[11px] text-apple-secondary">
                          Submitted {displayDate}
                        </span>
                      </div>
                      {displayTagline && (
                        <p className="text-xs text-apple-secondary mt-1">{displayTagline}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Profile, Reject, Approve */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                    <button
                      onClick={() => setPreviewSub(sub)}
                      className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 transition-all apple-press"
                      title="Review complete submission profile"
                    >
                      <Eye className="w-3.5 h-3.5 text-apple-blue" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => handleReject(sub.id)}
                      disabled={actionLoading === sub.id}
                      className="px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all apple-press"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={actionLoading === sub.id}
                      className="px-5 py-2 rounded-full bg-apple-emerald hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-apple-sm apple-press"
                    >
                      {actionLoading === sub.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>

                {/* Data fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/5 rounded-2xl text-xs text-slate-300 border border-white/5">
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Location</span>
                    <span className="font-semibold text-white">
                      {displayCity}{displayCity && displayDistrict ? ', ' : ''}{displayDistrict || 'Tamil Nadu'}
                    </span>
                  </div>
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Sectors</span>
                    <span className="font-semibold text-apple-blue">
                      {displaySectors.length > 0 ? displaySectors.join(', ') : 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Founder</span>
                    <span className="font-semibold text-white">{displayFounder}</span>
                  </div>
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Website</span>
                    {sub?.website || rawData.website ? (
                      <a href={sub.website || rawData.website} target="_blank" rel="noopener noreferrer" className="text-apple-blue hover:underline flex items-center gap-1">
                        <span className="truncate max-w-[120px]">{sub.website || rawData.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-apple-secondary">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Full Submission Review / View Profile Modal */}
      {previewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#1c1c1e] text-white rounded-3xl border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-apple-blue text-white font-display font-bold text-xl flex items-center justify-center shadow-apple-sm">
                  {(previewSub.name || previewSub.data?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display text-white">
                    {previewSub.name || previewSub.data?.name}
                  </h2>
                  <p className="text-xs text-apple-secondary">
                    {previewSub.tagline || previewSub.data?.tagline}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewSub(null)}
                className="p-1 text-apple-secondary hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Details */}
            <div className="space-y-4 text-xs">
              
              {/* Description */}
              {(previewSub.description || previewSub.data?.description) && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary">
                    Company Description / Story
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {previewSub.description || previewSub.data?.description}
                  </p>
                </div>
              )}

              {/* Location & Map Pin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-1">
                    District & Locality
                  </span>
                  <div className="flex items-center gap-1.5 text-white font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-apple-blue" />
                    <span>{previewSub.city || previewSub.data?.city}, {previewSub.district || previewSub.data?.district}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-1">
                    Website & Press
                  </span>
                  {(previewSub.website || previewSub.data?.website) ? (
                    <a
                      href={previewSub.website || previewSub.data?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-apple-blue hover:underline font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="truncate">{previewSub.website || previewSub.data?.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-apple-secondary">No website link</span>
                  )}
                </div>
              </div>

              {/* Founder Information */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block">
                  Founder Contact Record
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Name:</span>
                    <span className="font-semibold text-white">{previewSub.founderName || previewSub.data?.founderName}</span>
                  </div>
                  <div>
                    <span className="text-apple-secondary block text-[11px]">Email:</span>
                    <span className="font-semibold text-white truncate block">{previewSub.founderEmail || previewSub.data?.founderEmail}</span>
                  </div>
                  <div>
                    <span className="text-apple-secondary block text-[11px]">LinkedIn:</span>
                    {(previewSub.founderLinkedin || previewSub.data?.founderLinkedin) ? (
                      <a
                        href={previewSub.founderLinkedin || previewSub.data?.founderLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-apple-blue hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-apple-secondary">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Startup Metrics & Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-0.5">Stage</span>
                  <span className="font-semibold text-white">{previewSub.stage || previewSub.data?.stage || 'Seed'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-0.5">Funding</span>
                  <span className="font-semibold text-white">{previewSub.fundingType || previewSub.data?.fundingType || 'Bootstrapped'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-0.5">Founded</span>
                  <span className="font-semibold text-white">{previewSub.foundedYear || previewSub.data?.foundedYear || 2024}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-0.5">Team Size</span>
                  <span className="font-semibold text-white">{previewSub.teamSize || previewSub.data?.teamSize || '1-10'}</span>
                </div>
              </div>

              {/* Sectors */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-apple-secondary block mb-2">
                  Tagged Sectors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {((previewSub.sectors || previewSub.data?.sectors) || ['General']).map((sec: string) => (
                    <span key={sec} className="px-3 py-1 rounded-full bg-apple-blue/15 text-apple-blue border border-apple-blue/30 font-semibold text-xs">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Review Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setPreviewSub(null)}
                className="px-4 py-2.5 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold transition-all apple-press"
              >
                Close Preview
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReject(previewSub.id)}
                  disabled={actionLoading === previewSub.id}
                  className="px-4 py-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all apple-press"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Submission</span>
                </button>

                <button
                  onClick={() => handleApprove(previewSub.id)}
                  disabled={actionLoading === previewSub.id}
                  className="px-6 py-2.5 rounded-full bg-apple-emerald hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-apple-sm apple-press"
                >
                  {actionLoading === previewSub.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Approve & Publish Live</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Approval Result / Founder Account Credentials Dialog */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#1c1c1e] text-white rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 shadow-apple-modal">
            
            <button
              onClick={() => setCredentialsModal(null)}
              className="absolute top-5 right-5 text-apple-secondary hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-apple-emerald/20 border border-apple-emerald/30 text-apple-emerald flex items-center justify-center shadow-apple-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Startup Verified & Published!
              </h2>
              <p className="text-xs text-apple-secondary mt-1">
                <strong>{credentialsModal.startupName}</strong> is now live on the Tamil Nadu map and directory.
              </p>
            </div>

            {credentialsModal.isNewUser ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-apple-blue">
                  <Key className="w-4 h-4" />
                  <span>New Founder Account Provisioned</span>
                </div>
                
                <div className="text-xs space-y-1">
                  <span className="text-apple-secondary block text-[11px]">Login Email:</span>
                  <span className="font-mono text-white select-all">{credentialsModal.founderEmail}</span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-apple-secondary block text-[11px]">Temporary Password:</span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <span className="font-mono font-bold text-apple-amber select-all">
                      {credentialsModal.tempPassword}
                    </span>
                    <button
                      onClick={copyPassword}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-[10px]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-apple-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Existing Founder Account Linked</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  An existing account exists for <strong className="text-white">{credentialsModal.founderEmail}</strong>. This startup was automatically linked to their multi-startup dashboard.
                </p>
                <p className="text-[11px] text-emerald-300">
                  No temporary password was generated. The founder can log in using their existing password.
                </p>
              </div>
            )}

            <button
              onClick={() => setCredentialsModal(null)}
              className="w-full py-3 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white font-bold text-xs shadow-apple-sm transition-all apple-press"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
