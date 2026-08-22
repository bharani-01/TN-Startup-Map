import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X, Star, CheckCircle2, Sparkles, Send } from 'lucide-react';

const CATEGORIES = [
  { id: 'GENERAL', label: 'General Experience' },
  { id: 'DATA_ACCURACY', label: 'Data Accuracy / Fix' },
  { id: 'FEATURE_REQUEST', label: 'Feature Idea' },
  { id: 'USER_EXPERIENCE', label: 'Design & Speed' },
  { id: 'HIRING_PORTAL', label: 'Job Portal' },
];

const RATINGS = [
  { value: 5, label: 'Exceptional', emoji: '🌟' },
  { value: 4, label: 'Great', emoji: '👍' },
  { value: 3, label: 'Good', emoji: '👌' },
  { value: 2, label: 'Needs Work', emoji: '⚠️' },
  { value: 1, label: 'Poor', emoji: '👎' },
];

export const RevisitFeedbackPrompt: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [category, setCategory] = useState('GENERAL');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 1. Check if already submitted or currently snoozed
    const alreadySubmitted = localStorage.getItem('tn_feedback_submitted');
    if (alreadySubmitted) return;

    const snoozedUntil = localStorage.getItem('tn_feedback_snoozed_until');
    if (snoozedUntil && Date.now() < parseInt(snoozedUntil, 10)) return;

    // 2. Track visit count and time gap
    const visitCountStr = localStorage.getItem('tn_visit_count') || '0';
    const firstVisitStr = localStorage.getItem('tn_first_visit_time');
    const now = Date.now();

    let visitCount = parseInt(visitCountStr, 10);
    if (!sessionStorage.getItem('tn_session_active')) {
      sessionStorage.setItem('tn_session_active', 'true');
      visitCount += 1;
      localStorage.setItem('tn_visit_count', visitCount.toString());
      if (!firstVisitStr) {
        localStorage.setItem('tn_first_visit_time', now.toString());
      }
    }

    const firstVisitTime = firstVisitStr ? parseInt(firstVisitStr, 10) : now;
    const hoursSinceFirstVisit = (now - firstVisitTime) / (1000 * 60 * 60);

    // Trigger condition: visit_count >= 2 AND at least 6 hours since 1st visit
    if (visitCount >= 2 && hoursSinceFirstVisit >= 6) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to manual open event from footer or menu
  useEffect(() => {
    const handleManualOpen = () => {
      setSubmitted(false);
      setIsOpen(true);
    };
    window.addEventListener('open-feedback-prompt', handleManualOpen);
    return () => window.removeEventListener('open-feedback-prompt', handleManualOpen);
  }, []);

  const handleSnooze = () => {
    // Snooze for 7 days
    const snoozeTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('tn_feedback_snoozed_until', snoozeTime.toString());
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch('/api/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating,
          category,
          message: message.trim() || undefined,
          userEmail: userEmail.trim() || undefined,
          pageUrl: window.location.href,
        }),
      });

      localStorage.setItem('tn_feedback_submitted', 'true');
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="User Feedback"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] text-[#1D1D1F] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-[#1D1D1F] tracking-tight">
                Share Your Feedback
              </h3>
              <p className="text-[10px] text-[#86868B] font-medium">
                Help us improve Tamil Nadu Startup Connect
              </p>
            </div>
          </div>

          <button
            onClick={handleSnooze}
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer"
            aria-label="Close feedback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#1D1D1F]">Thank You!</h4>
            <p className="text-xs text-[#86868B]">
              Your suggestions help shape the innovation ecosystem for Tamil Nadu.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* 1-5 Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#515154] block">
                How would you rate your experience? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRating(r.value)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-semibold border transition-all cursor-pointer ${
                      rating === r.value
                        ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-apple-sm scale-105'
                        : 'bg-black/[0.02] border-black/[0.06] text-[#1D1D1F] hover:bg-black/[0.05]'
                    }`}
                  >
                    <span className="text-sm">{r.emoji}</span>
                    <span>{r.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#515154] block">
                What is this feedback about?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                      category === c.id
                        ? 'bg-[#1D1D1F] text-white'
                        : 'bg-black/[0.04] text-[#515154] hover:bg-black/[0.08]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input / Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#515154] flex items-center justify-between">
                <span>Tell us your thoughts / suggestions</span>
                <span className="text-[9px] text-[#86868B] font-mono">{message.length}/500</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="What did you like? Missing startups, feature requests, or UI improvements..."
                rows={3}
                className="w-full px-3 py-2 rounded-2xl bg-black/[0.02] border border-black/[0.08] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all resize-none"
              />
            </div>

            {/* Optional Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-[#86868B] block">
                Your email (optional, if you'd like admin follow-up)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-1.5 rounded-xl bg-black/[0.02] border border-black/[0.08] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSnooze}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all cursor-pointer"
              >
                Maybe Later
              </button>

              <button
                type="submit"
                disabled={!rating || isSubmitting}
                className="px-4 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white text-xs font-semibold shadow-apple-sm transition-all apple-press flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </aside>
  );
};
