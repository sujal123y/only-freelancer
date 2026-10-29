import React from 'react';
import { Sparkles, MessageCircle, Play, Shield, ArrowUpRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer({ onNavigate, onReplayIntro }) {
  const { config } = useConfig();

  const services = [
    'Video Editing',
    'Graphic Design',
    'Digital Marketing',
    'Web Development',
    'Minecraft Development',
    'Videography',
    'Photography',
  ];

  return (
    <footer
      style={{
        borderTop: '1px solid #1f1f1f',
        background: '#040404',
        paddingTop: '6rem',
        paddingBottom: '3.5rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {/* Column 1: Brand Info & Statement */}
          <div style={{ maxWidth: '340px' }}>
            <div
              onClick={() => onNavigate('home', 'hero')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', cursor: 'pointer' }}
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
                }}
              >
                <Sparkles size={18} color="#FFD400" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                ONLY <span style={{ color: '#FFD400' }}>FREELANCER</span>
              </span>
            </div>

            <p style={{ color: '#BDBDBD', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              A creative universe built in black, lit by yellow. Delivering world-class video production, brand identities, high-scale web platforms, and custom Minecraft network systems.
            </p>

            {/* Social & Channel Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a
                href={config.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#101010',
                  border: '1px solid #292929',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                title="Follow ONLY FREELANCER on Instagram"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD400';
                  e.currentTarget.style.color = '#FFD400';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#292929';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href={config.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#101010',
                  border: '1px solid #292929',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                title="Connect on Official Discord"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD400';
                  e.currentTarget.style.color = '#FFD400';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#292929';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFD400',
                marginBottom: '1.25rem',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Home // Hero', target: 'hero' },
                { label: 'Capabilities', target: 'services' },
                { label: 'Selected Works', target: 'portfolio' },
                { label: 'Studio Manifesto', target: 'about' },
                { label: 'Production Process', target: 'workflow' },
                { label: 'Start an Engagement', target: 'contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('home', link.target)}
                    style={{
                      color: '#BDBDBD',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#BDBDBD')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: The 7 Services */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFD400',
                marginBottom: '1.25rem',
              }}
            >
              Seven Disciplines
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {services.map((svc, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('home', 'services')}
                    style={{
                      color: '#BDBDBD',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#BDBDBD')}
                  >
                    {svc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Portals & Cinematic Controls */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFD400',
                marginBottom: '1.25rem',
              }}
            >
              Portals & Controls
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('client')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                >
                  Client Portal
                  <ArrowUpRight size={14} color="#FFD400" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('team')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#BDBDBD',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#BDBDBD')}
                >
                  Team Workspace
                  <ArrowUpRight size={14} />
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#888888',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                >
                  <Shield size={13} color="#FFD400" />
                  Management Suite
                </button>
              </li>

              {/* Replay Intro Trigger */}
              <li style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1f1f1f' }}>
                <button
                  onClick={onReplayIntro}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    background: '#121212',
                    border: '1px solid #292929',
                    color: '#FFD400',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.borderColor = '#FFD400';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#121212';
                    e.currentTarget.style.borderColor = '#292929';
                  }}
                >
                  <Play size={13} fill="#FFD400" />
                  Replay Cinematic Intro
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ color: '#777777', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} ONLY FREELANCER STUDIO. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <button
              onClick={() => onNavigate('privacy')}
              style={{ color: '#888888', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
            >
              Privacy Policy
            </button>

            <button
              onClick={() => onNavigate('terms')}
              style={{ color: '#888888', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
