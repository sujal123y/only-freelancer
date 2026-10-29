import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu, Flame, Target } from 'lucide-react';

export default function AboutSection() {
  const tenets = [
    {
      icon: Cpu,
      title: 'Precision Craft Over Scale',
      description:
        'Whether tuning Spigot Java tick engines at 20 TPS or color grading cinema RAW footage in Davinci Resolve, we treat digital production as high-precision engineering.',
    },
    {
      icon: Flame,
      title: 'Direct Senior Direction',
      description:
        'You work directly with principal creators, designers, and engineers. No junior handoffs, no bloated account managers, no diluted creative intent.',
    },
    {
      icon: Shield,
      title: 'Sovereign Confidentiality',
      description:
        'Every client commission is executed under strict non-disclosure. We respect intellectual property boundaries and keep unannounced ventures completely secure.',
    },
    {
      icon: Target,
      title: 'Multidisciplinary Synergy',
      description:
        'Cinematic video, distinctive typography, custom full-stack web platforms, and tailored game mechanics unified into one indelible brand identity.',
    },
  ];

  return (
    <section id="about" style={{ padding: '9rem 0', position: 'relative', background: '#050505' }}>
      <div className="container">
        {/* Section 4 Manifesto: Expressive Oversized Typography */}
        <div style={{ maxWidth: '1080px', marginBottom: '6rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge-mono">
              <Sparkles size={12} color="#FFD400" />
              SECTION 04 // STUDIO MANIFESTO
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '2.5rem',
                textTransform: 'uppercase',
              }}
            >
              A CREATIVE UNIVERSE <br />
              BUILT IN <span style={{ color: '#FFFFFF', textDecoration: 'underline', textDecorationColor: '#292929' }}>BLACK</span>,{' '}
              LIT BY <span style={{ color: '#FFD400' }}>YELLOW.</span>
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                color: '#BDBDBD',
                lineHeight: 1.6,
                maxWidth: '920px',
                marginBottom: '2rem',
              }}
            >
              We believe generic websites, repetitive templates, and soulless content are the death of ambition.
              ONLY FREELANCER exists for brands, creators, and platforms that demand work that commands immediate attention,
              holds respect, and performs under real-world scrutiny.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.9rem',
                padding: '0.85rem 1.4rem',
                borderRadius: '10px',
                background: '#111111',
                border: '1px solid #292929',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FFD400',
                  boxShadow: '0 0 10px #FFD400',
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#FFFFFF' }}>
                Commission Status: Active commissions open for Q4 2026 & 2027
              </span>
            </div>
          </motion.div>
        </div>

        {/* 4 Pillars of Craft */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {tenets.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{
                  padding: '2.25rem',
                  borderRadius: '16px',
                  background: '#0d0d0d',
                  border: '1px solid #222222',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'border-color 0.25s, transform 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD400';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222222';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(255, 212, 0, 0.12)',
                    border: '1px solid rgba(255, 212, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color="#FFD400" />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  {t.title}
                </h3>

                <p style={{ color: '#BDBDBD', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  {t.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
