import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Startup } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface ClaimModalProps {
  startup: Startup;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ startup, isOpen, onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState('Founder / Co-Founder');
  const [linkedin, setLinkedin] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: startup.id,
          startupSlug: startup.slug,
          claimantName: name,
          claimantEmail: email,
          claimantRole: role,
          claimantLinkedin: linkedin,
          proofDetails,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit claim request');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/[0.1] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.04] transition-all apple-press"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-[#34C759]/10 text-[#34C759] rounded-full flex items-center justify-center mx-auto shadow-apple-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] font-display">
              Claim Request Submitted
            </h3>
            <p className="text-xs text-[#86868B] max-w-sm mx-auto leading-relaxed">
              Your claim for <strong>{startup.name}</strong> has been logged in our verification queue. An administrator will review your association details and grant portal permissions within 24-48 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold rounded-full shadow-apple-sm apple-press"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] font-display">
                  Claim {startup.name}
                </h3>
                <p className="text-xs text-[#86868B]">
                  Verify founder association to manage company profile, funding, and jobs.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Srinath Ravichandran"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Founder, Co-Founder, CEO"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">Verification Note / Association Proof</label>
                <textarea
                  rows={3}
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                  placeholder="Official company email domain, LinkedIn verification, or incorporation document reference..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/[0.03] transition-all apple-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold shadow-apple-sm transition-all apple-press flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit Claim</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
