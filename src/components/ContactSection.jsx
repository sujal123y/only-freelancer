import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function ContactSection({ preselectedService = '' }) {
  const { config } = useConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: preselectedService || 'Video Editing',
    budget: '$1,000 - $3,000',
    deadline: 'Within 30 Days',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  // Sync if preselectedService updates
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const servicesList = [
    'Video Editing',
    'Graphic Design',
    'Digital Marketing',
    'Web Development',
    'Minecraft Development',
    'Videography',
    'Photography',
  ];

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $3,000',
    '$3,000 - $7,500',
    '$7,500 - $15,000',
    '$15,000+ Enterprise',
  ];

  const deadlineOptions = [
    'Urgent (Under 7 Days)',
    'Within 14 Days',
    'Within 30 Days',
    '1-2 Months Horizon',
    'Flexible Schedule',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      setError('Please provide your name, valid email address, and project scope description.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmittedInquiry({
        id: data.id,
        name: formData.name,
        service: formData.service,
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        service: 'Video Editing',
        budget: '$1,000 - $3,000',
        deadline: 'Within 30 Days',
        description: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: '8rem 0', position: 'relative', background: '#050505' }}>
      <div className="container">
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge-mono">
                <Sparkles size={12} color="#FFD400" />
                SECTION 06 // START AN ENGAGEMENT
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                lineHeight: 1.08,
                marginBottom: '1.2rem',
                color: '#FFFFFF',
                letterSpacing: '-0.025em',
              }}
            >
              Let’s Build Something <br />
              <span style={{ color: '#FFD400' }}>Impossible to Ignore.</span>
            </h2>

            <p style={{ color: '#BDBDBD', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
              Share your project vision, timeline, and scope requirements. Our principal team will review your inquiry and follow up within 24 hours.
            </p>
          </div>

          {/* Inquiry Form Card */}
          <div
            style={{
              padding: '3rem',
              borderRadius: '20px',
              background: '#0c0c0c',
              border: '1px solid #222222',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 212, 0, 0.08)',
            }}
          >
            {submittedInquiry ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(255, 212, 0, 0.15)',
                    border: '1px solid #FFD400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                  }}
                >
                  <CheckCircle2 size={32} color="#FFD400" />
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Commission Inquiry Received
                </h3>

                <p style={{ color: '#BDBDBD', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                  Thank you, <strong style={{ color: '#FFFFFF' }}>{submittedInquiry.name}</strong>. Your inquiry for{' '}
                  <strong style={{ color: '#FFD400' }}>{submittedInquiry.service}</strong> has been logged (Ref #{submittedInquiry.id}).
                  Our studio directors will review your brief and follow up via email.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setSubmittedInquiry(null)} className="btn-secondary">
                    Submit Another Inquiry
                  </button>

                  <a
                    href={config.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-discord"
                  >
                    <MessageCircle size={17} color="#FFD400" />
                    Open Studio Discord
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {error && (
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #EF4444',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                {/* Name & Email Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Service & Budget Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Primary Discipline *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      {servicesList.map((svc) => (
                        <option key={svc} value={svc} style={{ background: '#111111', color: '#FFFFFF' }}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#111111', color: '#FFFFFF' }}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Desired Timeline
                  </label>
                  <select
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="input-field"
                    style={{ cursor: 'pointer' }}
                  >
                    {deadlineOptions.map((opt) => (
                      <option key={opt} value={opt} style={{ background: '#111111', color: '#FFFFFF' }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Project Scope & Objectives *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the project, desired deliverables, target audience, and any reference materials..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ minWidth: '220px' }}>
                    {loading ? (
                      'Submitting Inquiry...'
                    ) : (
                      <>
                        Submit Inquiry
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  <a
                    href={config.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-discord"
                  >
                    <MessageCircle size={16} color="#FFD400" />
                    Direct Discord Chat
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
