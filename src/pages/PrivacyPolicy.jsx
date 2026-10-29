import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem', background: '#050505' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#FFD400',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            marginBottom: '2rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Studio
        </button>

        <div className="glass-card" style={{ padding: '3rem', background: '#111111', border: '1px solid #292929' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={28} color="#FFD400" />
            <span className="badge-mono">LEGAL GOVERNANCE</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '1rem' }}>
            Privacy & Confidentiality Policy
          </h1>

          <p style={{ color: '#BDBDBD', fontSize: '0.92rem', marginBottom: '2.5rem', fontFamily: 'var(--font-mono)' }}>
            Effective Date: October 2026 // ONLY FREELANCER STUDIO
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#BDBDBD', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                1. Sovereign Client Confidentiality
              </h2>
              <p>
                ONLY FREELANCER operates as an independent creative and technical engineering studio. We treat all client communications, source materials, pre-release video assets, brand strategies, and proprietary codebases with strict non-disclosure obligations. Your project data is never sold, shared with third-party advertisers, or used to train public machine learning systems without explicit authorization.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                2. Information Collection & Use
              </h2>
              <p>
                We collect personal and business information that you voluntarily submit through our project inquiry forms, client dashboard, and direct communications. This includes your name, email address, corporate entity, project brief, budget parameters, and uploaded production files. This data is exclusively utilized to scope, execute, and deliver commissions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                3. Secure Asset Storage & Deliverables
              </h2>
              <p>
                Master files, raw camera footage, design vectors, and plugin source code uploaded to our infrastructure are stored behind strict role-based access controls. Files are only accessible to assigned production staff and the authorized client account.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                4. Billing & Discord Communications
              </h2>
              <p>
                We do not store credit card numbers on our servers. Invoicing records and verified receipts are generated internally by studio management. Direct payment coordination occurs via our verified Discord server or private wire instructions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
