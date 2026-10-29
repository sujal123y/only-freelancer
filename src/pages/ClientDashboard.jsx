import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderKanban,
  FileText,
  Receipt,
  User,
  LogOut,
  ExternalLink,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Shield,
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function ClientDashboard({ onNavigate }) {
  const { user, token, logout, updateProfile } = useAuth();
  const { config } = useConfig();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'invoices', 'receipts', 'profile'
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected project for detailed milestone drawer
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMilestones, setProjectMilestones] = useState([]);
  const [projectFiles, setProjectFiles] = useState([]);

  // Selected invoice/receipt for document preview modal
  const [previewDocument, setPreviewDocument] = useState(null); // { type: 'invoice'|'receipt', data }

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    currentPassword: '',
    newPassword: '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const statusColors = {
    'Inquiry Received': '#BDBDBD',
    'Under Discussion': '#FFFFFF',
    'Approved': '#FFD400',
    'In Progress': '#FFD400',
    'In Review': '#FFE45C',
    'Revision Requested': '#FFB800',
    'Completed': '#10B981',
    'Cancelled': '#EF4444',
  };

  const statusProgression = [
    'Inquiry Received',
    'Under Discussion',
    'Approved',
    'In Progress',
    'In Review',
    'Revision Requested',
    'Completed',
  ];

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    Promise.all([
      fetch('/api/client/projects', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/client/invoices', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/client/receipts', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([projData, invData, recData]) => {
        if (Array.isArray(projData)) setProjects(projData);
        if (Array.isArray(invData)) setInvoices(invData);
        if (Array.isArray(recData)) setReceipts(recData);
      })
      .catch((err) => console.error('Failed to load client data:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const loadProjectDetails = async (projectId) => {
    try {
      const res = await fetch(`/api/client/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data.project);
        setProjectMilestones(data.milestones || []);
        setProjectFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to load project details:', err);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile(profileForm);
      setProfileSuccess('Profile successfully updated.');
      setProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handleDownloadFile = (fileId, fileName) => {
    fetch(`/api/files/${fileId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Download unauthorized or file not found.');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert(err.message));
  };

  const openDiscordPayment = () => {
    window.open(config.discord_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: '#050505' }}>
      {/* Top Client Bar */}
      <div
        style={{
          borderBottom: '1px solid #292929',
          background: 'rgba(17, 17, 17, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '1.25rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge-mono">AUTHENTICATED CLIENT PORTAL</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.35rem', color: '#FFFFFF' }}>
              Welcome back, <span style={{ color: '#FFD400' }}>{user?.name}</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#BDBDBD' }}>
              {user?.company ? `${user.company} • ` : ''}{user?.email}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={openDiscordPayment}
              className="btn-discord"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.15rem' }}
              title="Open verified Discord channel for payment coordination"
            >
              <MessageSquare size={16} />
              Discuss Payment / Instructions
            </button>

            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.85rem',
                color: '#EF4444',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                background: 'rgba(239, 68, 68, 0.06)',
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1rem',
            marginBottom: '2.5rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'projects', label: 'My Projects', icon: FolderKanban, count: projects.length },
            { id: 'invoices', label: 'Billing & Invoices', icon: FileText, count: invoices.length },
            { id: 'receipts', label: 'Verified Receipts', icon: Receipt, count: receipts.length },
            { id: 'profile', label: 'Profile & Security', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: isActive ? '#FFD400' : '#BDBDBD',
                  background: isActive ? 'rgba(255, 212, 0, 0.15)' : '#111111',
                  border: isActive ? '1px solid #FFD400' : '1px solid #292929',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} color={isActive ? '#FFD400' : '#BDBDBD'} />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      background: isActive ? '#FFD400' : '#292929',
                      color: isActive ? '#000000' : '#FFFFFF',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              <div
                className="glass-card"
                style={{ textAlign: 'center', padding: '4rem 2rem', borderColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                <FolderKanban size={48} color="#71717A" style={{ margin: '0 auto 1.2rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '0.6rem' }}>
                  No Active Commissions Found
                </h3>
                <p style={{ color: '#A4A4AE', maxWidth: '460px', margin: '0 auto 1.8rem auto' }}>
                  You currently do not have any logged project commissions. Start an inquiry on our homepage to initiate your first commission.
                </p>
                <button
                  onClick={() => onNavigate('home', 'contact')}
                  className="btn-primary"
                >
                  Commission a Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.75rem' }}>
                {projects.map((proj) => {
                  const statusColor = statusColors[proj.status] || '#FFD400';

                  return (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card"
                      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#111111', border: '1px solid #292929' }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                          <span className="badge-mono">{proj.service}</span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: statusColor,
                              border: `1px solid ${statusColor}40`,
                              background: `${statusColor}15`,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                            }}
                          >
                            {proj.status}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                          {proj.title}
                        </h3>

                        <p style={{ fontSize: '0.88rem', color: '#BDBDBD', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                          {proj.description || 'Custom production commission scope.'}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#7A7A7A', fontFamily: 'var(--font-mono)' }}>
                          <div>Assigned PM: <strong style={{ color: '#FFFFFF' }}>{proj.pm_name || 'Executive Oversight'}</strong></div>
                          {proj.deadline && <div>Target Delivery: <strong style={{ color: '#FFD400' }}>{proj.deadline}</strong></div>}
                        </div>
                      </div>

                      <div style={{ paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid #292929' }}>
                        <button
                          onClick={() => loadProjectDetails(proj.id)}
                          className="btn-secondary"
                          style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                        >
                          View Milestones & Deliverables
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVOICES */}
        {activeTab === 'invoices' && (
          <div>
            {/* Notice regarding Discord Payments */}
            <div
              style={{
                background: '#111111',
                border: '1px solid #292929',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={22} color="#FFD400" />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Payment Coordination via Official Discord
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#BDBDBD' }}>
                    Payments are handled and verified independently via our studio Discord channel. Verified receipts are issued upon bank settlement.
                  </div>
                </div>
              </div>

              <button onClick={openDiscordPayment} className="btn-discord" style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}>
                Open Studio Discord
                <ExternalLink size={14} />
              </button>
            </div>

            {invoices.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111111', border: '1px solid #292929' }}>
                <FileText size={48} color="#71717A" style={{ margin: '0 auto 1.2rem auto' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>No Invoices Issued</h3>
                <p style={{ color: '#BDBDBD', fontSize: '0.9rem' }}>Invoices will appear here once your project scope has been approved.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.2rem',
                      background: '#111111',
                      border: '1px solid #292929',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#FFD400', fontWeight: 700 }}>
                          {inv.invoice_number}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: inv.status === 'Paid' ? '#10B981' : '#F59E0B',
                            border: inv.status === 'Paid' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: '#F5F4F2', marginBottom: '0.2rem' }}>{inv.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                        Issue Date: {inv.issue_date} • Due: {inv.due_date}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>TOTAL AMOUNT</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F5F4F2', fontFamily: 'var(--font-mono)' }}>
                          ${inv.total?.toLocaleString()} {inv.currency}
                        </div>
                      </div>

                      <button
                        onClick={() => setPreviewDocument({ type: 'invoice', data: inv })}
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                      >
                        <Eye size={15} />
                        View / Print
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          onClick={openDiscordPayment}
                          className="btn-discord"
                          style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                        >
                          Discuss Payment
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECEIPTS */}
        {activeTab === 'receipts' && (
          <div>
            {receipts.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Receipt size={48} color="#71717A" style={{ margin: '0 auto 1.2rem auto' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#F5F4F2', marginBottom: '0.5rem' }}>No Verified Receipts Yet</h3>
                <p style={{ color: '#A4A4AE', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                  Receipts are only generated after an administrator has physically verified payment receipt in our studio account.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {receipts.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.2rem',
                      borderLeft: '4px solid #10B981',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
                          {rec.receipt_number}
                        </span>
                        <span className="badge-mono" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981' }}>
                          VERIFIED SETTLEMENT
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: '#F5F4F2', marginBottom: '0.2rem' }}>{rec.invoice_title}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                        Verified by: {rec.verified_by_name} • Date: {rec.verified_at}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#A4A4AE', marginTop: '0.3rem' }}>
                        Method: {rec.payment_method}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>AMOUNT SETTLED</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                          ${rec.amount_paid?.toLocaleString()} {rec.currency}
                        </div>
                      </div>

                      <button
                        onClick={() => setPreviewDocument({ type: 'receipt', data: rec })}
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                      >
                        <Eye size={15} />
                        View Official Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '650px' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#F5F4F2', marginBottom: '1.5rem' }}>
                Client Profile & Credentials
              </h3>

              {profileSuccess && (
                <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSave}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Email Address (Immutable)
                  </label>
                  <input type="email" disabled value={user?.email || ''} className="input-field" style={{ opacity: 0.6 }} />
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Phone / Contact Coordinates
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#F5F4F2', marginBottom: '1rem' }}>Change Password</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={profileForm.currentPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password (min 8 chars)"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Save Profile Updates
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Project Milestones Drawer / Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(8, 8, 11, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                position: 'relative',
                background: '#101014',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#A4A4AE' }}
              >
                <X size={20} />
              </button>

              <span className="badge-mono" style={{ marginBottom: '0.75rem' }}>{selectedProject.service}</span>
              <h3 style={{ fontSize: '1.75rem', color: '#F5F4F2', marginBottom: '0.5rem' }}>{selectedProject.title}</h3>
              <p style={{ color: '#A4A4AE', fontSize: '0.92rem', marginBottom: '2rem' }}>{selectedProject.description}</p>

              {/* Status Timeline */}
              <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: '#FFD400', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Project Milestones & Pipeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {projectMilestones.length === 0 ? (
                  <p style={{ color: '#71717A', fontSize: '0.88rem' }}>Milestones are being formulated by your project manager.</p>
                ) : (
                  projectMilestones.map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        background: '#161616',
                        border: ms.status === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' : ms.status === 'in_progress' ? '1px solid rgba(255, 212, 0, 0.45)' : '1px solid #292929',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ marginTop: '0.2rem' }}>
                        {ms.status === 'completed' ? (
                          <CheckCircle2 size={18} color="#10B981" />
                        ) : ms.status === 'in_progress' ? (
                          <Clock size={18} color="#FFD400" />
                        ) : (
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #71717A' }} />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h5 style={{ fontSize: '1rem', color: '#FFFFFF' }}>{ms.title}</h5>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: ms.status === 'completed' ? '#10B981' : ms.status === 'in_progress' ? '#FFD400' : '#71717A', textTransform: 'uppercase' }}>
                            {ms.status.replace('_', ' ')}
                          </span>
                        </div>
                        {ms.description && <p style={{ fontSize: '0.85rem', color: '#BDBDBD', marginTop: '0.25rem' }}>{ms.description}</p>}
                        {ms.due_date && <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#71717A', marginTop: '0.4rem' }}>Target: {ms.due_date}</div>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Secure Deliverables */}
              <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: '#FFD400', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Secure Deliverables & Files
              </h4>

              {projectFiles.length === 0 ? (
                <p style={{ color: '#71717A', fontSize: '0.88rem' }}>No master deliverables uploaded to this stage yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {projectFiles.map((file) => (
                    <div
                      key={file.id}
                      style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#F5F4F2', fontWeight: 600 }}>{file.original_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                          {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.category}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(file.id, file.original_name)}
                        className="btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview & Print Modal */}
      <AnimatePresence>
        {previewDocument && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setPreviewDocument(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#FFFFFF',
                color: '#111827',
                borderRadius: '12px',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewDocument(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#4B5563' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E5E7EB', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#111827', fontWeight: 800 }}>ONLY FREELANCER</h2>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Global Digital Production Studio</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: previewDocument.type === 'receipt' ? '#059669' : '#000000' }}>
                    {previewDocument.type === 'receipt' ? 'OFFICIAL RECEIPT' : 'INVOICE'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#4B5563' }}>
                    {previewDocument.type === 'receipt' ? previewDocument.data.receipt_number : previewDocument.data.invoice_number}
                  </div>
                </div>
              </div>

              {previewDocument.type === 'invoice' ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#6B7280' }}>Billed To:</strong>
                      <div style={{ fontWeight: 600 }}>{user?.name}</div>
                      <div>{user?.company}</div>
                      <div>{user?.email}</div>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#6B7280' }}>Dates:</strong>
                      <div>Issue Date: {previewDocument.data.issue_date}</div>
                      <div>Due Date: {previewDocument.data.due_date}</div>
                      <div>Status: <span style={{ fontWeight: 700, color: previewDocument.data.status === 'Paid' ? '#059669' : '#D97706' }}>{previewDocument.data.status}</span></div>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F3F4F6', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                        <th style={{ padding: '0.65rem' }}>Description</th>
                        <th style={{ padding: '0.65rem', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '0.65rem', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.65rem', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewDocument.data.line_items?.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '0.65rem' }}>{item.description}</td>
                          <td style={{ padding: '0.65rem', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '0.65rem', textAlign: 'right' }}>${item.unit_price?.toLocaleString()}</td>
                          <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 600 }}>${item.total?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                    <div style={{ width: '220px', textAlign: 'right', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                        <span>Subtotal:</span>
                        <span>${previewDocument.data.subtotal?.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '2px solid #111827', fontWeight: 800, fontSize: '1.2rem' }}>
                        <span>Total:</span>
                        <span>${previewDocument.data.total?.toLocaleString()} {previewDocument.data.currency}</span>
                      </div>
                    </div>
                  </div>

                  {previewDocument.data.notes && (
                    <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#4B5563', marginBottom: '1.5rem' }}>
                      <strong>Payment Notes:</strong> {previewDocument.data.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <div style={{ color: '#065F46', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                      Payment Confirmed & Verified
                    </div>
                    <div style={{ color: '#047857', fontSize: '0.85rem' }}>
                      This receipt certifies that the payment below was confirmed by studio administration.
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#6B7280' }}>Received From:</strong>
                      <div style={{ fontWeight: 600 }}>{user?.name}</div>
                      <div>{user?.company}</div>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#6B7280' }}>Verification Details:</strong>
                      <div>Date Verified: {previewDocument.data.verified_at}</div>
                      <div>Method: {previewDocument.data.payment_method}</div>
                      <div>Verifier: {previewDocument.data.verified_by_name}</div>
                    </div>
                  </div>

                  <div style={{ background: '#F3F4F6', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>TOTAL AMOUNT SETTLED</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                      ${previewDocument.data.amount_paid?.toLocaleString()} {previewDocument.data.currency}
                    </div>
                  </div>

                  {previewDocument.data.verification_notes && (
                    <div style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '1.5rem' }}>
                      <strong>Audit Verification Note:</strong> {previewDocument.data.verification_notes}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    background: '#111827',
                    color: '#FFF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  Print / Save as PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
