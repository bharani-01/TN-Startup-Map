import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, CheckCircle2, AlertTriangle, Scale, Lock, Globe, Building2, HelpCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold border border-[#0071E3]/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Framework & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Terms of Service & Ecosystem Rules
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B]">
            Last updated: August 23, 2026 • Governs all interactions on Tamil Nadu Startup Connect
          </p>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] w-fit">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">Open Directory</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Public information discovery for Tamil Nadu startups, talent, and regional innovation hubs.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 w-fit">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">Founder Verification</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Official corporate email matching and admin verification before claiming company controls.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 w-fit">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">No Investment Advisory</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Information is for research and networking. We do not provide financial or legal investment advice.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-6 sm:p-10 shadow-apple-card space-y-8 text-sm text-[#1D1D1F] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-xs text-[#424245]">
              By accessing, browsing, or utilizing <strong>Tamil Nadu Startup Connect</strong> (the "Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must discontinue platform usage immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Platform Scope & Ecosystem Directory</span>
            </h2>
            <p className="text-xs text-[#424245]">
              Tamil Nadu Startup Connect is an open discovery network designed to index, connect, and elevate technological ventures, incubators, talent, and founders across all 38 districts of Tamil Nadu.
            </p>
            <ul className="list-disc list-inside text-xs text-[#424245] space-y-1.5 pl-2">
              <li><strong>Directory Profiles:</strong> Company profiles are aggregated from verified public submissions, verified founder updates, and ecosystem feeds.</li>
              <li><strong>Career Opportunities:</strong> Job postings are managed directly by verified company representatives or curated by administrators.</li>
              <li><strong>Informational Purpose:</strong> All data is provided for ecosystem visibility, networking, and talent acquisition.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Founder Profiles & Claim Protocols</span>
            </h2>
            <p className="text-xs text-[#424245]">
              Founders and authorized executives who claim a company profile warrant that:
            </p>
            <ul className="list-disc list-inside text-xs text-[#424245] space-y-1.5 pl-2">
              <li>They hold legal authority or executive standing to represent the designated corporate entity.</li>
              <li>All metrics provided (funding rounds, revenue bracket, DPIIT registrations, team size) are truthful and verifiable.</li>
              <li>They will not upload misleading, fraudulent, or defamatory statements.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Job Postings & Hiring Code of Conduct</span>
            </h2>
            <p className="text-xs text-[#424245]">
              Employers posting job listings via the Founder Studio must ensure:
            </p>
            <ul className="list-disc list-inside text-xs text-[#424245] space-y-1.5 pl-2">
              <li>Openings reflect genuine employment, contract, or internship opportunities with legal compensation adhering to Indian labor statutes.</li>
              <li>No recruitment fees, deposits, or discriminatory prerequisites are imposed on candidates.</li>
              <li>Administrators retain the absolute right to moderate, hide, or delete any listing deemed suspicious or in violation of ecosystem standards.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">5</span>
              <span>Intellectual Property & Trademarks</span>
            </h2>
            <p className="text-xs text-[#424245]">
              All corporate logos, trade names, and trademarks displayed on company profiles remain the sole property of their respective entities. Platform interface designs, software logic, and aggregated visualizations belong exclusively to Tamil Nadu Startup Connect.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white text-xs flex items-center justify-center font-bold">6</span>
              <span>Limitation of Liability & Jurisdiction</span>
            </h2>
            <p className="text-xs text-[#424245]">
              The platform and its administrators shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from platform interactions, investment decisions, or hiring engagements. These terms shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
            </p>
          </section>

          {/* Section 7 */}
          <section className="p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] space-y-2">
            <h3 className="font-bold text-xs text-[#1D1D1F]">Contact & Legal Inquiries</h3>
            <p className="text-xs text-[#86868B]">
              For profile dispute resolutions, trademark inquiries, or governance questions, contact us at{' '}
              <a href="mailto:support@tnstartupconnect.org" className="text-[#0071E3] font-semibold underline">
                support@tnstartupconnect.org
              </a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
