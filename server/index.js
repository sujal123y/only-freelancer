import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db, initDatabase } from './db.js';
import { generateToken, authenticate, requireRole, logAudit } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema and seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Upload directory & storage configuration
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    // Restrict potentially dangerous executables
    const blockedExts = ['.exe', '.bat', '.cmd', '.sh', '.vbs', '.ps1', '.msi'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (blockedExts.includes(ext)) {
      return cb(new Error('Executable and script file uploads are prohibited for security.'));
    }
    cb(null, true);
  },
});

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Public Configuration (Never expose secrets!)
app.get('/api/public/config', (req, res) => {
  try {
    const settingsRows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const row of settingsRows) {
      settings[row.key] = row.value;
    }
    res.json({
      discord_url: settings.discord_url || process.env.DISCORD_URL || 'https://discord.gg/onlyfreelancer',
      instagram_url: settings.instagram_url || process.env.INSTAGRAM_URL || 'https://www.instagram.com/only.freelancer?dlrf=ZDNlZDc0MzIxNw==',
      registration_open: settings.registration_open === 'true' || settings.registration_open === '1',
      agency_email: settings.agency_email || 'contact@onlyfreelancer.com',
      agency_phone: settings.agency_phone || '+1 (555) 019-2834',
      site_announcement: settings.site_announcement || '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve site configuration.' });
  }
});

// Public Services
app.get('/api/public/services', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC').all();
    const parsed = rows.map((s) => ({
      ...s,
      deliverables: JSON.parse(s.deliverables || '[]'),
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

// Public Portfolio Items
app.get('/api/public/portfolio', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM portfolio_items ORDER BY sort_order ASC').all();
    const parsed = rows.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
      is_demo: Boolean(p.is_demo),
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch portfolio showcase.' });
  }
});

// Public Project Inquiry Submission
app.post('/api/public/inquiry', (req, res) => {
  const { name, email, service, budget, deadline, description } = req.body;

  if (!name || !email || !service || !description) {
    return res.status(400).json({ error: 'Please provide all required fields: name, email, service, and project description.' });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, service, budget, deadline, description, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `);
    const result = stmt.run(name.trim(), email.trim().toLowerCase(), service, budget || 'Not specified', deadline || 'Flexible', description.trim());

    logAudit(req, 'INQUIRY_SUBMITTED', 'inquiry', result.lastInsertRowid, {
      name,
      email,
      service,
    });

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Your project inquiry has been received. Our creative team will review it and follow up promptly.',
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
  }
});

// ==========================================
// 2. AUTHENTICATION & PROFILE
// ==========================================

// Universal Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact administration.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    req.user = user;
    logAudit(req, 'LOGIN_SUCCESS', 'user', user.id, { role: user.role });

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      company: user.company,
      avatar: user.avatar,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login authentication encountered an error.' });
  }
});

// Client Registration (Client only, can never self-assign staff roles)
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, phone, company } = req.body;

  // Check if registration is open in settings
  const regSetting = db.prepare("SELECT value FROM settings WHERE key = 'registration_open'").get();
  if (regSetting && regSetting.value !== 'true' && regSetting.value !== '1') {
    return res.status(403).json({ error: 'Client registration is currently closed. Please submit an inquiry to work with us.' });
  }

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, role, phone, company)
      VALUES (?, ?, ?, 'client', ?, ?)
    `);

    const result = stmt.run(email.trim().toLowerCase(), hashed, name.trim(), phone || null, company || null);
    const newUser = db.prepare('SELECT id, email, name, role, phone, company, avatar FROM users WHERE id = ?').get(result.lastInsertRowid);

    const token = generateToken(newUser);
    req.user = newUser;
    logAudit(req, 'CLIENT_REGISTERED', 'user', newUser.id);

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Update Profile
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, phone, company, currentPassword, newPassword } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let passwordToSet = user.password;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      }
      passwordToSet = bcrypt.hashSync(newPassword, 10);
    }

    const stmt = db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, company = ?, password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(name || user.name, phone ?? user.phone, company ?? user.company, passwordToSet, user.id);

    const updatedUser = db.prepare('SELECT id, email, name, role, phone, company, avatar FROM users WHERE id = ?').get(user.id);
    logAudit(req, 'PROFILE_UPDATED', 'user', user.id);

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ==========================================
// 3. CLIENT DASHBOARD ENDPOINTS
// ==========================================

// Client Projects
app.get('/api/client/projects', authenticate, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*,
             pm.name as pm_name,
             mem.name as member_name
      FROM projects p
      LEFT JOIN users pm ON p.assigned_pm_id = pm.id
      LEFT JOIN users mem ON p.assigned_member_id = mem.id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch client projects.' });
  }
});

