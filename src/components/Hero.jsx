import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import Hero3D from './Hero3D';

export default function Hero({ onExploreWork, onStartProject }) {
  const disciplines = [
    'Video Editing',
    'Graphic Design',
    'Digital Marketing',
    'Web Development',
    'Minecraft Development',
    'Videography',
    'Photography',
  ];

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '7rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* 3D Kinetic Sculpture Centerpiece (Non-blocking, optimized WebGL) */}
      <Hero3D />

      {/* Atmospheric Golden Depth Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '950px',
          height: '580px',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 212, 0, 0.08) 0%, rgba(255, 212, 0, 0.015) 50%, transparent 75%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1100px' }}>
        {/* Editorial Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '1.75rem', display: 'inline-block' }}
        >
          <span className="badge-mono">
            <Sparkles size={12} color="#FFD400" />
            INDEPENDENT CREATIVE & DIGITAL PRODUCTION STUDIO
          </span>
        </motion.div>

        {/* Mandatory World-Class Editorial Headline */}
        <div style={{ position: 'relative' }}>
          {/* Subtle text backing plate so 3D background never harms instant legibility */}
          <div
            style={{
              position: 'absolute',
              inset: '-25px -40px',
              background: 'radial-gradient(ellipse at center, rgba(5, 5, 5, 0.8) 0%, transparent 75%)',
              filter: 'blur(25px)',
              zIndex: -1,
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.75rem, 7.5vw, 6rem)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '1.75rem',
              textShadow: '0 4px 35px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 212, 0, 0.18)',
            }}
          >
            WE MAKE IDEAS <br />
            IMPOSSIBLE <span style={{ color: '#FFD400' }}>TO IGNORE.</span>
          </motion.h1>
        </div>

        {/* Mandatory Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
            fontWeight: 400,
            color: '#BDBDBD',
            maxWidth: '780px',
            margin: '0 auto 2.75rem auto',
            lineHeight: 1.65,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
          }}
        >
          Design, digital experiences, visual storytelling, and technology built to make brands stand out.
        </motion.p>

        {/* Mandatory CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <button onClick={onStartProject} className="btn-primary" aria-label="Start a Project">
            START A PROJECT
            <ArrowUpRight size={18} />
          </button>

          <button onClick={onExploreWork} className="btn-secondary" aria-label="Explore Our Work">
            EXPLORE OUR WORK
            <Compass size={18} />
          </button>
        </motion.div>

        {/* Seven Disciplines Ticker Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #292929',
          }}
        >
          {disciplines.map((item, idx) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#BDBDBD',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#FFD400',
                  boxShadow: '0 0 6px #FFD400',
                }}
              />
              {item}
            </div>
          ))}
        </motion.div>

        {/* Refined Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
          onClick={onExploreWork}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to content"
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#BDBDBD',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            DISCOVER THE UNIVERSE
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: '24px',
              height: '38px',
              borderRadius: '12px',
              border: '1.5px solid #292929',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '7px',
                borderRadius: '2px',
                backgroundColor: '#FFD400',
                boxShadow: '0 0 6px #FFD400',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
