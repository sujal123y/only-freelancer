import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, User, Shield, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, activePage = 'home' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', target: 'hero', page: 'home' },
    { label: 'Capabilities', target: 'services', page: 'home' },
    { label: 'Selected Work', target: 'portfolio', page: 'home' },
    { label: 'Manifesto', target: 'about', page: 'home' },
    { label: 'Process', target: 'workflow', page: 'home' },
    { label: 'Contact', target: 'contact', page: 'home' },
  ];

  const handleLinkClick = (item) => {
    setMobileMenuOpen(false);
    if (activePage !== 'home') {
      onNavigate('home', item.target);
    } else {
      const element = document.getElementById(item.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDashboardTarget = () => {
    if (!user) return 'login';
    if (user.role === 'owner' || user.role === 'admin') return 'admin';
    if (user.role === 'client') return 'client';
    return 'team';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Client Portal';
    if (user.role === 'owner' || user.role === 'admin') return 'Admin Suite';
    if (user.role === 'client') return 'Client Hub';
    return 'Team Hub';
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: scrolled ? '0.75rem 0' : '1.25rem 0',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home', 'hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left',
              cursor: 'pointer',
            }}
            aria-label="ONLY FREELANCER Home"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255, 212, 0, 0.22), #111111)',
                border: '1px solid rgba(255, 212, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(255, 212, 0, 0.2)',
              }}
            >
              <Sparkles size={18} color="#FFD400" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}
              >
                ONLY <span style={{ color: '#FFD400' }}>FREELANCER</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#777777',
                }}
              >
                CREATIVE DIGITAL STUDIO
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item)}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: '#BDBDBD',
                  transition: 'color 0.2s',
                  position: 'relative',
                  padding: '0.4rem 0',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#BDBDBD';
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.width = '0%';
                }}
              >
                {item.label}
                <span
                  className="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    backgroundColor: '#FFD400',
                    transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </button>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
            <button
              onClick={() => onNavigate(getDashboardTarget())}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: user ? '#FFD400' : '#FFFFFF',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: user ? 'rgba(255, 212, 0, 0.1)' : '#141414',
                border: user ? '1px solid rgba(255, 212, 0, 0.4)' : '1px solid #292929',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD400';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = user ? 'rgba(255, 212, 0, 0.4)' : '#292929';
              }}
            >
              {user ? (
                user.role === 'owner' || user.role === 'admin' ? (
                  <Shield size={14} color="#FFD400" />
                ) : (
                  <LayoutDashboard size={14} color="#FFD400" />
                )
              ) : (
                <User size={14} />
              )}
              {getDashboardLabel()}
            </button>

            <button
              onClick={() => {
                if (activePage !== 'home') {
                  onNavigate('home', 'contact');
                } else {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
            >
              Inquire
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#141414',
              border: '1px solid #292929',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: '#0a0a0a',
              borderBottom: '1px solid #292929',
              padding: '2rem 1.5rem',
              zIndex: 899,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item)}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textAlign: 'left',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #1a1a1a',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(getDashboardTarget());
                }}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {getDashboardLabel()}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (activePage !== 'home') {
                    onNavigate('home', 'contact');
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Start a Project
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
