import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Compass,
  PenTool,
  Terminal,
  CheckCircle,
  PackageCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Exact 6 stages from Section 8, Section 5
  const steps = [
    {
      num: '01',
      title: 'Discover',
      icon: Search,
      subtitle: 'Intent Extraction & Audit',
      description:
        'We deconstruct your brand positioning, technical requirements, audience expectations, and commercial targets before touching a timeline or code.',
      deliverable: 'Discovery Memorandum & Strategic Roadmap',
    },
    {
      num: '02',
      title: 'Strategize',
      icon: Compass,
      subtitle: 'Architecture & Creative Direction',
      description:
        'Establishing structural blueprints, user journey matrices, visual pacing treatments, and technical deliverable specifications inside your project portal.',
      deliverable: 'Architecture Blueprint & Milestone Schedule',
    },
    {
      num: '03',
      title: 'Design',
      icon: PenTool,
      subtitle: 'Kinetic Systems & High-Contrast Art',
      description:
        'Crafting bespoke editorial design systems, motion graphics storyboards, dark-first UI components, and tactile interactive prototypes.',
      deliverable: 'Figma Tokens, Visual System & Master Mockups',
    },
    {
      num: '04',
      title: 'Build',
      icon: Terminal,
      subtitle: 'Full-Scale Engineering & Production',
      description:
        'High-velocity implementation: cinema-grade color timing, custom Java network plugins, responsive React frontends, and hardened Express endpoints.',
      deliverable: 'Functional Staging Build & Master Drafts',
    },
    {
      num: '05',
      title: 'Refine',
      icon: CheckCircle,
      subtitle: 'Frame-Accurate QA & Review Cycles',
      description:
        'Rigorous internal validation, accessibility audits, cross-device testing, and collaborative client feedback refinement.',
      deliverable: 'Refinement Log & Final Polish Sign-off',
    },
    {
      num: '06',
      title: 'Deliver',
      icon: PackageCheck,
      subtitle: 'Master Release & Handoff',
      description:
        'Secure transfer of high-bitrate master files, production source code repositories, deployment credentials, and client documentation.',
      deliverable: 'Master Production Archive & Official Verified Receipt',
    },
  ];

  return (
    <section id="workflow" style={{ padding: '8rem 0', background: '#070707', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge-mono">
              <Sparkles size={12} color="#FFD400" />
              SECTION 05 // CREATIVE PROCESS
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.08,
              marginBottom: '1.2rem',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
            }}
          >
            Predictable Process. <br />
            <span style={{ color: '#FFD400' }}>Uncompromising Results.</span>
          </h2>

          <p style={{ color: '#BDBDBD', fontSize: '1.1rem', lineHeight: 1.65 }}>
            Six deliberate stages ensuring transparent communication, rigorous technical standards, and zero surprises from initial spark to final release.
          </p>
        </div>

        {/* Visual Timeline Progression */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onMouseEnter={() => setActiveStep(idx)}
                style={{
                  padding: '2.25rem',
                  borderRadius: '16px',
                  background: isHovered ? '#121212' : '#0d0d0d',
                  border: isHovered ? '1px solid #FFD400' : '1px solid #222222',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '300px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-3px)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div>
                  {/* Step Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: isHovered ? '#FFD400' : '#444444',
                        transition: 'color 0.2s',
                      }}
                    >
                      {step.num}
                    </span>

                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isHovered ? 'rgba(255, 212, 0, 0.15)' : '#161616',
                        border: isHovered ? '1px solid #FFD400' : '1px solid #292929',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={20} color={isHovered ? '#FFD400' : '#FFFFFF'} />
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {step.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: '#FFD400',
                      marginBottom: '0.9rem',
                    }}
                  >
                    {step.subtitle}
                  </div>

                  <p style={{ color: '#BDBDBD', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {step.description}
                  </p>
                </div>

                {/* Milestone Deliverable */}
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #1f1f1f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#777777', textTransform: 'uppercase' }}>
                    Target:
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#E0E0E0' }}>
                    {step.deliverable}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
