# Ahnaf — Premium Digital Marketing Portfolio

A luxury, motion-rich portfolio website for **Ahnaf**, a Digital Marketing Expert. Built with pure HTML, CSS, and JavaScript — no frameworks required.

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Background | `#5B1F1F` (Deep Maroon/Burgundy) |
| Accent 1 | `#FF4081` (Bright Pink) |
| Accent 2 | `#FF6A00` (Bright Orange) |
| Serif Font | Playfair Display |
| Sans Font | Inter |

---

## ✅ Completed Features

### Main Website (`index.html`)
- **Hero Section** — Animated title, floating service icons, rotating ring orbs, live stats counter, CTA buttons
- **Particle Canvas** — Connected ambient particle background (full-page)
- **Custom Cursor** — Glowing cursor glow + dot tracker
- **Animated Marquee** — Infinite scrolling services ticker
- **About Section** — Orbiting visual, skill pills, floating badge cards
- **Services Section** — 6 service cards with 3D tilt hover effect + animated icons
- **Portfolio Section** — Dynamic grid loaded from database, category filter tabs, video modal player
- **Video Modal** — Supports YouTube, Vimeo, Facebook Videos, and direct `.mp4` files
- **CTA Strip** — Conversion-focused call-to-action banner
- **Contact Section** — Full contact form with floating labels + social links
- **Footer** — Clean footer with nav links
- **Scroll Reveal Animations** — IntersectionObserver-based staggered reveals
- **Navbar** — Sticky with scroll-spy active link + mobile hamburger menu
- **Responsive Design** — Fully mobile-optimized (320px–1440px+)

### Admin Panel (`admin.html`)
- **Dashboard Overview** — Live stats (total works, featured, by category) + recent works table
- **Add New Work** — Full form with live video preview + thumbnail preview
- **Manage Works** — Paginated table with search, edit, and delete
- **Edit Modal** — Full inline editing for any existing work
- **Delete Confirmation** — Safety dialog before deletion
- **Toast Notifications** — Non-intrusive success/error feedback

---

## 🔗 Page Routes

| URL | Description |
|-----|-------------|
| `/index.html` | Main portfolio website |
| `/admin.html` | Portfolio management admin panel |

---

## 📦 Data Model — `portfolio_works` Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | text | Auto-generated UUID |
| `title` | text | Project/work title |
| `category` | text | One of 6 predefined categories |
| `description` | rich_text | Full project description |
| `video_url` | text | YouTube / Vimeo / Facebook / `.mp4` URL |
| `thumbnail_url` | text | Card thumbnail image URL |
| `client_name` | text | Client or brand name |
| `tags` | array | Filterable tags |
| `featured` | bool | Marks as featured (shows ✦ badge) |
| `created_at` | datetime | Auto (system field) |
| `updated_at` | datetime | Auto (system field) |

---

## 🎬 Supported Video Types

- **YouTube** — `https://youtube.com/watch?v=...` or `https://youtu.be/...`
- **Vimeo** — `https://vimeo.com/...`
- **Facebook Video** — `https://facebook.com/...`
- **Direct MP4** — Any `.mp4`, `.webm`, or `.ogg` URL

---

## 🚀 Motion & Animation Features

- Particle canvas with connected star-field
- Custom cursor glow tracker
- Rotating ring orbits (Hero section)
- Floating service icons (Instagram, YouTube, Facebook, etc.)
- Background ambient blobs (CSS blur/float)
- 3D card tilt (Services section)
- Scroll-triggered reveal animations (fade + slide)
- Animated stats counter (number count-up)
- CSS heartbeat, pulse, badgeFloat, iconFloat keyframes
- Infinite marquee ticker

---

## 📝 How to Add Works (Admin Guide)

1. Go to `/admin.html`
2. Click **"Add New Work"** in the sidebar
3. Fill in:
   - **Title** (required)
   - **Category** (required)
   - **Video URL** — paste a YouTube/Vimeo/Facebook/MP4 link
   - **Thumbnail** — any image URL for the card preview
   - **Client Name**, **Description**, **Tags** (optional)
   - **Featured** checkbox for top placement
4. Click **"Add to Portfolio"**
5. Visit the live site — work appears instantly in the Portfolio section

---

## 🔧 Recommended Next Steps

- [ ] Add a real contact form backend (e.g., Formspree or EmailJS)
- [ ] Update contact email/WhatsApp/social links in `index.html`
- [ ] Add a password-protection layer to `admin.html`
- [ ] Add a "Client Testimonials" section
- [ ] Connect Google Analytics for visitor tracking
- [ ] Add a blog/case studies section

---

## 📁 File Structure

```
index.html          — Main portfolio page
admin.html          — Admin panel for managing works
css/
  style.css         — All styles + animations
js/
  particles.js      — Canvas particle animation
  main.js           — All interactivity (cursor, scroll, portfolio, modal)
```
