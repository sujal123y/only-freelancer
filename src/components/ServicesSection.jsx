import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Palette,
  TrendingUp,
  Code,
  Gamepad2,
  Video,
  Camera,
  ArrowUpRight,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const iconMap = {
  Film: Film,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Code: Code,
  Gamepad2: Gamepad2,
  Video: Video,
  Camera: Camera,
};

// Rich discipline-specific creative process & domain knowledge
const serviceWorkflows = {
  'video-editing': {
    focus: 'Dynamic Audiovisual Rhythm & Color Grading',
    steps: ['Footage Ingest & Assembly', 'Sound Design & Foley Architecture', 'Davinci Color Calibration', 'Motion Graphics & 9:16 Re-edits'],
    tools: ['Davinci Resolve Studio', 'Premiere Pro', 'After Effects', 'FabFilter Audio Suite'],
  },
  'graphic-design': {
    focus: 'Modular Visual Systems & Typographic Hierarchy',
    steps: ['Brand Blueprint & Archetype Research', 'Typographic & Vector Exploration', 'Design Token Specifications', 'Multi-Platform Asset Kit Master'],
    tools: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Glyphs'],
  },
  'digital-marketing': {
    focus: 'Audience Acquisition Architecture & Organic Conversion',
    steps: ['Funnel Audit & Audience Modeling', 'Content Hook Ideation & Scripting', 'A/B Creative Asset Testing', 'Discord & Social Retention Loops'],
    tools: ['Meta Business Suite', 'TikTok Analytics', 'Google Analytics 4', 'Discord API'],
  },
  'web-development': {
    focus: 'Awwwards-Grade Interactive Engineering & High-Scale APIs',
    steps: ['UX Architecture & Wireframes', 'Interactive React/Vite Prototyping', 'Secure Node/Express & Database Integration', 'Performance 99+ Optimization'],
    tools: ['React 19', 'Three.js / WebGL', 'Vite', 'Node.js', 'SQLite/PostgreSQL'],
  },
  'minecraft-development': {
    focus: 'Low-Latency Spigot/Paper Engines & Custom Packet Mechanics',
    steps: ['Packet Protocol & Tick Optimization', 'Custom Java Plugin Architecture', 'MySQL / SQLite Persistence Layer', 'Live Stress Testing (150+ Players)'],
    tools: ['Java 21', 'Paper/Spigot API', 'Gradle', 'ProtocolLib', 'Spark Profiler'],
  },
  'videography': {
    focus: 'Cinema Camera Directing & Dynamic Location Framing',
    steps: ['Creative Treatment & Storyboarding', 'Multi-Cam Lighting & Audio Setup', 'Cinematic On-Location Production', 'RAW Transfer & Daily Logs'],
    tools: ['Sony FX Cinema Series', 'DJI Ronin Gimbal', 'Aputure Lighting', 'Sennheiser Wireless'],
  },
  'photography': {
    focus: 'High-Contrast Studio Lighting & Editorial Textures',
    steps: ['Art Direction & Set Staging', 'Tungsten / Strobe Precision Calibration', 'Capture One Tethered Studio Shoot', 'Master Retouching & Color LUTs'],
    tools: ['Hasselblad / Sony Full-Frame', 'Capture One Pro', 'Profoto Modifiers', 'Photoshop'],
  },
};

