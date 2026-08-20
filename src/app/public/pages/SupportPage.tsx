import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  Building2,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('tab') === 'claim' 
    ? 'Claim Startup Profile / Founder Access'
    : searchParams.get('tab') === 'correction'
    ? 'Venture Profile & Funding Data Update'
    : 'Claim Startup Profile / Founder Access';

  const initialStartup = searchParams.get('startup') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startupName: initialStartup,
    category: initialCategory,
    subject: initialStartup ? `Claim access for ${initialStartup}` : '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    // If it's a claim request, also notify the claims service
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24 text-[#1D1D1F]">
      
      {/* 1. Hero Header */}
      <section className="bg-white border-b border-black/[0.06] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-bold border border-[#0071E3]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tamil Nadu Startup Ecosystem Helpdesk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#1D1D1F]">
            Ecosystem Support & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0071E3] to-[#2563EB] bg-clip-text text-transparent">
              Founder Assistance
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#86868B] max-w-xl mx-auto leading-relaxed">
            Claim management access for your venture, request profile & funding corrections, or reach out to the Tamil Nadu startup facilitation team.
          </p>
        </div>
      </section>

      {/* 2. Main Support Request Form Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-10 space-y-6">
          
          <div className="border-b border-black/[0.06] pb-5">
            <h2 className="text-xl font-bold font-display text-[#1D1D1F] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0071E3]" />
              <span>Submit a Support or Claim Request</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#86868B] mt-1">
              Please fill out the form below. Our registry and moderation team reviews requests within 24 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center mx-auto shadow-apple-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F]">Request Dispatched Successfully</h3>
              <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto">
                Thank you for reaching out. A confirmation has been sent to <strong>{formData.email}</strong>. Our moderation desk will follow up shortly.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    startupName: '',
                    category: 'Claim Startup Profile / Founder Access',
                    subject: '',
                    message: '',
                  });
                }}
                className="px-6 py-2.5 rounded-full bg-[#0071E3] text-white font-semibold text-xs shadow-apple-sm hover:bg-[#0077ED] transition-all apple-press"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Request Type *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-[#0071E3] transition-all"
                >
                  <option value="Claim Startup Profile / Founder Access">Claim Startup Profile / Founder Access</option>
                  <option value="Venture Profile & Funding Data Update">Venture Profile & Funding Data Update</option>
                  <option value="District & Map Location Fix">District & Map Location Fix</option>
                  <option value="TANSEED Grants & Policy Inquiry">TANSEED Grants & Policy Inquiry</option>
                  <option value="Technical Support / Bug Report">Technical Support / Bug Report</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Srinath Ravichandran"
                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                    Your Work / Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.in"
                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
              </div>

              {/* Startup Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                    Startup / Venture Name <span className="text-[#86868B] font-normal">(if applicable)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.startupName}
                    onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                    placeholder="e.g. AgniKul Cosmos, Ather Energy"
                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                    Phone Number <span className="text-[#86868B] font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your request..."
                  className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Details & Supporting Information *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide details, corporate website links, LinkedIn verification URL, or specific corrections needed..."
                  className="w-full px-4 py-2.5 bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#0071E3] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold rounded-full text-xs sm:text-sm shadow-apple-sm transition-all apple-press flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* 3. Official Channels Cards */}
        <div className="mt-8 bg-white rounded-3xl border border-black/[0.08] shadow-apple-card p-6 sm:p-8">
          <h3 className="text-base font-bold font-display text-[#1D1D1F] mb-4">
            Official Facilitation Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1.5">
              <div className="flex items-center gap-2 text-[#0071E3] font-bold">
                <Mail className="w-4 h-4" />
                <span>Email Desk</span>
              </div>
              <p className="text-[#1D1D1F] font-semibold">support@tnstartupmap.in</p>
              <p className="text-[11px] text-[#86868B]">Official verified queries</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1.5">
              <div className="flex items-center gap-2 text-[#34C759] font-bold">
                <Clock className="w-4 h-4" />
                <span>Response SLA</span>
              </div>
              <p className="text-[#1D1D1F] font-semibold">&lt; 24 Business Hours</p>
              <p className="text-[11px] text-[#86868B]">Mon - Fri, 9:30 AM - 6:00 PM IST</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1.5">
              <div className="flex items-center gap-2 text-purple-600 font-bold">
                <MapPin className="w-4 h-4" />
                <span>Nodal Center</span>
              </div>
              <p className="text-[#1D1D1F] font-semibold">StartupTN Innovation Hub</p>
              <p className="text-[11px] text-[#86868B]">IIT Madras Research Park, Chennai</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