// Client Project Detail
app.get('/api/client/projects/:id', authenticate, (req, res) => {
  try {
    const project = db.prepare(`
      SELECT p.*,
             pm.name as pm_name,
             mem.name as member_name
      FROM projects p
      LEFT JOIN users pm ON p.assigned_pm_id = pm.id
      LEFT JOIN users mem ON p.assigned_member_id = mem.id
      WHERE p.id = ? AND p.client_id = ?
    `).get(req.params.id, req.user.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    const milestones = db.prepare('SELECT * FROM project_milestones WHERE project_id = ? ORDER BY id ASC').all(project.id);
    const files = db.prepare(`
      SELECT f.id, f.original_name, f.file_type, f.file_size, f.category, f.created_at, u.name as uploader_name
      FROM project_files f
      JOIN users u ON f.uploader_id = u.id
      WHERE f.project_id = ?
      ORDER BY f.created_at DESC
    `).all(project.id);

    res.json({ project, milestones, files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load project details.' });
  }
});

// Client Invoices
app.get('/api/client/invoices', authenticate, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT inv.*, p.title as project_title
      FROM invoices inv
      LEFT JOIN projects p ON inv.project_id = p.id
      WHERE inv.client_id = ?
      ORDER BY inv.created_at DESC
    `).all(req.user.id);

    const parsed = rows.map((r) => ({
      ...r,
      line_items: JSON.parse(r.line_items || '[]'),
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load invoices.' });
  }
});

// Client Receipts
app.get('/api/client/receipts', authenticate, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT r.*, inv.invoice_number, inv.title as invoice_title, u.name as verified_by_name
      FROM receipts r
      JOIN invoices inv ON r.invoice_id = inv.id
      JOIN users u ON r.verified_by_id = u.id
      WHERE r.client_id = ?
      ORDER BY r.created_at DESC
    `).all(req.user.id);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load receipts.' });
  }
});

// ==========================================
// 4. TEAM DASHBOARDS & ACCESS
// ==========================================

const teamRoles = ['owner', 'admin', 'project_manager', 'designer', 'video_editor', 'developer', 'team_member'];

// Assigned projects for team member
app.get('/api/team/projects', authenticate, requireRole(...teamRoles), (req, res) => {
  try {
    let rows;
    if (req.user.role === 'owner' || req.user.role === 'admin' || req.user.role === 'project_manager') {
      rows = db.prepare(`
        SELECT p.*, c.name as client_name, c.company as client_company,
               pm.name as pm_name, mem.name as member_name
        FROM projects p
        JOIN users c ON p.client_id = c.id
        LEFT JOIN users pm ON p.assigned_pm_id = pm.id
        LEFT JOIN users mem ON p.assigned_member_id = mem.id
        ORDER BY p.updated_at DESC
      `).all();
    } else {
      rows = db.prepare(`
        SELECT p.*, c.name as client_name, c.company as client_company,
               pm.name as pm_name, mem.name as member_name
        FROM projects p
        JOIN users c ON p.client_id = c.id
        LEFT JOIN users pm ON p.assigned_pm_id = pm.id
        LEFT JOIN users mem ON p.assigned_member_id = mem.id
        WHERE p.assigned_member_id = ? OR p.assigned_pm_id = ?
        ORDER BY p.updated_at DESC
      `).all(req.user.id, req.user.id);
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team projects.' });
  }
});

// Team Milestone Status Update
app.put('/api/team/milestones/:id', authenticate, requireRole(...teamRoles), (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'in_progress', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid milestone status.' });
  }

  try {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const stmt = db.prepare(`
      UPDATE project_milestones
      SET status = ?, completed_at = ?
      WHERE id = ?
    `);
    stmt.run(status, completedAt, req.params.id);

    logAudit(req, 'MILESTONE_STATUS_UPDATED', 'project_milestones', req.params.id, { status });
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update milestone.' });
  }
});

