import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Users,
  UserCheck,
  FileText,
  Receipt,
  Sparkles,
  Sliders,
  Activity,
  LogOut,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function AdminDashboard({ onNavigate }) {
  const { user, token, logout } = useAuth();
  const { config, refreshConfig } = useConfig();

  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'inquiries', 'projects', 'clients', 'team', 'invoices', 'receipts', 'portfolio', 'settings', 'audit'

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    discord_url: config.discord_url || '',
    instagram_url: config.instagram_url || '',
    registration_open: config.registration_open ? 'true' : 'false',
    agency_email: config.agency_email || '',
    agency_phone: config.agency_phone || '',
    site_announcement: config.site_announcement || '',
  });
  const [settingsFeedback, setSettingsFeedback] = useState('');

  // Modals
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateReceiptModal, setShowCreateReceiptModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  // Invoice form state
  const [newInvoice, setNewInvoice] = useState({
    client_id: '',
    title: '',
    description_item: '',
    amount_item: 1000,
    currency: 'USD',
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: 'Payment coordinates verified via studio Discord.',
  });

  // Receipt form state
  const [newReceipt, setNewReceipt] = useState({
    invoice_id: '',
    amount_paid: 1000,
    payment_method: 'Verified Bank Wire / Independent Confirmation',
    verification_notes: 'Confirmed in studio operating account.',
  });

  // Team form state
  const [newTeam, setNewTeam] = useState({
    name: '',
    email: '',
    password: '',
    role: 'designer',
    company: 'ONLY FREELANCER Team',
    phone: '',
  });

  // Project form state
  const [newProject, setNewProject] = useState({
    title: '',
    client_id: '',
    service: 'Video Editing',
    description: '',
    assigned_pm_id: '',
    budget: 2500,
    deadline: '',
  });

  useEffect(() => {
    if (!token) return;
    refreshAllData();
  }, [token]);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [m, inq, prj, clt, tm, inv, rec, port, aud] = await Promise.all([
        fetch('/api/admin/metrics', { headers }).then((r) => r.json()),
        fetch('/api/admin/inquiries', { headers }).then((r) => r.json()),
        fetch('/api/admin/projects', { headers }).then((r) => r.json()),
        fetch('/api/admin/clients', { headers }).then((r) => r.json()),
        fetch('/api/admin/team', { headers }).then((r) => r.json()),
        fetch('/api/admin/invoices', { headers }).then((r) => r.json()),
        fetch('/api/admin/receipts', { headers }).then((r) => r.json()),
        fetch('/api/public/portfolio').then((r) => r.json()),
        fetch('/api/admin/audit-logs', { headers }).then((r) => r.json()),
      ]);

      if (m && !m.error) setMetrics(m);
      if (Array.isArray(inq)) setInquiries(inq);
      if (Array.isArray(prj)) setProjects(prj);
      if (Array.isArray(clt)) setClients(clt);
      if (Array.isArray(tm)) setTeamMembers(tm);
      if (Array.isArray(inv)) setInvoices(inv);
      if (Array.isArray(rec)) setReceipts(rec);
      if (Array.isArray(port)) setPortfolioItems(port);
      if (Array.isArray(aud)) setAuditLogs(aud);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertInquiry = async (inquiryId) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        alert('Inquiry successfully converted into active project!');
        refreshAllData();
      }
    } catch (err) {
      alert('Conversion failed: ' + err.message);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const line_items = [
        {
          description: newInvoice.description_item || newInvoice.title,
          quantity: 1,
          unit_price: Number(newInvoice.amount_item),
          total: Number(newInvoice.amount_item),
        },
      ];

      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: Number(newInvoice.client_id),
          title: newInvoice.title,
          line_items,
          subtotal: Number(newInvoice.amount_item),
          currency: newInvoice.currency,
          due_date: newInvoice.due_date,
          notes: newInvoice.notes,
          status: 'Issued',
        }),
      });

      if (!res.ok) throw new Error('Failed to create invoice');
      setShowCreateInvoiceModal(false);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invoice_id: Number(newReceipt.invoice_id),
          amount_paid: Number(newReceipt.amount_paid),
          payment_method: newReceipt.payment_method,
          verification_notes: newReceipt.verification_notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to issue receipt');
      setShowCreateReceiptModal(false);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTeam),
      });

      if (!res.ok) throw new Error('Failed to create team member');
      setShowCreateTeamModal(false);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsFeedback('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: settingsForm }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSettingsFeedback('System settings updated successfully.');
      refreshConfig();
      setTimeout(() => setSettingsFeedback(''), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Project Inquiries', icon: Inbox, count: inquiries.filter((i) => i.status === 'pending').length },
    { id: 'projects', label: 'Commissions & Projects', icon: FolderKanban, count: projects.length },
    { id: 'clients', label: 'Client Accounts', icon: Users, count: clients.length },
    { id: 'team', label: 'Team & RBAC Matrix', icon: UserCheck, count: teamMembers.length },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText, count: invoices.length },
    { id: 'receipts', label: 'Verified Receipts', icon: Receipt, count: receipts.length },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: Sparkles, count: portfolioItems.length },
    { id: 'settings', label: 'Platform Settings', icon: Sliders },
    { id: 'audit', label: 'Security Audit Trail', icon: Activity },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#08080B' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '280px',
          background: '#0D0D12',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          padding: '1.75rem 1.25rem',
        }}
      >
        <div>
          {/* Admin Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 212, 0, 0.18)',
                border: '1px solid #FFD400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} color="#FFD400" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                ONLY FREELANCER
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#FFD400', letterSpacing: '0.08em' }}>
                ADMIN EXECUTIVE SUITE
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : '#BDBDBD',
                    background: isActive ? 'rgba(255, 212, 0, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 212, 0, 0.4)' : '1px solid transparent',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} color={isActive ? '#FFD400' : '#BDBDBD'} />
                    <span>{link.label}</span>
                  </div>

                  {link.count > 0 && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        background: link.id === 'inquiries' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: link.id === 'inquiries' ? '#EF4444' : '#FFFFFF',
                      }}
                    >
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{user?.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#FFD400', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                Role: {user?.role}
              </div>
            </div>

            <button
              onClick={() => onNavigate('home')}
              style={{ fontSize: '0.75rem', color: '#FFE45C', fontFamily: 'var(--font-mono)' }}
            >
              Public Site →
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('admin-login');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.55rem',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#EF4444',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <LogOut size={14} /> End Admin Session
          </button>
        </div>
      </aside>

      {/* Main Admin Working Area */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', minHeight: '100vh' }}>
        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="badge-mono">EXECUTIVE COMMAND</span>
              <h1 style={{ fontSize: '2.2rem', color: '#F5F4F2', marginTop: '0.5rem' }}>
                Studio Operational Intelligence
              </h1>
            </div>

            {/* Metrics KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Active Commissions', val: metrics?.activeProjects || 0, sub: `${metrics?.completedProjects || 0} completed`, color: '#FFD400' },
                { label: 'Pending Inquiries', val: metrics?.pendingInquiries || 0, sub: `${metrics?.totalInquiries || 0} total lifetime`, color: '#FFE45C' },
                { label: 'Registered Clients', val: metrics?.totalClients || 0, sub: 'Active portal accounts', color: '#FFFFFF' },
                { label: 'Invoiced Revenue', val: `$${(metrics?.totalPaidRevenue || 0).toLocaleString()}`, sub: `$${(metrics?.pendingInvoicesAmount || 0).toLocaleString()} awaiting`, color: '#10B981' },
                { label: 'Verified Settlements', val: `$${(metrics?.verifiedReceiptsSum || 0).toLocaleString()}`, sub: 'Audited & confirmed receipts', color: '#FFD400' },
              ].map((kpi, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: `3px solid ${kpi.color}` }}>
                  <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#BDBDBD', textTransform: 'uppercase' }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)', margin: '0.4rem 0' }}>
                    {kpi.val}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#71717A' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1rem' }}>Executive Actions</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => setShowCreateInvoiceModal(true)} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem' }}>
                  <Plus size={16} /> Create Client Invoice
                </button>
                <button onClick={() => setShowCreateReceiptModal(true)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem' }}>
                  <Receipt size={16} color="#10B981" /> Issue Verified Receipt
                </button>
                <button onClick={() => setShowCreateTeamModal(true)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem' }}>
                  <Users size={16} color="#FFD400" /> Add Team Member
                </button>
              </div>
            </div>

            {/* Recent Inquiries Snapshot */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>Incoming Inquiries Queue</h3>
                <button onClick={() => setActiveSection('inquiries')} style={{ fontSize: '0.82rem', color: '#FFD400', fontFamily: 'var(--font-mono)' }}>
                  View All ({inquiries.length}) →
                </button>
              </div>

              {inquiries.slice(0, 5).map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ color: '#FFFFFF', fontSize: '0.92rem' }}>{inq.name}</strong>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#FFD400' }}>({inq.service})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#71717A' }}>{inq.email} • Budget: {inq.budget}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge-mono" style={{ fontSize: '0.68rem' }}>{inq.status}</span>
                    {inq.status === 'pending' && (
                      <button
                        onClick={() => handleConvertInquiry(inq.id)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Convert to Project
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: INQUIRIES */}
        {activeSection === 'inquiries' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-mono">PIPELINE</span>
              <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                Public Project Inquiries ({inquiries.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inquiries.map((inq) => (
                <div key={inq.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="badge-mono" style={{ marginRight: '0.6rem' }}>{inq.service}</span>
                      <strong style={{ fontSize: '1.1rem', color: '#F5F4F2' }}>{inq.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#A4A4AE', marginLeft: '0.75rem' }}>({inq.email})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: inq.status === 'converted' ? '#10B981' : '#F59E0B' }}>
                        {inq.status.toUpperCase()}
                      </span>
                      {inq.status !== 'converted' && (
                        <button
                          onClick={() => handleConvertInquiry(inq.id)}
                          className="btn-primary"
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                        >
                          Convert to Commission
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ color: '#A4A4AE', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1rem' }}>
                    {inq.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                    <div>Budget: <strong style={{ color: '#F5F4F2' }}>{inq.budget}</strong></div>
                    <div>Target Timeline: <strong style={{ color: '#FFE45C' }}>{inq.deadline}</strong></div>
                    <div>Submitted: {inq.created_at}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: PROJECTS */}
        {activeSection === 'projects' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span className="badge-mono">PRODUCTION</span>
                <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                  Active Project Commissions ({projects.length})
                </h2>
              </div>

              <button onClick={() => setShowCreateProjectModal(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> New Commission
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {projects.map((proj) => (
                <div key={proj.id} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="badge-mono">{proj.service}</span>
                      <h3 style={{ fontSize: '1.25rem', color: '#F5F4F2' }}>{proj.title}</h3>
                    </div>

                    <select
                      value={proj.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await fetch(`/api/admin/projects/${proj.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ status: newStatus }),
                        });
                        refreshAllData();
                      }}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        background: '#16161D',
                        color: '#F5F4F2',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {[
                        'Inquiry Received',
                        'Under Discussion',
                        'Approved',
                        'In Progress',
                        'In Review',
                        'Revision Requested',
                        'Completed',
                        'Cancelled',
                      ].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <p style={{ color: '#A4A4AE', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#71717A' }}>
                    <div>Client: <strong style={{ color: '#F5F4F2' }}>{proj.client_name}</strong></div>
                    <div>Assigned PM: <strong style={{ color: '#F5F4F2' }}>{proj.pm_name || 'Unassigned'}</strong></div>
                    <div>Budget: <strong style={{ color: '#10B981' }}>${proj.budget?.toLocaleString()}</strong></div>
                    <div>Target Delivery: <strong style={{ color: '#FFE45C' }}>{proj.deadline || 'Flexible'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: CLIENTS */}
        {activeSection === 'clients' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-mono">ACCOUNTS</span>
              <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginTop: '0.4rem' }}>
                Client Directory ({clients.length})
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {clients.map((clt) => (
                <div key={clt.id} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 212, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD400', fontWeight: 700 }}>
                      {clt.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="badge-white">Client Account</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>{clt.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#FFD400', marginBottom: '0.75rem' }}>{clt.company || 'Private Venture'}</div>
                  <div style={{ fontSize: '0.82rem', color: '#BDBDBD', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>{clt.email}</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.8rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                    <span>Projects: <strong style={{ color: '#FFFFFF' }}>{clt.project_count || 0}</strong></span>
                    <span>Invoices: <strong style={{ color: '#FFFFFF' }}>{clt.invoice_count || 0}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: TEAM & PERMISSIONS */}
        {activeSection === 'team' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span className="badge-mono">RBAC ACCESS MATRIX</span>
                <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginTop: '0.4rem' }}>
                  Team Members & Privileges ({teamMembers.length})
                </h2>
              </div>

              <button onClick={() => setShowCreateTeamModal(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Team Member
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teamMembers.map((tm) => (
                <div key={tm.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{tm.name}</strong>
                      <span className="badge-mono" style={{ textTransform: 'uppercase' }}>{tm.role}</span>
                      {tm.role === 'owner' && <span className="badge-white">ROOT OWNER</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#A4A4AE', fontFamily: 'var(--font-mono)' }}>
                      {tm.email} • {tm.company || 'ONLY FREELANCER'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {tm.role !== 'owner' && (
                      <select
                        value={tm.role}
                        onChange={async (e) => {
                          const newRole = e.target.value;
                          await fetch(`/api/admin/team/${tm.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ role: newRole }),
                          });
                          refreshAllData();
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: '#16161D',
                          color: '#F5F4F2',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                        }}
                      >
                        <option value="admin">Administrator</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="video_editor">Video Editor</option>
                        <option value="team_member">Team Member</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: INVOICES */}
        {activeSection === 'invoices' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span className="badge-mono">FINANCES</span>
                <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                  Client Invoices ({invoices.length})
                </h2>
              </div>

              <button onClick={() => setShowCreateInvoiceModal(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Create Invoice
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invoices.map((inv) => (
                <div key={inv.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFD400' }}>{inv.invoice_number}</span>
                      <span className="badge-mono">{inv.status}</span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', color: '#F5F4F2', marginBottom: '0.2rem' }}>{inv.title}</h4>
                    <div style={{ fontSize: '0.82rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>
                      Client: {inv.client_name} ({inv.client_email}) • Due: {inv.due_date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>TOTAL AMOUNT</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F5F4F2', fontFamily: 'var(--font-mono)' }}>
                        ${inv.total?.toLocaleString()} {inv.currency}
                      </div>
                    </div>

                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => {
                          setNewReceipt({
                            invoice_id: inv.id,
                            amount_paid: inv.total,
                            payment_method: 'Verified Bank Wire / Independent Confirmation',
                            verification_notes: `Confirmed settlement for ${inv.invoice_number}`,
                          });
                          setShowCreateReceiptModal(true);
                        }}
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                      >
                        <CheckCircle2 size={14} color="#10B981" /> Confirm Payment & Issue Receipt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: RECEIPTS */}
        {activeSection === 'receipts' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span className="badge-mono">VERIFIED AUDIT</span>
                <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                  Audited Payment Receipts ({receipts.length})
                </h2>
              </div>

              <button onClick={() => setShowCreateReceiptModal(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Issue Verified Receipt
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {receipts.map((rec) => (
                <div key={rec.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#10B981', fontSize: '0.95rem' }}>{rec.receipt_number}</strong>
                      <span className="badge-mono" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981' }}>VERIFIED BY STUDIO</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#F5F4F2' }}>{rec.invoice_title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#71717A', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                      Client: {rec.client_name} • Verified by: {rec.verified_by_name} • Date: {rec.verified_at}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717A', fontFamily: 'var(--font-mono)' }}>CONFIRMED SETTLEMENT</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                      ${rec.amount_paid?.toLocaleString()} {rec.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: PORTFOLIO SHOWCASE */}
        {activeSection === 'portfolio' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-mono">SHOWCASE GOVERNANCE</span>
              <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                Portfolio Showcase Items ({portfolioItems.length})
              </h2>
              <p style={{ color: '#A4A4AE', fontSize: '0.9rem' }}>
                Showcase concepts demonstrate technical and creative ability. Demo items are explicitly tagged with <span style={{ color: '#FFD400' }}>[Showcase Demo]</span> for honesty.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {portfolioItems.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge-mono">{item.category}</span>
                    {item.is_demo && <span className="badge-white">Demo</span>}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#F5F4F2', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.84rem', color: '#A4A4AE', lineHeight: 1.5 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 9: SETTINGS */}
        {activeSection === 'settings' && (
          <div style={{ maxWidth: '750px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-mono">CONFIGURATION</span>
              <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                Platform & Destination Settings
              </h2>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
              {settingsFeedback && (
                <div style={{ padding: '0.8rem 1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  {settingsFeedback}
                </div>
              )}

              <form onSubmit={handleSaveSettings}>
                {/* DISCORD URL */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Official Discord Invitation URL (Payment & Client Communications)
                  </label>
                  <p style={{ fontSize: '0.8rem', color: '#A4A4AE', marginBottom: '0.5rem' }}>
                    When clients click "Discuss Payment", this exact Discord link opens in a new tab.
                  </p>
                  <input
                    type="url"
                    required
                    value={settingsForm.discord_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, discord_url: e.target.value })}
                    className="input-field"
                    placeholder="https://discord.gg/your-agency-link"
                  />
                </div>

                {/* INSTAGRAM URL */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Official Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.instagram_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* REGISTRATION TOGGLE */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Client Self-Registration Policy
                  </label>
                  <select
                    value={settingsForm.registration_open}
                    onChange={(e) => setSettingsForm({ ...settingsForm, registration_open: e.target.value })}
                    className="input-field"
                  >
                    <option value="true">Open (Clients may register accounts freely)</option>
                    <option value="false">Closed (By inquiry or admin creation only)</option>
                  </select>
                </div>

                {/* AGENCY EMAIL */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Primary Studio Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.agency_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, agency_email: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* SITE ANNOUNCEMENT */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: '#F5F4F2', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Site Announcement / Commission Notice
                  </label>
                  <input
                    type="text"
                    value={settingsForm.site_announcement}
                    onChange={(e) => setSettingsForm({ ...settingsForm, site_announcement: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Now accepting commissions for Q4 & 2027"
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                  Save Platform Configuration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECTION 10: AUDIT TRAIL */}
        {activeSection === 'audit' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-mono">ACCOUNTABILITY</span>
              <h2 style={{ fontSize: '1.85rem', color: '#F5F4F2', marginTop: '0.4rem' }}>
                System Audit & Security Logs ({auditLogs.length})
              </h2>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#FFD400', fontFamily: 'var(--font-mono)' }}>
                    <th style={{ padding: '0.75rem' }}>Timestamp</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                    <th style={{ padding: '0.75rem' }}>Actor</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Target</th>
                    <th style={{ padding: '0.75rem' }}>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#A4A4AE' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.created_at}</td>
                      <td style={{ padding: '0.75rem', color: '#F5F4F2', fontWeight: 600 }}>{log.action}</td>
                      <td style={{ padding: '0.75rem' }}>{log.user_email}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.role}</td>
                      <td style={{ padding: '0.75rem' }}>{log.target_type} #{log.target_id || '-'}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREATE INVOICE */}
      <AnimatePresence>
        {showCreateInvoiceModal && (
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
            onClick={() => setShowCreateInvoiceModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '550px', width: '100%', background: '#101014', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '1.25rem' }}>
                Create Client Invoice
              </h3>

              <form onSubmit={handleCreateInvoice}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Select Client *
                  </label>
                  <select
                    required
                    value={newInvoice.client_id}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_id: e.target.value })}
                    className="input-field"
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Invoice Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Identity Refresh Phase 1"
                    value={newInvoice.title}
                    onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Amount (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newInvoice.amount_item}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount_item: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Payment Notes / Wire Coordinates
                  </label>
                  <textarea
                    rows={2}
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateInvoiceModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Issue Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE RECEIPT */}
      <AnimatePresence>
        {showCreateReceiptModal && (
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
            onClick={() => setShowCreateReceiptModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '550px', width: '100%', background: '#101014', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '0.4rem' }}>
                Issue Verified Payment Receipt
              </h3>
              <p style={{ color: '#A4A4AE', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Only generate this receipt after verifying settlement in studio accounts.
              </p>

              <form onSubmit={handleCreateReceipt}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Select Invoice *
                  </label>
                  <select
                    required
                    value={newReceipt.invoice_id}
                    onChange={(e) => {
                      const selected = invoices.find((inv) => String(inv.id) === e.target.value);
                      setNewReceipt({
                        ...newReceipt,
                        invoice_id: e.target.value,
                        amount_paid: selected ? selected.total : newReceipt.amount_paid,
                      });
                    }}
                    className="input-field"
                  >
                    <option value="">-- Choose Invoice to Settle --</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} - {inv.title} (${inv.total}) [{inv.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Settled Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newReceipt.amount_paid}
                    onChange={(e) => setNewReceipt({ ...newReceipt, amount_paid: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Confirmed Payment Channel / Method
                  </label>
                  <input
                    type="text"
                    required
                    value={newReceipt.payment_method}
                    onChange={(e) => setNewReceipt({ ...newReceipt, payment_method: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Audit Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newReceipt.verification_notes}
                    onChange={(e) => setNewReceipt({ ...newReceipt, verification_notes: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateReceiptModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ background: '#10B981' }}>
                    Issue Verified Receipt
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE TEAM MEMBER */}
      <AnimatePresence>
        {showCreateTeamModal && (
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
            onClick={() => setShowCreateTeamModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '520px', width: '100%', background: '#101014', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '1.25rem' }}>
                Add Production Team Member
              </h3>

              <form onSubmit={handleCreateTeamMember}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newTeam.email}
                    onChange={(e) => setNewTeam({ ...newTeam, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Temporary Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newTeam.password}
                    onChange={(e) => setNewTeam({ ...newTeam, password: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Role Assignment *
                  </label>
                  <select
                    value={newTeam.role}
                    onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                    className="input-field"
                  >
                    <option value="project_manager">Project Manager</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="video_editor">Video Editor</option>
                    <option value="admin">Administrator</option>
                    <option value="team_member">Team Specialist</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateTeamModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE PROJECT */}
      <AnimatePresence>
        {showCreateProjectModal && (
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
            onClick={() => setShowCreateProjectModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ maxWidth: '550px', width: '100%', background: '#101014', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.4rem', color: '#F5F4F2', marginBottom: '1.25rem' }}>
                Create New Project Commission
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/admin/projects', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        title: newProject.title,
                        client_id: Number(newProject.client_id),
                        service: newProject.service,
                        description: newProject.description,
                        assigned_pm_id: newProject.assigned_pm_id ? Number(newProject.assigned_pm_id) : null,
                        budget: Number(newProject.budget),
                        deadline: newProject.deadline,
                        status: 'Approved',
                      }),
                    });
                    if (!res.ok) throw new Error('Failed to create project');
                    setShowCreateProjectModal(false);
                    refreshAllData();
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Commission Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Client *
                    </label>
                    <select
                      required
                      value={newProject.client_id}
                      onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
                      className="input-field"
                    >
                      <option value="">-- Choose Client --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Service *
                    </label>
                    <select
                      value={newProject.service}
                      onChange={(e) => setNewProject({ ...newProject, service: e.target.value })}
                      className="input-field"
                    >
                      {[
                        'Video Editing',
                        'Graphic Design',
                        'Digital Marketing',
                        'Web Development',
                        'Minecraft Development',
                        'Videography',
                        'Photography',
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                    Brief Scope Description
                  </label>
                  <textarea
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#F5F4F2', marginBottom: '0.3rem' }}>
                      Target Deadline
                    </label>
                    <input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateProjectModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
