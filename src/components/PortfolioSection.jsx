import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Sparkles, Filter, X, CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function PortfolioSection({ onCommissionProject }) {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch((err) => console.error('Failed to load portfolio:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All',
    'Video Editing',
    'Graphic Design',
    'Web Development',
    'Minecraft Development',
    'Photography',
    'Digital Marketing',
  ];

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" style={{ padding: '8rem 0', background: '#070707', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '850px', marginBottom: '3.5rem' }}>
          <div>
            <span className="badge-mono">
              <Sparkles size={12} color="#FFD400" />
              SECTION 03 // ART DIRECTION EXHIBITION
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.08,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
            }}
          >
            Selected Works & <br />
            <span style={{ color: '#FFD400' }}>Aesthetic Benchmark Concepts.</span>
          </h2>

          <p style={{ color: '#BDBDBD', fontSize: '1.1rem', lineHeight: 1.65 }}>
            A curated exhibition of our aesthetic craft and engineering standards.
            In accordance with our strict transparency policy, conceptual studio demonstrations are clearly labeled as{' '}
            <span style={{ color: '#FFD400', fontFamily: 'var(--font-mono)' }}>[Showcase Demo]</span>, highlighting our capabilities and craft standards.
          </p>
        </div>

        {/* Category Filter Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid #1f1f1f',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                  background: isActive ? '#FFD400' : '#111111',
                  border: isActive ? '1px solid #FFE45C' : '1px solid #292929',
                  color: isActive ? '#000000' : '#BDBDBD',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid: Editorial Varied Layout */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2.5rem',
          }}
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                onClick={() => setSelectedProject(item)}
                style={{
                  background: '#0e0e0e',
                  border: '1px solid #222222',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD400';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 212, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222222';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image Container with Zoom Treatment */}
                <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', backgroundColor: '#141414' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />

                  {/* Honest Demo/Commission Tag */}
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                    <span
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(5, 5, 5, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #FFD400',
                        color: '#FFD400',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.is_demo ? 'SHOWCASE DEMO' : 'VERIFIED PROJECT'}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 2 }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        background: 'rgba(17, 17, 17, 0.88)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #292929',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#888888', marginBottom: '0.5rem' }}>
                      {item.client_display}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '0.75rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p style={{ color: '#BDBDBD', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            background: '#161616',
                            color: '#BDBDBD',
                            border: '1px solid #292929',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid #1f1f1f',
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#FFD400' }}>
                        VIEW CASE STUDY
                      </span>
                      <ArrowUpRight size={16} color="#FFD400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: '820px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#0c0c0c',
                border: '1px solid #292929',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(255, 212, 0, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
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
                aria-label="Close case study"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                  <span className="badge-mono">
                    {selectedProject.is_demo ? 'SHOWCASE DEMO CONCEPT' : 'VERIFIED CLIENT WORK'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#BDBDBD' }}>
                    {selectedProject.category}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '0.5rem',
                  }}
                >
                  {selectedProject.title}
                </h3>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#FFD400' }}>
                  {selectedProject.client_display}
                </p>
              </div>

              {/* Large Image Showcase */}
              <div
                style={{
                  width: '100%',
                  height: '360px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  marginBottom: '2rem',
                  border: '1px solid #222222',
                }}
              >
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Brief & Approach */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BDBDBD', marginBottom: '0.75rem' }}>
                  The Creative & Technical Brief
                </h4>
                <p style={{ color: '#E0E0E0', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  {selectedProject.description}
                </p>
              </div>

              {/* Deliverables / Architectural Specifications */}
              <div style={{ marginBottom: '2.5rem', padding: '1.25rem', borderRadius: '12px', background: '#121212', border: '1px solid #222222' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFD400', marginBottom: '0.5rem' }}>
                  Key Deliverables & Specifications
                </h4>
                <p style={{ color: '#FFFFFF', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                  {selectedProject.deliverables_summary}
                </p>
              </div>

              {/* Footer CTA */}
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
                <div style={{ color: '#777777', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  Need a similar production standard for your brand?
                </div>

                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onCommissionProject(selectedProject.category);
                  }}
                  className="btn-primary"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Commission in this Style
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
