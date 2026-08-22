import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Copy,
  Check,
  Key,
  Search,
  Clock,
  Filter
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminClaims: React.FC = () => {
  const { token } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING_REVIEW');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [credentialsModal, setCredentialsModal] = useState<{
    startupName: string;
    founderEmail: string;
    tempPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/claims', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setClaims(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [token]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/claims/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes: 'Identity proof verified' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Claim approved and founder ownership assigned!' });
        
        if (data.data?.founderAccount) {
          setCredentialsModal({
            startupName: data.data.founderAccount.name || 'Startup',
            founderEmail: data.data.founderAccount.email,
            tempPassword: data.data.founderAccount.tempPassword,
          });
        }
        
        fetchClaims();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to approve claim' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide reason for claim rejection:');
    if (!reason) return;

    setActionLoading(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/claims/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Claim rejected.' });
        fetchClaims();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reject claim' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setActionLoading(null);
    }
  };

  const copyPassword = () => {
    if (credentialsModal) {
      navigator.clipboard.writeText(credentialsModal.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pendingCount = claims.filter((c) => c.status === 'PENDING_REVIEW').length;
  const approvedCount = claims.filter((c) => c.status === 'APPROVED').length;
  const rejectedCount = claims.filter((c) => c.status === 'REJECTED').length;
  const allCount = claims.length;

  const filteredClaims = claims.filter((claim) => {
    // 1. Status filter (defaults to PENDING_REVIEW - non approved)
    if (statusFilter !== 'ALL') {
      if (claim.status !== statusFilter) return false;
    }

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const claimantName = (claim.claimantName || '').toLowerCase();
      const claimantEmail = (claim.claimantEmail || '').toLowerCase();
      const startupName = (claim.startupName || '').toLowerCase();
      const proofDetails = (claim.proofDetails || '').toLowerCase();

      return (
        claimantName.includes(q) ||
        claimantEmail.includes(q) ||
        startupName.includes(q) ||
        proofDetails.includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Founder Profile Claims
          </h1>
          <p className="text-xs sm:text-sm text-apple-secondary mt-1">
            Review ownership verification proofs from founders requesting management access to existing platform listings.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claimant, startup, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:bg-white/10 focus:border-[#0071E3] transition-colors outline-none"
          />
        </div>
      </div>

      {/* Filter Status Tabs - Default to Pending Review (Not Approved) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('PENDING_REVIEW')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'PENDING_REVIEW'
              ? 'bg-amber-400 text-black font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review ({pendingCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved ({approvedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected ({rejectedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#0071E3] text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>All Claims ({allCount})</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
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
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading claims queue...</p>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="p-12 text-center bg-[#1c1c1e] rounded-2xl border border-white/10 space-y-3 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {statusFilter === 'PENDING_REVIEW'
              ? 'No Claims Pending Review'
              : `No ${statusFilter.toLowerCase()} claims`}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {statusFilter === 'PENDING_REVIEW'
              ? 'All submitted founder claims have been verified and processed!'
              : `No claims match the current filter (${statusFilter}).`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-sm space-y-4 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0071E3]/20 text-[#0071E3] font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-[#0071E3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white">
                        Claim for {claim.startupName || claim.startup?.name || 'Startup Listing'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                        claim.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : claim.status === 'REJECTED'
                          ? 'bg-rose-900/30 text-rose-300 border-rose-700/30'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      }`}>
                        {claim.status === 'APPROVED' ? 'APPROVED & ASSIGNED' : (claim.status === 'REJECTED' ? 'REJECTED' : 'PENDING REVIEW')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Submitted {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Claimant: <span className="text-white font-semibold">{claim.claimantName}</span> ({claim.claimantRole})
                    </p>
                  </div>
                </div>

                {claim.status === 'PENDING_REVIEW' && (
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleReject(claim.id)}
                      disabled={actionLoading === claim.id}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(claim.id)}
                      disabled={actionLoading === claim.id}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      {actionLoading === claim.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Approve Ownership</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Claim Proof Detail */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs space-y-2">
                <span className="text-[11px] font-semibold text-apple-secondary block uppercase tracking-wider">
                  Submitted Proof of Association:
                </span>
                <p className="text-white leading-relaxed whitespace-pre-wrap">{claim.proofDetails}</p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-slate-400 text-[11px]">
                  <span>Email: <strong className="text-apple-blue">{claim.claimantEmail}</strong></span>
                  {claim.claimantLinkedin && (
                    <a href={claim.claimantLinkedin} target="_blank" rel="noopener noreferrer" className="text-apple-blue hover:underline flex items-center gap-1">
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Founder Credentials Dialog */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#1c1c1e] text-white rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-apple-modal">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-apple-emerald/20 text-apple-emerald flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Founder Permissions Granted</h3>
                <p className="text-xs text-apple-secondary">Ownership access credentials ready</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div>
                <span className="text-apple-secondary">Startup:</span>
                <span className="font-bold text-white ml-2">{credentialsModal.startupName}</span>
              </div>
              <div>
                <span className="text-apple-secondary">Login Email:</span>
                <span className="font-bold text-apple-blue ml-2">{credentialsModal.founderEmail}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-apple-secondary">Temporary Password:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-black/60 px-2 py-0.5 rounded font-mono text-apple-emerald">
                    {credentialsModal.tempPassword}
                  </code>
                  <button
                    onClick={copyPassword}
                    className="p-1 text-apple-secondary hover:text-white rounded"
                  >
                    {copied ? <Check className="w-4 h-4 text-apple-emerald" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCredentialsModal(null)}
              className="w-full py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
