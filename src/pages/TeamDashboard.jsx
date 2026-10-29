import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Upload,
  FileText,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeamDashboard({ onNavigate }) {
  const { user, token, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // File upload state
  const [uploadProjectId, setUploadProjectId] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('deliverable');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const roleLabels = {
    project_manager: 'Project Manager',
    developer: 'Full-Stack Developer',
    video_editor: 'Senior Video Editor',
    designer: 'Lead Visual Designer',
    team_member: 'Creative Specialist',
    admin: 'Administrator',
    owner: 'Executive Director',
  };

  useEffect(() => {
    if (!token) return;

    fetch('/api/team/projects', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load team projects.');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload || !uploadProjectId) return;

    setUploading(true);
    setUploadSuccess('');
    setUploadError('');

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', uploadCategory);

    try {
      const res = await fetch(`/api/team/projects/${uploadProjectId}/files`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setUploadSuccess(`Successfully uploaded '${fileToUpload.name}'`);
      setFileToUpload(null);
      setTimeout(() => {
        setUploadProjectId(null);
        setUploadSuccess('');
      }, 1500);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: '#050505' }}>
      {/* Team Top Header */}
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
              <span className="badge-mono">
                {roleLabels[user?.role] || 'Team Specialist'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#BDBDBD', fontFamily: 'var(--font-mono)' }}>
                RBAC Level: {user?.role}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.35rem', color: '#FFFFFF' }}>
              Production Workspace // <span style={{ color: '#FFD400' }}>{user?.name}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user?.role === 'owner' || user?.role === 'admin' ? (
              <button
                onClick={() => onNavigate('admin')}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
              >
                <Shield size={14} /> Open Admin Console
              </button>
            ) : null}

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
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '900px', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.45rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Assigned Production Commissions ({projects.length})
          </h2>
          <p style={{ color: '#BDBDBD', fontSize: '0.92rem' }}>
            Below are active commissions assigned to your role. Review client specifications, inspect briefs, and submit deliverables.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111111', border: '1px solid #292929' }}>
            <FolderKanban size={48} color="#7A7A7A" style={{ margin: '0 auto 1.2rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>No Active Assignments</h3>
            <p style={{ color: '#BDBDBD', fontSize: '0.9rem' }}>You currently have no projects assigned to your queue.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-card"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#111111', border: '1px solid #292929' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge-mono">{proj.service}</span>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#FFD400', background: 'rgba(255, 212, 0, 0.08)', border: '1px solid rgba(255, 212, 0, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Status: {proj.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setUploadProjectId(proj.id)}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                  >
                    <Upload size={14} color="#FFD400" /> Upload Deliverable / WIP File
                  </button>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#BDBDBD', lineHeight: 1.55 }}>
                    {proj.description || 'No detailed brief description provided.'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    background: '#161616',
                    border: '1px solid #292929',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#BDBDBD',
                  }}
                >
                  <div>Client: <strong style={{ color: '#FFFFFF' }}>{proj.client_name}</strong> ({proj.client_company || 'Private'})</div>
                  <div>Lead PM: <strong style={{ color: '#FFFFFF' }}>{proj.pm_name || 'Executive Oversight'}</strong></div>
                  <div>Deadline: <strong style={{ color: '#FFD400' }}>{proj.deadline || 'Flexible'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      <AnimatePresence>
        {uploadProjectId && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(5, 5, 5, 0.92)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setUploadProjectId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{
                maxWidth: '520px',
                width: '100%',
                background: '#111111',
                border: '1px solid #292929',
                padding: '2rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Upload Project Asset
              </h3>
              <p style={{ color: '#BDBDBD', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Uploaded files are stored on server storage and accessible to authorized clients and team members. Max 25 MB.
              </p>

              {uploadSuccess && (
                <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: '8px', marginBottom: '1.2rem' }}>
                  {uploadSuccess}
                </div>
              )}

              {uploadError && (
                <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.2rem' }}>
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleFileUpload}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 600 }}>
                    File Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="deliverable">Final Deliverable (Client Downloadable)</option>
                    <option value="work_in_progress">Work In Progress Preview</option>
                    <option value="brief">Project Reference / Brief</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Select File
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setFileToUpload(e.target.files[0])}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#161616',
                      border: '1px dashed #292929',
                      borderRadius: '8px',
                      color: '#BDBDBD',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setUploadProjectId(null)}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    {uploading ? 'Uploading Asset...' : 'Upload File'}
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