// Team Work File Upload
app.post('/api/team/projects/:id/files', authenticate, requireRole(...teamRoles), upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  const { category = 'deliverable' } = req.body;
  const projectId = req.params.id;

  try {
    const stmt = db.prepare(`
      INSERT INTO project_files (project_id, uploader_id, filename, original_name, file_type, file_size, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      projectId,
      req.user.id,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      category
    );

    logAudit(req, 'FILE_UPLOADED', 'project_files', result.lastInsertRowid, {
      projectId,
      filename: req.file.originalname,
      category,
    });

    res.status(201).json({
      success: true,
      file: {
        id: Number(result.lastInsertRowid),
        original_name: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        category,
      },
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to record uploaded file.' });
  }
});

// ==========================================
// 5. PRIVATE ADMIN DASHBOARD
// ==========================================

// Admin Metrics Overview
app.get('/api/admin/metrics', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const totalInquiries = db.prepare('SELECT count(*) as count FROM inquiries').get().count;
    const pendingInquiries = db.prepare("SELECT count(*) as count FROM inquiries WHERE status = 'pending'").get().count;
    const activeProjects = db.prepare("SELECT count(*) as count FROM projects WHERE status NOT IN ('Completed', 'Cancelled')").get().count;
    const completedProjects = db.prepare("SELECT count(*) as count FROM projects WHERE status = 'Completed'").get().count;
    const totalClients = db.prepare("SELECT count(*) as count FROM users WHERE role = 'client'").get().count;
    const totalTeam = db.prepare("SELECT count(*) as count FROM users WHERE role != 'client'").get().count;

    const invoicesSummary = db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'Paid' THEN total ELSE 0 END) as total_paid,
        SUM(CASE WHEN status IN ('Issued', 'Awaiting Payment') THEN total ELSE 0 END) as total_pending
      FROM invoices
    `).get();

    const verifiedReceiptsSum = db.prepare('SELECT SUM(amount_paid) as total FROM receipts').get().total || 0;

    res.json({
      totalInquiries,
      pendingInquiries,
      activeProjects,
      completedProjects,
      totalClients,
      totalTeam,
      totalPaidRevenue: invoicesSummary.total_paid || 0,
      pendingInvoicesAmount: invoicesSummary.total_pending || 0,
      verifiedReceiptsSum,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate metrics.' });
  }
});

// Admin Inquiries
app.get('/api/admin/inquiries', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// Admin Convert Inquiry to Project
app.post('/api/admin/inquiries/:id/convert', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { title, clientId, budget, deadline, pmId } = req.body;

  try {
    const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    let resolvedClientId = clientId;
    if (!resolvedClientId) {
      // Find or create client from inquiry email
      let client = db.prepare('SELECT id FROM users WHERE email = ?').get(inquiry.email);
      if (!client) {
        const tempPass = bcrypt.hashSync('ClientWelcome2026!', 10);
        const newClientRes = db.prepare(`
          INSERT INTO users (email, password, name, role)
          VALUES (?, ?, ?, 'client')
        `).run(inquiry.email, tempPass, inquiry.name);
        resolvedClientId = Number(newClientRes.lastInsertRowid);
      } else {
        resolvedClientId = client.id;
      }
    }

    const projectRes = db.prepare(`
      INSERT INTO projects (title, client_id, service, description, status, assigned_pm_id, budget, deadline)
      VALUES (?, ?, ?, ?, 'Approved', ?, ?, ?)
    `).run(
      title || `${inquiry.service} Project for ${inquiry.name}`,
      resolvedClientId,
      inquiry.service,
      inquiry.description,
      pmId || null,
      budget || 0,
      deadline || null
    );

    const newProjectId = Number(projectRes.lastInsertRowid);

    // Default milestones
    const insertMilestone = db.prepare('INSERT INTO project_milestones (project_id, title, description, status) VALUES (?, ?, ?, ?)');
    insertMilestone.run(newProjectId, 'Discovery & Asset Ingestion', 'Kickoff briefing and file transfers.', 'in_progress');
    insertMilestone.run(newProjectId, 'Creative Production Phase', 'Core design and development.', 'pending');
    insertMilestone.run(newProjectId, 'Review & Final Delivery', 'Revisions and master release.', 'pending');

    db.prepare("UPDATE inquiries SET status = 'converted', converted_project_id = ? WHERE id = ?").run(newProjectId, inquiry.id);

    logAudit(req, 'INQUIRY_CONVERTED', 'inquiries', inquiry.id, { newProjectId });
    res.status(201).json({ success: true, projectId: newProjectId });
  } catch (err) {
    console.error('Convert inquiry error:', err);
    res.status(500).json({ error: 'Failed to convert inquiry to project.' });
  }
});

// Admin Projects Management
app.get('/api/admin/projects', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*,
             c.name as client_name, c.email as client_email, c.company as client_company,
             pm.name as pm_name, mem.name as member_name
      FROM projects p
      JOIN users c ON p.client_id = c.id
      LEFT JOIN users pm ON p.assigned_pm_id = pm.id
      LEFT JOIN users mem ON p.assigned_member_id = mem.id
      ORDER BY p.created_at DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin projects.' });
  }
});

