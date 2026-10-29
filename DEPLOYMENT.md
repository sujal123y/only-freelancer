# ONLY FREELANCER // Hosting & Deployment Guide

This guide details how to run **ONLY FREELANCER** both **locally** on your computer and **live** on the public internet.

---

## ⚡ Active Instances Right Now

Your project is currently active and reachable at both locations:

| Environment | URL | Status | Details |
| :--- | :--- | :--- | :--- |
| **Local Host** | `http://localhost:5000` | 🟢 Active | Unified Node.js API + compiled Vite frontend |
| **Live Public Host** | `https://midnight-temporary-climate-collected.trycloudflare.com` | 🟢 Active | SSL-secured worldwide public URL |

---

## 🔑 Default Seed Credentials

All accounts are pre-seeded in the SQLite database (`data/onlyfreelancer.sqlite`):

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Executive Director (Owner)** | `admin@onlyfreelancer.com` | `AdminSecure2026!` | Full Admin Panel, Financial Metrics, Team, Settings |
| **Project Manager** | `pm@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestone tracking, File deliverables |
| **Developer** | `dev@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestone tracking, Deliverables |
| **Lead Video Editor** | `editor@onlyfreelancer.com` | `TeamSecure2026!` | Team Workspace, Milestone tracking, Deliverables |
| **Sample Client** | `client@apex.com` | `ClientSecure2026!` | Client Portal, Milestones, Invoices, Verified Receipts |

---

## 🚀 Option 1: 1-Click Launchers (Windows)

We have created double-clickable scripts inside the project directory:

1. **`start-local.bat`**
   - Automatically builds the frontend if needed.
   - Starts the server on `http://localhost:5000`.

2. **`start-live-tunnel.bat`**
   - Starts an instant Cloudflare Tunnel pointing to your local port 5000.
   - Generates a free HTTPS URL accessible from any device or phone worldwide without opening ports.

3. **`start-both.bat`**
   - Launches both the local server and the live Cloudflare tunnel simultaneously in a single command.

---

## 🛠️ Option 2: Terminal / CLI Commands

You can run these commands from PowerShell or Command Prompt:

### 1. Run Locally (Production Mode)
```bash
npm.cmd run build
npm.cmd start
```
> Server opens on `http://localhost:5000`.

### 2. Run Locally (Hot-Reload Dev Mode)
```bash
npm.cmd run dev
```
> Runs Express API on `http://localhost:5000` and Vite dev server on `http://localhost:5173`.

### 3. Expose Live via Cloudflare Tunnel
```bash
npx.cmd cloudflared tunnel --url http://localhost:5000
```

### 4. Run Both Together
```bash
npm.cmd run live
```

---

## ☁️ Option 3: Permanent 24/7 Cloud Hosting (Render, Railway, Fly.io, VPS)

If you want the website to stay online 24/7 even when your PC is turned off:

### Deploying to Render.com (Free Tier):
1. Push your repository to GitHub (or upload the folder).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select your repository. Render will automatically detect `render.yaml` or you can configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Disk**: Add a persistent disk mounted to `/app/data` (to preserve SQLite database and uploads).
4. Click **Deploy Web Service**. You will receive an official permanent domain (e.g. `https://onlyfreelancer.onrender.com`).

### Deploying with Docker:
The repository includes a production-ready multi-stage `Dockerfile`:
```bash
docker build -t onlyfreelancer .
docker run -d -p 5000:5000 -v $(pwd)/data:/app/data -v $(pwd)/uploads:/app/uploads onlyfreelancer
```
