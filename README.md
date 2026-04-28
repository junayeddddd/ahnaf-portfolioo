# Ahnaf — Premium Digital Marketing Portfolio
## Complete Setup, Admin & Deployment Guide

---

## 📁 File Structure

```
index.html          — Main portfolio site
admin.html          — Admin panel (password protected)
css/
  style.css         — All styles & animations
js/
  site-config.js    — ⚙️ YOUR CONFIG FILE (edit this!)
  particles.js      — Background particle animation
  main.js           — All site interactivity
README.md           — This guide
```

---

## 🔐 Admin Panel

**URL:** `your-site.com/admin.html`

**Default passcode:** `Ahnaf2025!`

> ⚠️ Change this in `js/site-config.js` before going live!

### What you can do in the Admin Panel:
- **Overview dashboard** — see stats (total works, featured, by category), recent works table
- **Add New Work** — fill in title, category, video URL or upload a file, thumbnail URL or upload an image, client name, tags, featured toggle
- **Manage Works** — search, edit, delete all portfolio works with pagination
- **Setup & Config** — step-by-step Supabase connection guide, current status display

---

## ⚙️ Step 1 — Configure Your Site

Open `js/site-config.js` and update:

```javascript
window.AHNAF_CONFIG = {
  supabaseUrl:     'https://your-project.supabase.co',  // from Supabase
  supabaseAnonKey: 'eyJhbGc...',                         // from Supabase
  storageBucket:   'portfolio-media',                    // keep this name
  adminPasscode:   'YourStrongPassword!',                // CHANGE THIS
  siteName:        'Ahnaf Portfolio'
};
```

---

## 🗄️ Step 2 — Set Up Supabase (Free Backend + File Storage)

Supabase gives you a free database + file storage. Without it, data is saved to
the browser's localStorage (only works locally).

### 2a. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → Sign up free
2. Click **New Project** → give it a name, set a database password, choose a region

### 2b. Create the Database Table
1. In your project, go to **Table Editor** → **New Table**
2. Table name: `portfolio_works`
3. **Disable** Row Level Security for now (you can enable later)
4. Add these columns:

| Column Name    | Type        | Default               | Notes          |
|---------------|-------------|----------------------|----------------|
| id            | uuid        | gen_random_uuid()    | Primary key ✓  |
| title         | text        | —                    | required       |
| category      | text        | —                    |                |
| description   | text        | —                    |                |
| video_url     | text        | —                    |                |
| thumbnail_url | text        | —                    |                |
| client_name   | text        | —                    |                |
| tags          | text[]      | {}                   | array of tags  |
| featured      | bool        | false                |                |
| created_at    | timestamptz | now()                | auto           |
| updated_at    | timestamptz | now()                | auto           |

5. Click **Save**

### 2c. Create Storage Bucket
1. Go to **Storage** in the sidebar → **New Bucket**
2. Name: `portfolio-media`
3. Make it **Public** (toggle on)
4. Click **Create bucket**

### 2d. Set Storage Policy (allow uploads)
1. In Storage → `portfolio-media` → **Policies**
2. Click **New Policy** → **For full customization**
3. Policy name: `allow all`
4. Allowed operations: SELECT, INSERT, UPDATE, DELETE
5. Target roles: anon, authenticated
6. Click **Review** → **Save policy**

### 2e. Get Your API Keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy **Project URL** → paste into `supabaseUrl` in site-config.js
3. Copy **anon / public** key → paste into `supabaseAnonKey` in site-config.js

---

## 🐙 Step 3 — Upload to GitHub

