import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Server, Cookie, UserCheck, Mail, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection (DPDPA 2023) Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1D1D1F] tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B]">
            Effective Date: August 23, 2026 • Tamil Nadu Startup Connect
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] w-fit">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D1D1F]">Zero Ad Trackers</h3>
            <p className="text-[11px] text-[#86868B] leading-relaxed">
              We never use Google Ads, Meta Pixel, or third-party behavioral ad trackers.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 w-fit">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D1D1F]">Self-Hosted Telemetry</h3>
            <p className="text-[11px] text-[#86868B] leading-relaxed">
              All analytics are strictly processed natively on our own secure PostgreSQL database.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 w-fit">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D1D1F]">Encrypted Storage</h3>
            <p className="text-[11px] text-[#86868B] leading-relaxed">
              Passwords and authentication tokens are hashed using industry-standard bcrypt and JWT algorithms.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-black/[0.08] shadow-apple-card space-y-2">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 w-fit">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D1D1F]">User Data Rights</h3>
            <p className="text-[11px] text-[#86868B] leading-relaxed">
              You can request export, correction, or deletion of your profile data at any time.
            </p>
          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-6 sm:p-10 shadow-apple-card space-y-8 text-sm text-[#1D1D1F] leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-2 text-xs text-[#424245]">
              <p>We collect information only to provide and improve the ecosystem directory:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Account Data:</strong> Name, professional email address, hashed password, and role (`FOUNDER`, `USER`, `ADMIN`).</li>
                <li><strong>Corporate & Profile Information:</strong> Company name, description, website, team size, funding stages, milestones, and hiring listings provided by founders.</li>
                <li><strong>Native Telemetry & Engagement:</strong> Anonymized event records (such as startup profile views, outward website link clicks, and job apply button clicks). This telemetry is utilized internally by administrators to gauge regional innovation activity.</li>
                <li><strong>Technical API Logs:</strong> Request routes, status codes, execution duration, sanitized user-agent, and IP address recorded non-blockingly for security audits and threat mitigation.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <div className="space-y-2 text-xs text-[#424245]">
              <p>We utilize the collected information strictly for legitimate operational purposes:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>To index and display verified startup profiles to researchers, job seekers, and ecosystem partners.</li>
                <li>To verify founder credentials and grant dashboard management privileges.</li>
                <li>To generate aggregate statistics regarding regional hub growth (e.g. SaaS clusters in Chennai, EV in Hosur).</li>
                <li>To maintain platform security, prevent unauthorized brute-force attacks, and preserve data integrity.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Cookies & Local Storage Policy</span>
            </h2>
            <p className="text-xs text-[#424245]">
              We utilize minimal cookies and browser local storage:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
                <span className="font-bold text-xs text-[#1D1D1F] block">Essential Auth Tokens</span>
                <p className="text-[11px] text-[#86868B]">Stores encrypted JWT tokens locally to preserve your logged-in session securely.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
                <span className="font-bold text-xs text-[#1D1D1F] block">Consent Preferences</span>
                <p className="text-[11px] text-[#86868B]">Stores your cookie preference choice (`tn_cookie_consent`) so you are not prompted repeatedly.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Data Retention & Deletion</span>
            </h2>
            <p className="text-xs text-[#424245]">
              Account data is retained for the duration of active platform registration. API access logs are cycled periodically. Startup profiles that are archived by administrators or founders undergo non-destructive soft-deletion, preserving audit histories while immediately removing public visibility.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-[#1D1D1F] flex items-center gap-2.5 border-b border-black/[0.06] pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">5</span>
              <span>Your Rights under DPDPA 2023</span>
            </h2>
            <p className="text-xs text-[#424245]">
              Under India's Digital Personal Data Protection Act, 2023, you have the right to:
            </p>
            <ul className="list-disc list-inside text-xs text-[#424245] space-y-1 pl-2">
              <li>Access a summary of your personal data processed by the platform.</li>
              <li>Request correction, updating, or erasure of outdated or inaccurate personal information.</li>
              <li>Withdraw previously granted consent at any time without penalty.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1F]">
              <Mail className="w-4 h-4 text-[#0071E3]" />
              <span>Grievance Officer & Contact Information</span>
            </div>
            <p className="text-xs text-[#86868B]">
              For any data privacy concerns or to exercise your statutory rights, please contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@tnstartupconnect.org" className="text-[#0071E3] font-semibold underline">
                privacy@tnstartupconnect.org
              </a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
