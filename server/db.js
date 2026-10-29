import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'onlyfreelancer.sqlite');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  // 1. Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner', 'admin', 'project_manager', 'designer', 'video_editor', 'developer', 'team_member', 'client')),
      phone TEXT,
      company TEXT,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Inquiries
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      service TEXT NOT NULL,
      budget TEXT,
      deadline TEXT,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'converted', 'archived')),
      converted_project_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      client_id INTEGER NOT NULL REFERENCES users(id),
      service TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Inquiry Received' CHECK(status IN (
        'Inquiry Received',
        'Under Discussion',
        'Approved',
        'In Progress',
        'In Review',
        'Revision Requested',
        'Completed',
        'Cancelled'
      )),
      assigned_pm_id INTEGER REFERENCES users(id),
      assigned_member_id INTEGER REFERENCES users(id),
      budget REAL DEFAULT 0,
      deadline TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Project Milestones
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
      completed_at DATETIME
    );
  `);

  // 5. Project Files / Deliverables
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      uploader_id INTEGER NOT NULL REFERENCES users(id),
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      category TEXT DEFAULT 'deliverable' CHECK(category IN ('brief', 'work_in_progress', 'deliverable', 'receipt_proof')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Invoices
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      project_id INTEGER REFERENCES projects(id),
      client_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      line_items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'Draft' CHECK(status IN ('Draft', 'Issued', 'Awaiting Payment', 'Paid', 'Overdue', 'Cancelled')),
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Receipts (verified payments only)
  db.exec(`
    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_number TEXT UNIQUE NOT NULL,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id),
      client_id INTEGER NOT NULL REFERENCES users(id),
      amount_paid REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      payment_method TEXT DEFAULT 'Independent Verification / Discord Confirmed',
      verification_notes TEXT,
      verified_by_id INTEGER NOT NULL REFERENCES users(id),
      verified_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Services
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      starting_price TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );
  `);

  // 9. Portfolio Items
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      client_display TEXT NOT NULL,
      description TEXT NOT NULL,
      deliverables_summary TEXT NOT NULL,
      tags TEXT NOT NULL,
      image_url TEXT NOT NULL,
      featured INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Audit Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_email TEXT,
      role TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if admin user exists
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (!existingUser) {
    const adminPassHash = bcrypt.hashSync('AdminSecure2026!', 10);
    const teamPassHash = bcrypt.hashSync('TeamSecure2026!', 10);
    const clientPassHash = bcrypt.hashSync('ClientSecure2026!', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, name, role, phone, company)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Owner / Administrator
    insertUser.run(
      'admin@onlyfreelancer.com',
      adminPassHash,
      'Executive Director',
      'owner',
      '+1 (800) 555-0199',
      'ONLY FREELANCER Studio'
    );

    // Project Manager
    insertUser.run(
      'pm@onlyfreelancer.com',
      teamPassHash,
      'Elena Vance',
      'project_manager',
      '+1 (800) 555-0198',
      'ONLY FREELANCER Team'
    );

    // Senior Developer
    insertUser.run(
      'dev@onlyfreelancer.com',
      teamPassHash,
      'Marcus Chen',
      'developer',
      '+1 (800) 555-0197',
      'ONLY FREELANCER Team'
    );

    // Lead Video Editor
    insertUser.run(
      'editor@onlyfreelancer.com',
      teamPassHash,
      'Sophia Rivera',
      'video_editor',
      '+1 (800) 555-0196',
      'ONLY FREELANCER Team'
    );

    // Sample Client
    const clientRes = insertUser.run(
      'client@apex.com',
      clientPassHash,
      'Alex Mercer',
      'client',
      '+1 (800) 555-0195',
      'Apex Horizon Media'
    );
    const sampleClientId = Number(clientRes.lastInsertRowid);

    // Seed Initial Settings
    const insertSetting = db.prepare(`INSERT OR REPLACE INTO settings (key, value, description) VALUES (?, ?, ?)`);
    insertSetting.run('discord_url', 'https://discord.gg/onlyfreelancer', 'Configured Discord invitation URL for payment discussions');
    insertSetting.run('instagram_url', 'https://www.instagram.com/only.freelancer?dlrf=ZDNlZDc0MzIxNw==', 'Official Instagram profile');
    insertSetting.run('registration_open', 'true', 'Whether client registration is open to the public');
    insertSetting.run('agency_email', 'contact@onlyfreelancer.com', 'Primary agency contact address');
    insertSetting.run('agency_phone', '+1 (555) 019-2834', 'Primary contact phone');
    insertSetting.run('site_announcement', 'Welcome to ONLY FREELANCER — Now accepting creative commissions for Q4 & 2027.', 'Homepage top ticker or announcement');

    // Seed the 7 Core Services
    const insertService = db.prepare(`
      INSERT INTO services (slug, name, category, tagline, description, deliverables, starting_price, icon_name, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertService.run(
      'video-editing',
      'Video Editing',
      'Production',
      'High-impact cinematic post-production & rhythm storytelling',
      'Broadcast-quality video editing tailored for YouTube epics, luxury brand commercials, fast-paced reels, and cinematic trailers. We orchestrate sound design, motion graphics, and color grading into seamless visual narratives.',
      JSON.stringify(['4K / 8K Master Deliverables', 'Custom Sound Design & Foley', 'Davinci Resolve Color Grade', 'Vertical Cuts (9:16 & 1:1)', 'Project Source Files & Assets']),
      '$800',
      'Film',
      1
    );

    insertService.run(
      'graphic-design',
      'Graphic Design',
      'Identity',
      'Editorial identities, visual systems & bespoke brand assets',
      'Bold typographic systems, visual identities, merchandise design, digital collaterals, and high-conversion social assets created with sharp aesthetics and structural hierarchy.',
      JSON.stringify(['Brand Identity Guidelines', 'Vector Logos & Marks', 'Social Media Design Kit', 'Print-Ready Vector Files', 'Typography & Palette System']),
      '$650',
      'Palette',
      2
    );

    insertService.run(
      'digital-marketing',
      'Digital Marketing',
      'Growth',
      'Data-backed creative campaigns and community growth strategies',
      'Performance creative testing, organic storytelling campaigns, audience acquisition funnels, and Discord / social community architecture engineered for sustainable engagement.',
      JSON.stringify(['Campaign Strategy Roadmap', 'Ad Creative Asset Bundles', 'A/B Testing Framework', 'Community Funnel Architecture', 'Monthly Analytics & KPI Audit']),
      '$1,200',
      'TrendingUp',
      3
    );

    insertService.run(
      'web-development',
      'Web Development',
      'Engineering',
      'Awwwards-grade digital experiences, web apps & portals',
      'Ultra-responsive, performance-tuned web applications built with modern frontend frameworks, bespoke motion design, and enterprise-grade backend architectures with real data security.',
      JSON.stringify(['Custom Interactive Frontend', 'Secure Node/Express Backend', 'Client & Admin Dashboards', 'SEO & Performance 99+ Scores', 'Responsive Mobile-First Architecture']),
      '$2,500',
      'Code',
      4
    );

    insertService.run(
      'minecraft-development',
      'Minecraft Development',
      'Gaming',
      'Custom Spigot/Paper plugins, bespoke network mechanics & worlds',
      'Specialized game systems development: proprietary Java plugins, packet-level network optimization, custom GUI interfaces, MMORPG systems, and tailored server lobby environments.',
      JSON.stringify(['Custom Java Plugins (Spigot/Paper)', 'Database Integration (MySQL/SQLite)', 'Optimized Tick/TPS Profiling', 'Custom Resource Pack / Items', 'Full Documentation & Source Code']),
      '$950',
      'Gamepad2',
      5
    );

    insertService.run(
      'videography',
      'Videography',
      'Cinematography',
      'On-location production, multi-cam directing & dynamic coverage',
      'Professional on-set filming with cinema cameras, gimbal stabilization, bespoke lighting design, and creative directing for brand films, event highlights, and studio sessions.',
      JSON.stringify(['Raw Cinema Footage Transfer', 'Director-Cut Storyboard', 'Multi-Cam Synchronization', 'High-Fidelity Audio Capture', 'Location Scout & Shoot Plan']),
      '$1,500',
      'Video',
      6
    );

    insertService.run(
      'photography',
      'Photography',
      'Visual Arts',
      'Commercial studio photography, editorial portraits & product captures',
      'High-end photography capturing sharp textures, deliberate lighting, and distinctive perspectives. Perfect for luxury e-commerce, executive portraits, and lifestyle editorial.',
      JSON.stringify(['Full-Resolution Retouched RAW/TIFF', 'Commercial License Rights', 'Studio / Location Lighting Set', 'Web-Optimized Responsive WebP Sets', 'Color Calibration Matrix']),
      '$700',
      'Camera',
      7
    );

    // Seed Honest Portfolio Items (Clearly identified as Agency Showcase Demos)
    const insertPortfolio = db.prepare(`
      INSERT INTO portfolio_items (title, slug, category, client_display, description, deliverables_summary, tags, image_url, featured, is_demo, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPortfolio.run(
      'KRONOS // Cinematic Sound & Visual Showcase',
      'kronos-visual-showcase',
      'Video Editing',
      'Demo Concept // Studio Showcase',
      'A dark, adrenaline-fueled 90-second audiovisual concept reel featuring rapid pacing, bass-synced typographic micro-glitches, and analog grain overlays.',
      '4K 60fps Master Film, Soundscape Design, Teaser Cutdowns',
      JSON.stringify(['Video Editing', 'Sound Design', 'Motion Graphics']),
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      1
    );

    insertPortfolio.run(
      'AETHERIA // Neo-Brutalist Identity System',
      'aetheria-identity-system',
      'Graphic Design',
      'Demo Showcase // Brand Exploration',
      'A complete visual identity system built around high-contrast grotesque typography, electric violet gradients, and modular packaging specifications.',
      'Brand Book, 120+ Vector Icons, Packaging Mockups, Motion Ident',
      JSON.stringify(['Brand Identity', 'Typography', 'Visual System']),
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      2
    );

    insertPortfolio.run(
      'NEXUS PROTOCOL // High-Frequency Gaming Portal',
      'nexus-protocol-portal',
      'Web Development',
      'Demo Showcase // Web Application',
      'A cyber-themed interactive dashboard and community platform featuring real-time player leaderboards, 60fps canvas particle field, and Discord SSO integration.',
      'React SPA, Node.js API, Realtime WebSockets, Custom Shaders',
      JSON.stringify(['Web Development', 'Motion UI', 'Architecture']),
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      3
    );

    insertPortfolio.run(
      'OBSIDIAN DUNGEON // Custom Java Mechanics Engine',
      'obsidian-dungeon-engine',
      'Minecraft Development',
      'Demo Showcase // Minecraft Network Architecture',
      'A proprietary Paper 1.20+ plugin suite delivering instanced dungeon generation, custom weapon ability matrices, and tick-optimized entity pathfinding.',
      '5 Custom Plugins, MySQL Data Sync, 20 TPS Sustained with 150 Players',
      JSON.stringify(['Minecraft Development', 'Java', 'Performance']),
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      4
    );

    insertPortfolio.run(
      'LUMEN // Atmospheric Studio Editorial',
      'lumen-studio-editorial',
      'Photography',
      'Demo Showcase // Light Study',
      'A high-contrast monochrome and tungsten studio photoshoot highlighting minimalist industrial architecture, glass refractions, and precision materials.',
      '30 Curated Retouched Masters, Lookbook Layout, Color Lookup Tables',
      JSON.stringify(['Photography', 'Lighting', 'Editorial']),
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      5
    );

    insertPortfolio.run(
      'SYNAPSE // Organic Community Growth Campaign',
      'synapse-growth-campaign',
      'Digital Marketing',
      'Demo Showcase // Creative Marketing',
      'Viral short-form video strategy and Discord community onboarding funnel designed to maximize member retention and high-value conversion.',
      '30 Short-form Video Scripts, Discord Server Setup, Funnel Analytics',
      JSON.stringify(['Digital Marketing', 'Funnel Design', 'Social Strategy']),
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      1,
      1,
      6
    );

    // Seed Sample Project for Client Alex Mercer
    const insertProject = db.prepare(`
      INSERT INTO projects (title, client_id, service, description, status, assigned_pm_id, assigned_member_id, budget, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const projectRes = insertProject.run(
      'Apex Horizon Brand Overhaul & Web Platform',
      sampleClientId,
      'Web Development',
      'Comprehensive digital overhaul including a brand identity refresh, high-performance web platform, and interactive client portal.',
      'In Progress',
      2, // Elena Vance (PM)
      3, // Marcus Chen (Dev)
      4200,
      '2026-12-15'
    );
    const sampleProjectId = Number(projectRes.lastInsertRowid);

    // Milestones for the sample project
    const insertMilestone = db.prepare(`
      INSERT INTO project_milestones (project_id, title, description, due_date, status, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertMilestone.run(
      sampleProjectId,
      'Discovery & Architectural Blueprint',
      'Initial strategy session, user journey mapping, and technical requirements documentation.',
      '2026-11-05',
      'completed',
      '2026-11-04 14:30:00'
    );

    insertMilestone.run(
      sampleProjectId,
      'Interactive Design System & Prototypes',
      'Figma design tokens, dark-mode wireframes, and cinematic component interaction states.',
      '2026-11-20',
      'in_progress',
      null
    );

    insertMilestone.run(
      sampleProjectId,
      'Full-Stack Frontend & Backend Integration',
      'Vite/React interactive views connected to authenticated REST API endpoints.',
      '2026-12-05',
      'pending',
      null
    );

    insertMilestone.run(
      sampleProjectId,
      'Final QA, Security Hardening & Handover',
      'Lighthouse audit, penetration testing, cross-browser validation, and team training.',
      '2026-12-15',
      'pending',
      null
    );

    // Seed Sample Invoice
    const insertInvoice = db.prepare(`
      INSERT INTO invoices (invoice_number, project_id, client_id, title, line_items, subtotal, tax, total, currency, status, issue_date, due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleItems = [
      { description: 'Phase 1: Architecture & Brand Blueprint', quantity: 1, unit_price: 1500, total: 1500 },
      { description: 'Phase 2: Interactive Design System Deposit', quantity: 1, unit_price: 1500, total: 1500 }
    ];

    const invoiceRes = insertInvoice.run(
      'INV-2026-001',
      sampleProjectId,
      sampleClientId,
      'Apex Horizon Phase 1 & 2 Execution',
      JSON.stringify(sampleItems),
      3000,
      0,
      3000,
      'USD',
      'Paid',
      '2026-10-15',
      '2026-10-30',
      'Payment verified via independent bank wire transfer. Official receipt issued.'
    );
    const sampleInvoiceId = Number(invoiceRes.lastInsertRowid);

    // Seed Sample Verified Receipt
    const insertReceipt = db.prepare(`
      INSERT INTO receipts (receipt_number, invoice_id, client_id, amount_paid, currency, payment_method, verification_notes, verified_by_id, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertReceipt.run(
      'REC-2026-001',
      sampleInvoiceId,
      sampleClientId,
      3000,
      'USD',
      'Verified Bank Wire // Ref: #WIRE-88921',
      'Confirmed in studio operating account by Executive Director. Clean settlement.',
      1, // Admin / Owner
      '2026-10-20 16:45:00'
    );

    // Seed Sample Awaiting Payment Invoice for demonstration
    const sampleItemsPending = [
      { description: 'Phase 3: Production Engineering & System Deployment', quantity: 1, unit_price: 1200, total: 1200 }
    ];
    insertInvoice.run(
      'INV-2026-002',
      sampleProjectId,
      sampleClientId,
      'Apex Horizon Phase 3 Production Milestone',
      JSON.stringify(sampleItemsPending),
      1200,
      0,
      1200,
      'USD',
      'Awaiting Payment',
      '2026-10-25',
      '2026-11-10',
      'To discuss payment or obtain wire routing coordinates, click Discuss Payment to open our verified Discord channel.'
    );

    // Seed initial Audit Log entry
    const insertAudit = db.prepare(`
      INSERT INTO audit_logs (user_id, user_email, role, action, target_type, target_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAudit.run(
      1,
      'admin@onlyfreelancer.com',
      'owner',
      'SYSTEM_INITIALIZED',
      'system',
      '0',
      'ONLY FREELANCER platform initialized with encrypted database and verified seed accounts.',
      '127.0.0.1'
    );
  }
}
