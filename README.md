# 🛡️ Safex - Safety Management System

**EMVEESS INFRAVENTURES PVT.LTD** — Vendor Partner | Tata Steel Ltd

A mobile-first safety management web application for industrial safety reporting, incident tracking, and workforce management.

## 🚀 Features

- **Safety Reporting** — Near Miss, Hazard, Safety Observation, Feedback, Grievances, Suggestions, Speak Up
- **Officer Dashboard** — Live review desk for safety officers with RCA & CAPA tools
- **Employee Search** — Profile lookup with plant-based access control
- **Safety Dashboard** — Lagging & Leading indicators with monthly trend charts
- **Training Management** — Schedule training, track attendees, assessments
- **Document Vault** — SOP, JHA, MSDS, Policies library
- **Safety Alerts** — LTI, FATAL, Global alerts broadcasting
- **Reward Wall** — Recognize top safety performers
- **DM Conduct** — Direct link to Google Apps Script for Daily Meeting management
- **Multi-theme** — Light, Dark & Premium modes
- **Multi-language** — English / Hindi toggle

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5 + Tailwind CSS** | Mobile-first responsive UI |
| **Lucide Icons** | Clean iconography |
| **Supabase** | Backend database & authentication |
| **Google Apps Script** | DM (Daily Meeting) form backend |
| **GitHub Pages** | Static hosting |

## 📁 Project Structure

```
├── index.html              # Main public app (single-page)
├── officer-dashboard.html  # Officer command center
├── app.js                  # Core application logic
├── db.js                   # Supabase database connection
├── package.json            # Node.js dependencies
├── system-design.md        # Architecture guidelines
└── README.md               # This file
```

## 🚀 Deployment on GitHub Pages

### 1️⃣ Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Safex Safety Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2️⃣ Enable GitHub Pages

1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 3️⃣ Supabase Setup

Create these tables in your Supabase project:

```sql
-- Safety Reports
CREATE TABLE safety_reports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  report_type TEXT NOT NULL,
  worker_name TEXT NOT NULL,
  employee_id TEXT,
  department TEXT,
  location TEXT,
  date_time TIMESTAMPTZ,
  description TEXT NOT NULL,
  immediate_action TEXT,
  severity_rating TEXT,
  photo_base64 TEXT,
  action_status TEXT DEFAULT 'Open',
  status TEXT DEFAULT 'Open',
  why_why_analysis TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Profiles
CREATE TABLE employee_profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  blood_group TEXT,
  medical_fitness_status TEXT,
  gate_pass_expiry TEXT,
  last_induction_date TEXT,
  active_plant_id TEXT NOT NULL
);

-- Vault Tables (Audits, Training, Rewards, Alerts, Circulars, Events, Gallery, Library)
CREATE TABLE vault_audits (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, audit_type TEXT NOT NULL, ...);
CREATE TABLE vault_training (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, topic TEXT NOT NULL, ...);
CREATE TABLE vault_rewards (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, employee_name TEXT NOT NULL, ...);
CREATE TABLE vault_alerts (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, category TEXT NOT NULL, ...);
CREATE TABLE vault_circulars (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title TEXT NOT NULL, ...);
CREATE TABLE vault_events (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, event_name TEXT NOT NULL, ...);
CREATE TABLE vault_gallery (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title TEXT NOT NULL, ...);
CREATE TABLE vault_library (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, doc_type TEXT NOT NULL, ...);
```

## 🔐 Security Notes

- Supabase **anon key** is public (visible in browser) — enable **RLS (Row Level Security)** for production
- Officer login uses **whitelisted IDs** stored in-app
- Never expose **service_role key** client-side

## 📱 Mobile-First Design

Optimized for **max-width: 480px** (mobile) with responsive layout. Works on all modern browsers.

## 👨‍💻 Created By

**Safexindia.in** — Powered by EMVEESS INFRAVENTURES PVT.LTD  
📧 scm@emvs.in  
© Copyright Reserved 2026 © Musahid