### First time setup (do this once):
1. Go to [github.com](https://github.com) → Sign up or log in
2. Click **+** (top right) → **New repository**
3. Name: `ahnaf-portfolio` (or anything you like)
4. Set to **Public**
5. Click **Create repository**

### Upload your files:
**Option A — Drag & Drop (easiest):**
1. Open your repository on GitHub
2. Click **uploading an existing file** (or drag files into the page)
3. Drag ALL your files maintaining the folder structure:
   - `index.html`
   - `admin.html`
   - `css/style.css`
   - `js/site-config.js`
   - `js/particles.js`
   - `js/main.js`
4. Scroll down → type a commit message like "Initial upload"
5. Click **Commit changes**

**Option B — GitHub Desktop (recommended for future updates):**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Clone your repository to your computer
3. Copy all files into the cloned folder
4. In GitHub Desktop: write a summary → click **Commit to main** → **Push origin**

---

## 🚀 Step 4 — Deploy on Netlify (Free Hosting)

1. Go to [netlify.com](https://netlify.com) → Sign up free (use GitHub login)
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** → Authorize Netlify → Select your `ahnaf-portfolio` repository
4. Settings:
   - Branch to deploy: `main`
   - Build command: *(leave empty)*
   - Publish directory: `/` (or leave as is)
5. Click **Deploy site**
6. Wait ~30 seconds → Netlify gives you a URL like `amazing-name-12345.netlify.app`

### Custom Domain (optional):
1. In Netlify → **Domain settings** → **Add custom domain**
2. Type your domain (e.g. `ahnafdigital.com`)
3. Follow DNS instructions from your domain provider

### Auto-deploy on updates:
Every time you push to GitHub → Netlify auto-deploys. No manual steps needed.

---

## 🔄 Step 5 — How to Update Your Site

### To add/edit portfolio works:
→ Just go to `your-site.com/admin.html` and use the admin panel!

### To change site design/content:
1. Edit the files on your computer
2. Push to GitHub (via GitHub Desktop or `git push`)
3. Netlify deploys automatically in ~30 seconds

---

## 🎬 How to Add a Portfolio Work

1. Go to `/admin.html` → enter your passcode
2. Click **Add New Work** in the sidebar
3. Fill in:
   - **Title** — name of the project (required)
   - **Category** — pick from the dropdown (required)
   - **Video** — either paste a URL (YouTube/Vimeo/Facebook/MP4) OR click "Upload File" to upload directly (requires Supabase)
   - **Thumbnail** — paste an image URL OR upload an image file (requires Supabase)
   - **Client Name** — optional
   - **Tags** — comma separated (e.g. `Instagram, Ads, Growth`)
   - **Featured** — check to show a ✦ badge on the card
4. Click **Add to Portfolio**
5. Visit your live site — the work appears instantly!

---

## 🎬 Supported Video Types

| Type | Example URL |
|------|-------------|
| YouTube | `https://youtube.com/watch?v=dQw4w9WgXcQ` |
| Vimeo | `https://vimeo.com/123456789` |
| Facebook | `https://facebook.com/video/...` |
| Direct MP4 | `https://example.com/video.mp4` |
| File Upload | Upload via admin panel (needs Supabase) |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Background | `#5B1F1F` (Deep Maroon) |
| Accent Pink | `#FF4081` |
| Accent Orange | `#FF6A00` |
| Serif Font | Playfair Display |
| Sans Font | Inter |

---

## 🔧 Recommended Next Steps

- [ ] Connect Supabase (see Step 2)
- [ ] Change admin passcode in `js/site-config.js`
- [ ] Update contact email/WhatsApp in `index.html`
- [ ] Add Google Analytics for visitor tracking
- [ ] Connect a real email backend (Formspree.io) for the contact form
- [ ] Add a custom domain via Netlify

---

## ❓ Troubleshooting

**Admin panel not loading works?**
→ Check browser console (F12) for errors. If Supabase isn't configured, works save to localStorage (browser only).

**File uploads not working?**
→ You must configure Supabase + create the `portfolio-media` storage bucket + set the storage policy.

**Site showing old version after update?**
→ Clear browser cache (Ctrl+Shift+R) or wait a minute for Netlify CDN to refresh.

**Passcode not working?**
→ Check `js/site-config.js` — the `adminPasscode` field. Default is `Ahnaf2025!`
