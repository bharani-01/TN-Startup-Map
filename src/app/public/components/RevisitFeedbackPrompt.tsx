import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Check, Send } from 'lucide-react';

const CATEGORIES = [
  { id: 'GENERAL', label: 'General Platform Experience' },
  { id: 'DATA_ACCURACY', label: 'Startup Data Correction' },
  { id: 'FEATURE_REQUEST', label: 'Feature Request / Idea' },
  { id: 'USER_EXPERIENCE', label: 'Design & Usability' },
  { id: 'HIRING_PORTAL', label: 'Talent & Job Portal' },
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
      }, 3000);
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
      const token = localStorage.getItem('tn_token') || localStorage.getItem('token');
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
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="User Feedback Dialog"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0071E3] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                Platform Feedback
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Tamil Nadu Startup Connect
              </p>
            </div>
          </div>

          <button
            onClick={handleSnooze}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Feedback Received</h4>
            <p className="text-xs text-slate-500">
              Thank you for helping us improve Tamil Nadu Startup Connect.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* 1-5 Numeric Rating Scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Rating</span>
                <span className="text-slate-400 font-normal">1 (Poor) to 5 (Excellent)</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`py-2 rounded-lg font-mono font-bold text-xs border transition-colors cursor-pointer ${
                      rating === val
                        ? 'bg-[#0071E3] text-white border-[#0071E3]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0071E3] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Input / Comments */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Your Comments</span>
                <span className="text-[10px] text-slate-400 font-mono">{message.length}/500</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Share your suggestions, missing startup details, or feature requests..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
              />
            </div>

            {/* Optional Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 block">
                Email (optional)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="founder@example.com"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0071E3] transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSnooze}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Maybe Later
              </button>

              <button
                type="submit"
                disabled={!rating || isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </aside>
  );
};
