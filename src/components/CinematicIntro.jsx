import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, Sparkles } from 'lucide-react';

/**
 * ONLY FREELANCER // 5-SECOND CINEMATIC INTRO SEQUENCE
 * 1. Deep blackness (#000000)
 * 2. Tiny white stars slowly appear
 * 3. Thin golden light beam travels across the horizon
 * 4. Central sculptural emblem emerges from darkness
 * 5. ONLY FREELANCER refined typography with golden accent
 * 6. Smooth transition into homepage
 */

export default function CinematicIntro({ onComplete, forcePlay = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(1); // 1: Black, 2: Stars, 3: Golden Beam, 4: Sculpture & Typography
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced && !forcePlay) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Check if user previously completed intro, unless forced
    if (!forcePlay) {
      const hasSeen = localStorage.getItem('of_intro_seen_v2');
      if (hasSeen) {
        setIsVisible(false);
        onComplete();
        return;
      }
    }

    // Step progression sequence (Total ~4.8s)
    const t1 = setTimeout(() => setStep(2), 600);   // Step 2: Stars appear
    const t2 = setTimeout(() => setStep(3), 1600);  // Step 3: Golden light beam
    const t3 = setTimeout(() => setStep(4), 2600);  // Step 4: Emblem & Typography
    const tEnd = setTimeout(() => handleDismiss(), 4900); // Step 5: Transition to home

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, [forcePlay]);

  // Starfield canvas during intro
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      fadeSpeed: Math.random() * 0.02 + 0.01,
      isGold: Math.random() > 0.85,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.alpha += s.fadeSpeed;
        if (s.alpha > 0.9 || s.alpha < 0.2) s.fadeSpeed = -s.fadeSpeed;
        ctx.fillStyle = s.isGold
          ? `rgba(255, 212, 0, ${Math.max(0, s.alpha)})`
          : `rgba(255, 255, 255, ${Math.max(0, s.alpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('of_intro_seen_v2', 'true');
    setTimeout(() => {
      onComplete();
    }, 650);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(16px)' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '2rem',
        }}
      >
        {/* Step 2: Dynamic Canvas Starfield */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: step >= 2 ? 1 : 0,
            transition: 'opacity 1.2s ease-in',
            pointerEvents: 'none',
          }}
        />

        {/* Step 3: Thin Golden Light Beam Scanning Horizon */}
        {step >= 3 && (
          <motion.div
            initial={{ left: '-20%', opacity: 0 }}
            animate={{ left: '120%', opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              width: '600px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FFD400, #FFE45C, transparent)',
              boxShadow: '0 0 25px #FFD400, 0 0 50px rgba(255, 212, 0, 0.4)',
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
          />
        )}

        {/* Skip Intro Button */}
        <motion.button
          onClick={handleDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '2.5rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '9999px',
            background: 'rgba(17, 17, 17, 0.85)',
            border: '1px solid #292929',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'border-color 0.2s, color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD400';
            e.currentTarget.style.color = '#FFD400';
            e.currentTarget.style.background = '#181818';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#292929';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.background = 'rgba(17, 17, 17, 0.85)';
          }}
        >
          SKIP INTRO
          <FastForward size={14} color="#FFD400" />
        </motion.button>

        {/* Step 4: Central Sculpture & Brand Emergence */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 5, maxWidth: '850px' }}>
          {step >= 4 && (
            <>
              {/* Sculptural Kinetic Monogram Emblem */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '84px',
                  height: '84px',
                  margin: '0 auto 2.2rem auto',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, rgba(255, 212, 0, 0.22), #111111)',
                  border: '1px solid rgba(255, 212, 0, 0.55)',
                  boxShadow: '0 0 50px rgba(255, 212, 0, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={42} color="#FFD400" />
              </motion.div>

              {/* Refined Brand Wordmark */}
              <motion.div
                initial={{ opacity: 0, y: 30, letterSpacing: '0.25em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.08em' }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 212, 0, 0.25)',
                  }}
                >
                  ONLY <span style={{ color: '#FFD400' }}>FREELANCER</span>
                </h1>
              </motion.div>

              {/* Editorial Subline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#BDBDBD',
                }}
              >
                A Creative Universe Built in Black, Lit by Yellow
              </motion.p>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
