import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Shield, User, AlertCircle, Sparkles, Building, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function AuthPage({ mode = 'client', onNavigate }) {
  const isAdmin = mode === 'admin';
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const { config } = useConfig();

  const [formData, setFormData] = useState({
    email: isAdmin ? 'admin@onlyfreelancer.com' : 'client@apex.com',
    password: isAdmin ? 'AdminSecure2026!' : 'ClientSecure2026!',
    name: '',
    company: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister && !isAdmin) {
        if (!config.registration_open) {
          throw new Error('Client registration is currently closed. Please submit an inquiry.');
        }
        await register(formData);
        onNavigate('client');
      } else {
        const authedUser = await login(formData.email, formData.password);
        if (isAdmin) {
          if (authedUser.role !== 'owner' && authedUser.role !== 'admin') {
            throw new Error('Access denied. Administrator privileges required.');
          }
          onNavigate('admin');
        } else {
          if (authedUser.role === 'client') {
            onNavigate('client');
          } else if (authedUser.role === 'owner' || authedUser.role === 'admin') {
            onNavigate('admin');
          } else {
            onNavigate('team');
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#050505',
        position: 'relative',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 212, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem',
          background: '#111111',
          borderColor: '#292929',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            color: '#BDBDBD',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD400')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#BDBDBD')}
        >
          ← Return to Studio
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(255, 212, 0, 0.15)',
              border: '1px solid rgba(255, 212, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto',
            }}
          >
            {isAdmin ? <Shield size={24} color="#FFD400" /> : <Lock size={22} color="#FFD400" />}
          </div>

          <span className="badge-mono" style={{ marginBottom: '0.5rem' }}>
            {isAdmin ? 'PRIVATE EXECUTIVE CONSOLE' : isRegister ? 'CLIENT ONBOARDING' : 'CLIENT & TEAM ACCESS'}
          </span>

          <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginTop: '0.5rem' }}>
            {isAdmin ? 'Administrator Authentication' : isRegister ? 'Register Client Account' : 'Portal Sign In'}
          </h2>

          <p style={{ color: '#BDBDBD', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {isAdmin
              ? 'Restricted to verified studio leadership. Public registration disabled.'
              : isRegister
              ? 'Create your private dashboard to track commissions and verified receipts.'
              : 'Sign in to access your project deliverables, milestones, and billing.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && !isAdmin && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Organization / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Horizon Media"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.35rem', fontWeight: 600 }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="user@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#FFFFFF', marginBottom: '0.35rem', fontWeight: 600 }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Authenticating Credentials...' : isRegister ? 'Complete Client Registration' : 'Authenticate & Enter'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Pill for User Ease */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            borderRadius: '8px',
            background: '#161616',
            border: '1px solid #292929',
            fontSize: '0.78rem',
            color: '#BDBDBD',
          }}
        >
          <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            Quick Verification Credentials:
          </div>
          {isAdmin ? (
            <div style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
              <div>Email: <strong style={{ color: '#FFD400' }}>admin@onlyfreelancer.com</strong></div>
              <div>Password: <strong style={{ color: '#FFFFFF' }}>AdminSecure2026!</strong></div>
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
              <div>Client: <span style={{ color: '#FFD400' }}>client@apex.com</span> / <span style={{ color: '#FFFFFF' }}>ClientSecure2026!</span></div>
              <div>Team PM: <span style={{ color: '#FFD400' }}>pm@onlyfreelancer.com</span> / <span style={{ color: '#FFFFFF' }}>TeamSecure2026!</span></div>
            </div>
          )}
        </div>

        {/* Client Login / Register Toggle */}
        {!isAdmin && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            {isRegister ? (
              <span style={{ color: '#BDBDBD' }}>
                Already have a client account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ color: '#FFD400', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </span>
            ) : config.registration_open ? (
              <span style={{ color: '#BDBDBD' }}>
                New client looking to commission?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ color: '#FFD400', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Register Account
                </button>
              </span>
            ) : (
              <span style={{ color: '#7A7A7A', fontSize: '0.8rem' }}>
                Registration is closed. Please submit an inquiry on our homepage.
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
