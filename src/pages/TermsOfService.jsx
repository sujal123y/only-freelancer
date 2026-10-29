import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService({ onNavigate }) {
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
            <FileText size={28} color="#FFD400" />
            <span className="badge-mono">COMMISSION TERMS</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '1rem' }}>
            Studio Terms of Service & Engagement
          </h1>

          <p style={{ color: '#BDBDBD', fontSize: '0.92rem', marginBottom: '2.5rem', fontFamily: 'var(--font-mono)' }}>
            Effective Date: October 2026 // ONLY FREELANCER STUDIO
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#BDBDBD', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                1. Commission Scope & Formal Quotes
              </h2>
              <p>
                All production engagements—including Video Editing, Graphic Design, Web Development, Minecraft Plugin Architecture, Videography, Photography, and Digital Marketing—are executed based on mutually confirmed scope definitions, milestones, and deliverable specifications.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                2. Intellectual Property & Master Transfers
              </h2>
              <p>
                Upon complete invoice settlement, full commercial exploitation rights and unwatermarked master deliverables (including vector sources, final 4K video renders, and custom plugin code) are transferred to the client. Unused preliminary concepts remain the intellectual property of ONLY FREELANCER.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                3. Payment Coordination & Verified Receipts
              </h2>
              <p>
                Invoices issued by ONLY FREELANCER specify milestone amounts and due dates. Official payments are discussed and coordinated directly through our verified Discord channel or official bank wire transfers. Official receipts are issued only upon confirmed verification of fund receipt by studio leadership.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>
                4. Revisions & Quality Assurance
              </h2>
              <p>
                Every project includes agreed revision cycles during the Review milestone. Additional revisions outside initial scope specifications are quoted transparently based on standard studio rates.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
