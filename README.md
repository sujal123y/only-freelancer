# ONLY FREELANCER // World-Class Creative & Digital Production Studio

> **"A CREATIVE UNIVERSE BUILT IN BLACK, LIT BY YELLOW."**

An award-worthy digital experience for **ONLY FREELANCER**, combining the aesthetic quality of an elite creative studio, the precision of a modern technology company, and the sovereign personality of an independent creative agency.

---

## ⚡ Live Experiences

- **Live Production Preview**: [https://midnight-temporary-climate-collected.trycloudflare.com](https://midnight-temporary-climate-collected.trycloudflare.com)
- **GitHub Pages**: Deployed via GitHub Actions workflow (`.github/workflows/deploy.yml`)

---

## ✨ Features & Architecture

### 1. Brand Identity & Design System
- **Mandatory Color Palette**: `#000000` (Primary Black), `#050505` (Main Canvas), `#101010` / `#171717` (Elevated Surfaces), `#FFFFFF` (Contrast Text), `#BDBDBD` (Secondary Text), `#FFD400` (Golden Yellow Accent), `#FFE45C` (Hover Highlight), `#292929` (Subtle Borders).
- **Typography Hierarchy**: *Syne* for oversized editorial display headings, *Plus Jakarta Sans* for modern interface readability, and *JetBrains Mono* for technical metrics and status chips.

### 2. Cinematic 3D Centerpiece (Three.js WebGL)
- Bespoke obsidian faceted kinetic polyhedron sculpture with physically-based rendering (`MeshPhysicalMaterial`).
- Nested golden gyroscopic orbital rings with realistic metallic reflections and warm emissive light.
- Smooth mouse-following parallax, scroll-driven rotation, non-blocking UI integration (`pointer-events: none`), and graceful SVG fallback for non-WebGL environments.

### 3. Realistic Deep Space Galaxy Engine
- 2,500+ astronomical temperature-mapped stars (crisp diamond white and warm gold).
- Volumetric golden interstellar dust lanes and subtle nebulae on deep black space.
- Delicate shooting stars with hypersonic burn trails and subtle twinkle intervals.

### 4. 5-Second Branded Cinematic Opening Sequence
- Dynamic canvas starfield, golden laser horizon scan, kinetic monogram emergence, and refined typography reveal with Skip Intro and `prefers-reduced-motion` compliance.

### 5. Seven Core Creative Disciplines
1. **Video Editing**: Cinematic post-production, sound design, Davinci Resolve grading, vertical cutdowns.
2. **Graphic Design**: Editorial identities, visual systems, packaging, typography guidelines.
3. **Digital Marketing**: Audience acquisition funnels, viral short-form strategy, community onboarding.
4. **Web Development**: Awwwards-grade interactive frontends, responsive design, Node/Express backends, SQLite.
5. **Minecraft Development**: Low-latency Java plugins (Paper/Spigot), packet protocol tuning, custom network mechanics.
6. **Videography**: Cinema camera directing, gimbal stabilization, lighting design, high-fidelity audio capture.
7. **Photography**: Commercial studio lighting, editorial portraits, tethered RAW captures, color calibration.

### 6. Client Hub, Team Workspace & Admin Management Suite
- **Client Portal**: Track project milestones, download approved deliverables, view invoices, download verified receipts, and coordinate payments via official Discord channel.
- **Team Workspace**: Role-based access control (RBAC) matrix for Project Managers, Developers, Video Editors, and Designers.
- **Admin Management Suite**: Inquiries pipeline, project management, client records, invoice creation, verified receipt issuance, settings management, and audit logging.

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Owner / Executive Director** | `admin@onlyfreelancer.com` | `AdminSecure2026!` | Full Admin Panel, Inquiries, Financials, Settings, Audit Logs |
| **Project Manager** | `pm@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestone Tracking, Deliverables |
| **Full-Stack Developer** | `dev@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestones, Project Deliverables |
| **Senior Video Editor** | `editor@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestones, Project Deliverables |
| **Sample Client** | `client@apex.com` | `ClientSecure2026!` | Client Portal, Milestones, Invoices, Verified Receipts |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/only-freelancer.git
cd only-freelancer

# Install dependencies
npm install

# Build the production frontend
npm run build

# Start the unified server (API + Frontend on port 5000)
npm start
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

### Hot-Reload Development Mode
```bash
npm run dev
```
Runs the Express backend on `http://localhost:5000` and Vite development server on `http://localhost:5173`.

---

## 🌐 Deploying to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`:

1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. The site will automatically build and publish to `https://<your-username>.github.io/<repo-name>/`.

---

## ☁️ 24/7 Permanent Cloud Deployment (Render / Docker)

### Deploy to Render.com (Free Web Service)
1. In Render, select **New +** ➔ **Web Service** and connect this repository.
2. Render automatically reads `render.yaml`:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Disk**: 1 GB persistent disk mounted to `/app/data` (to preserve SQLite database).

### Deploy with Docker
```bash
docker build -t onlyfreelancer .
docker run -d -p 5000:5000 -v $(pwd)/data:/app/data -v $(pwd)/uploads:/app/uploads onlyfreelancer
```

---

## 📜 License & Ownership

Copyright © 2026 ONLY FREELANCER STUDIO. All rights reserved.
Official Discord: [https://discord.gg/onlyfreelancer](https://discord.gg/onlyfreelancer)  
Official Instagram: [@only.freelancer](https://www.instagram.com/only.freelancer?dlrf=ZDNlZDc0MzIxNw==)