app.post('/api/admin/projects', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { title, client_id, service, description, status, assigned_pm_id, assigned_member_id, budget, deadline } = req.body;

  if (!title || !client_id || !service) {
    return res.status(400).json({ error: 'Title, client, and service are required.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO projects (title, client_id, service, description, status, assigned_pm_id, assigned_member_id, budget, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title.trim(),
      client_id,
      service,
      description || '',
      status || 'Inquiry Received',
      assigned_pm_id || null,
      assigned_member_id || null,
      budget || 0,
      deadline || null
    );

    const projectId = Number(result.lastInsertRowid);
    logAudit(req, 'PROJECT_CREATED', 'projects', projectId, { title });

    res.status(201).json({ success: true, id: projectId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

app.put('/api/admin/projects/:id', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { title, service, description, status, assigned_pm_id, assigned_member_id, budget, deadline } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE projects
      SET title = COALESCE(?, title),
          service = COALESCE(?, service),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          assigned_pm_id = ?,
          assigned_member_id = ?,
          budget = COALESCE(?, budget),
          deadline = COALESCE(?, deadline),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title || null,
      service || null,
      description || null,
      status || null,
      assigned_pm_id || null,
      assigned_member_id || null,
      budget ?? null,
      deadline || null,
      req.params.id
    );

    logAudit(req, 'PROJECT_UPDATED', 'projects', req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// Admin Clients Management
app.get('/api/admin/clients', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT u.id, u.email, u.name, u.phone, u.company, u.is_active, u.created_at,
             COUNT(DISTINCT p.id) as project_count,
             COUNT(DISTINCT inv.id) as invoice_count
      FROM users u
      LEFT JOIN projects p ON u.id = p.client_id
      LEFT JOIN invoices inv ON u.id = inv.client_id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clients.' });
  }
});

// Admin Team & Permissions Management
app.get('/api/admin/team', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, email, name, role, phone, company, is_active, created_at
      FROM users
      WHERE role != 'client'
      ORDER BY role ASC, created_at ASC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

app.post('/api/admin/team', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { email, password, name, role, phone, company } = req.body;
  const validRoles = ['admin', 'project_manager', 'designer', 'video_editor', 'developer', 'team_member'];

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Email, password, name, and role are required.' });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid team role specified.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, role, phone, company)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email.trim().toLowerCase(), hashed, name.trim(), role, phone || null, company || null);
    logAudit(req, 'TEAM_MEMBER_CREATED', 'users', result.lastInsertRowid, { role });

    res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team member.' });
  }
});

app.put('/api/admin/team/:id', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { role, is_active, name, phone } = req.body;

  try {
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    // Protect Owner role from being demoted by other admins
    if (target.role === 'owner' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only the Owner can modify the Owner account.' });
    }

    const stmt = db.prepare(`
      UPDATE users
      SET role = COALESCE(?, role),
          is_active = COALESCE(?, is_active),
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(role || null, is_active !== undefined ? Number(is_active) : null, name || null, phone || null, target.id);
    logAudit(req, 'TEAM_MEMBER_MODIFIED', 'users', target.id, { role, is_active });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update team member.' });
  }
});

// Admin Invoices Management
app.get('/api/admin/invoices', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT inv.*,
             c.name as client_name, c.email as client_email, c.company as client_company,
             p.title as project_title
      FROM invoices inv
      JOIN users c ON inv.client_id = c.id
      LEFT JOIN projects p ON inv.project_id = p.id
      ORDER BY inv.created_at DESC
    `).all();

    const parsed = rows.map((r) => ({
      ...r,
      line_items: JSON.parse(r.line_items || '[]'),
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
});

app.post('/api/admin/invoices', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { invoice_number, project_id, client_id, title, line_items, subtotal, tax = 0, currency = 'USD', status = 'Draft', issue_date, due_date, notes } = req.body;

  if (!client_id || !title || !line_items || subtotal === undefined) {
    return res.status(400).json({ error: 'Client, title, line items, and subtotal are required.' });
  }

  const generatedNumber = invoice_number || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const total = Number(subtotal) + Number(tax || 0);

  try {
    const stmt = db.prepare(`
      INSERT INTO invoices (invoice_number, project_id, client_id, title, line_items, subtotal, tax, total, currency, status, issue_date, due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      generatedNumber,
      project_id || null,
      client_id,
      title,
      JSON.stringify(line_items),
      subtotal,
      tax,
      total,
      currency,
      status,
      issue_date || new Date().toISOString().split('T')[0],
      due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes || null
    );

    logAudit(req, 'INVOICE_CREATED', 'invoices', result.lastInsertRowid, { generatedNumber, total });
    res.status(201).json({ success: true, id: Number(result.lastInsertRowid), invoice_number: generatedNumber });
  } catch (err) {
    console.error('Invoice create error:', err);
    res.status(500).json({ error: 'Failed to create invoice.' });
  }
});

app.put('/api/admin/invoices/:id', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { status, title, notes, due_date } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE invoices
      SET status = COALESCE(?, status),
          title = COALESCE(?, title),
          notes = COALESCE(?, notes),
          due_date = COALESCE(?, due_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status || null, title || null, notes || null, due_date || null, req.params.id);
    logAudit(req, 'INVOICE_UPDATED', 'invoices', req.params.id, { status });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update invoice.' });
  }
});

// Admin Receipts Management (Verified payments only!)
app.get('/api/admin/receipts', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT r.*,
             inv.invoice_number, inv.title as invoice_title,
             c.name as client_name, c.email as client_email,
             u.name as verified_by_name
      FROM receipts r
      JOIN invoices inv ON r.invoice_id = inv.id
      JOIN users c ON r.client_id = c.id
      JOIN users u ON r.verified_by_id = u.id
      ORDER BY r.created_at DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch receipts.' });
  }
});

app.post('/api/admin/receipts', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { invoice_id, amount_paid, payment_method, verification_notes } = req.body;

  if (!invoice_id || !amount_paid) {
    return res.status(400).json({ error: 'Invoice ID and verified amount paid are required.' });
  }

  try {
    const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoice_id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const receiptNumber = `REC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const stmt = db.prepare(`
      INSERT INTO receipts (receipt_number, invoice_id, client_id, amount_paid, currency, payment_method, verification_notes, verified_by_id, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      receiptNumber,
      invoice.id,
      invoice.client_id,
      amount_paid,
      invoice.currency,
      payment_method || 'Verified Independent Wire / Bank Settlement',
      verification_notes || 'Verified by Studio Administrator',
      req.user.id
    );

    // Update invoice status to 'Paid'
    db.prepare("UPDATE invoices SET status = 'Paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(invoice.id);

    logAudit(req, 'RECEIPT_ISSUED', 'receipts', result.lastInsertRowid, {
      receiptNumber,
      invoiceNumber: invoice.invoice_number,
      amount_paid,
    });

    res.status(201).json({ success: true, receipt_number: receiptNumber });
  } catch (err) {
    console.error('Receipt create error:', err);
    res.status(500).json({ error: 'Failed to issue verified receipt.' });
  }
});

// Admin Portfolio Management
app.post('/api/admin/portfolio', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { title, slug, category, client_display, description, deliverables_summary, tags, image_url, featured = 1, is_demo = 1 } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  const itemSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  try {
    const stmt = db.prepare(`
      INSERT INTO portfolio_items (title, slug, category, client_display, description, deliverables_summary, tags, image_url, featured, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      itemSlug,
      category,
      client_display || 'Agency Showcase Demo',
      description,
      deliverables_summary || '',
      JSON.stringify(tags || []),
      image_url || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      featured ? 1 : 0,
      is_demo ? 1 : 0
    );

    logAudit(req, 'PORTFOLIO_CREATED', 'portfolio_items', result.lastInsertRowid, { title });
    res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create portfolio item.' });
  }
});

// Admin Settings Management
app.get('/api/admin/settings', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

app.put('/api/admin/settings', authenticate, requireRole('owner', 'admin'), (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object is required.' });
  }

  try {
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, description) VALUES (?, ?, ?)');
    for (const [key, value] of Object.entries(settings)) {
      updateStmt.run(key, String(value), `Updated by ${req.user.name}`);
    }

    logAudit(req, 'SETTINGS_UPDATED', 'settings', null, { keys: Object.keys(settings) });
    res.json({ success: true, message: 'Settings successfully updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', authenticate, requireRole('owner', 'admin'), (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// ==========================================
// 6. SECURE FILE DOWNLOAD
// ==========================================

app.get('/api/files/:id/download', authenticate, (req, res) => {
  try {
    const file = db.prepare(`
      SELECT f.*, p.client_id
      FROM project_files f
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.id = ?
    `).get(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Role verification
    const isOwnerOrAdmin = req.user.role === 'owner' || req.user.role === 'admin';
    const isTeamMember = teamRoles.includes(req.user.role);
    const isProjectClient = file.client_id && file.client_id === req.user.id;

    if (!isOwnerOrAdmin && !isTeamMember && !isProjectClient) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to download this asset.' });
    }

    const filePath = path.join(uploadsDir, file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical file not found on server.' });
    }

    res.download(filePath, file.original_name);
  } catch (err) {
    res.status(500).json({ error: 'Download request failed.' });
  }
});

// Serve compiled frontend assets when built
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ONLY FREELANCER] API Engine operating on port ${PORT} (0.0.0.0)`);
  console.log(`[Database] SQLite synchronized with secure table boundaries.`);
});