export default function ServicesSection({ onDiscussProject }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalService, setActiveModalService] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    fetch('/api/public/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch((err) => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  const openServiceDossier = (svc) => {
    setActiveModalService(svc);
  };

  const closeServiceDossier = () => {
    setActiveModalService(null);
  };

  return (
    <section id="services" style={{ padding: '8rem 0', position: 'relative', background: '#050505' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge-mono">
              <Sparkles size={12} color="#FFD400" />
              SECTION 02 // CREATIVE CAPABILITIES
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
            Seven Disciplines. <br />
            <span style={{ color: '#FFD400' }}>Engineered Without Compromise.</span>
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#BDBDBD', lineHeight: 1.65 }}>
            We reject the template-driven agency model. Each of our seven creative disciplines operates with dedicated senior craft, specialized production tooling, and an obsessive focus on distinction.
          </p>
        </div>

        {/* Asymmetrical Editorial Services Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {services.map((svc, index) => {
            const IconComponent = iconMap[svc.icon_name] || Sparkles;
            const workflow = serviceWorkflows[svc.slug] || { focus: svc.tagline, steps: [], tools: [] };
            const isHovered = hoveredIdx === index;

            return (
              <motion.div
                key={svc.slug || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => openServiceDossier(svc)}
                style={{
                  padding: '2rem 2.5rem',
                  borderRadius: '16px',
                  background: isHovered ? '#141414' : '#0c0c0c',
                  border: isHovered ? '1px solid #FFD400' : '1px solid #222222',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(60px, 80px) 1.5fr 2fr minmax(130px, 180px)',
                  alignItems: 'center',
                  gap: '2rem',
                  cursor: 'pointer',
                  transition: 'background 0.25s, border-color 0.25s, transform 0.25s',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                }}
              >
                {/* Index & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: isHovered ? '#FFD400' : '#444444',
                      transition: 'color 0.2s',
                    }}
                  >
                    0{index + 1}
                  </span>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: isHovered ? 'rgba(255, 212, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: isHovered ? '1px solid #FFD400' : '1px solid #292929',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <IconComponent size={20} color={isHovered ? '#FFD400' : '#FFFFFF'} />
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#BDBDBD',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {svc.category}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    {svc.name}
                  </h3>
                </div>

                {/* Summary / Tagline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <p style={{ color: '#BDBDBD', fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {svc.tagline}
                  </p>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#FFD400',
                    }}
                  >
                    Focus: {workflow.focus}
                  </span>
                </div>

                {/* Pricing & Detail Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#777777', textTransform: 'uppercase' }}>
                      Starting At
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: '#FFD400' }}>
                      {svc.starting_price}
                    </div>
                  </div>

                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isHovered ? '#FFD400' : '#171717',
                      border: isHovered ? '1px solid #FFE45C' : '1px solid #292929',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isHovered ? '#000000' : '#FFFFFF',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Discipline Dossier Modal */}
      <AnimatePresence>
        {activeModalService && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onClick={closeServiceDossier}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: '750px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#0d0d0d',
                border: '1px solid #292929',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 212, 0, 0.12)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeServiceDossier}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#171717',
                  border: '1px solid #292929',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD400';
                  e.currentTarget.style.color = '#FFD400';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#292929';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                aria-label="Close dossier"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <span className="badge-mono" style={{ marginBottom: '0.8rem' }}>
                  DISCIPLINE SPECIFICATION // {activeModalService.category}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '0.5rem',
                  }}
                >
                  {activeModalService.name}
                </h3>
                <p style={{ color: '#FFD400', fontFamily: 'var(--font-mono)', fontSize: '0.92rem' }}>
                  {activeModalService.tagline}
                </p>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BDBDBD', marginBottom: '0.75rem' }}>
                  Scope & Philosophy
                </h4>
                <p style={{ color: '#E0E0E0', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  {activeModalService.description}
                </p>
              </div>

              {/* Typical Deliverables */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BDBDBD', marginBottom: '0.85rem' }}>
                  Production Deliverables
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  {activeModalService.deliverables.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: '#141414',
                        border: '1px solid #222222',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.88rem',
                        color: '#FFFFFF',
                      }}
                    >
                      <CheckCircle2 size={16} color="#FFD400" />
                      {deliv}
                    </div>
                  ))}
                </div>
              </div>

              {/* Creative Process & Tools */}
              {serviceWorkflows[activeModalService.slug] && (
                <div style={{ marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #222222' }}>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BDBDBD', marginBottom: '1rem' }}>
                    Execution Pipeline
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                    {serviceWorkflows[activeModalService.slug].steps.map((st, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#FFD400' }}>
                          STEP 0{sIdx + 1}
                        </span>
                        <span style={{ color: '#BDBDBD', fontSize: '0.88rem' }}>{st}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#777777' }}>
                      Primary Suite:
                    </span>
                    {serviceWorkflows[activeModalService.slug].tools.map((tl, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          background: '#191919',
                          border: '1px solid #2b2b2b',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                        }}
                      >
                        {tl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #222222',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#777777', textTransform: 'uppercase' }}>
                    Commission Baseline
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#FFD400' }}>
                    Starting at {activeModalService.starting_price}
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeServiceDossier();
                    onDiscussProject(activeModalService.name);
                  }}
                  className="btn-primary"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Commission {activeModalService.name}
                  <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
