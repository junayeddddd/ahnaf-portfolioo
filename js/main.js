/* ═══════════════════════════════════════════════════════
   AHNAF PORTFOLIO — MAIN JS
   Supabase-powered with localStorage fallback
═══════════════════════════════════════════════════════ */
'use strict';

/* ── CONFIG ── */
const CFG = window.AHNAF_CONFIG || {};
const SB_READY = !!(
  CFG.supabaseUrl &&
  CFG.supabaseAnonKey &&
  !CFG.supabaseUrl.includes('PASTE_') &&
  !CFG.supabaseAnonKey.includes('PASTE_') &&
  window.supabase
);
const sb = SB_READY
  ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey)
  : null;
const LOCAL_KEY = 'ahnaf_portfolio_works';

/* ─────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
});
(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) { cursorGlow.style.left = glowX + 'px'; cursorGlow.style.top = glowY + 'px'; }
  requestAnimationFrame(animateCursor);
})();
document.querySelectorAll('a, button, .work-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => { if (cursorDot) { cursorDot.style.width = '20px'; cursorDot.style.height = '20px'; cursorDot.style.opacity = '0.7'; } });
  el.addEventListener('mouseleave', () => { if (cursorDot) { cursorDot.style.width = '10px'; cursorDot.style.height = '10px'; cursorDot.style.opacity = '1'; } });
});

/* ─────────────────────────────────────
   2. NAVBAR
───────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) { navbar.classList.toggle('scrolled', window.scrollY > 60); }
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id'); });
  navLinks.forEach(link => { link.classList.toggle('active', link.getAttribute('href') === '#' + current); });
}, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => { navToggle.classList.toggle('open'); navMenu.classList.toggle('open'); });
  navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('open'); navMenu.classList.remove('open'); }));
}

/* ─────────────────────────────────────
   3. SCROLL REVEAL
───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
if (revealEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────
   4. STATS COUNTER
───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / 1800, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update); else el.textContent = target;
  })(start);
}
const statNums = document.querySelectorAll('.stat-number');
if (statNums.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  statNums.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────
   5. PORTFOLIO LOAD & FILTER
───────────────────────────────────── */
const portfolioGrid  = document.getElementById('portfolioGrid');
const portfolioEmpty = document.getElementById('portfolioEmpty');
const filterBtns     = document.querySelectorAll('.filter-btn');
let allWorks = [], currentFilter = 'all';

async function loadPortfolio() {
  try {
    const CFG2 = window.AHNAF_CONFIG || {};
    const supabaseReady = !!(CFG2.supabaseUrl && CFG2.supabaseAnonKey && !CFG2.supabaseUrl.includes("PASTE_") && !CFG2.supabaseAnonKey.includes("PASTE_") && window.supabase);
    if (supabaseReady) {
      const client = window.supabase.createClient(CFG2.supabaseUrl, CFG2.supabaseAnonKey);
      const { data, error } = await client.from("portfolio_works").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      allWorks = data || [];
    } else {
      const stored = localStorage.getItem(LOCAL_KEY);
      allWorks = stored ? JSON.parse(stored).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) : [];
    }
  } catch (err) {
    console.warn("Portfolio load error:", err);
    allWorks = [];
  }
  renderPortfolio(allWorks);
}

function renderPortfolio(works) {
  if (!portfolioGrid || !portfolioEmpty) return;
  Array.from(portfolioGrid.children).forEach(c => { if (c.id !== 'portfolioEmpty') c.remove(); });
  const filtered = currentFilter === 'all' ? works : works.filter(w => w.category === currentFilter);
  if (!filtered.length) { portfolioEmpty.style.display = 'flex'; return; }
  portfolioEmpty.style.display = 'none';
  filtered.forEach((w, i) => {
    const card = buildWorkCard(w, i);
    portfolioGrid.appendChild(card);
    setTimeout(() => card.classList.add('revealed'), i * 80);
  });
}

function buildWorkCard(work, idx) {
  const card = document.createElement('article');
  card.className = 'work-card reveal-up';
  card.style.setProperty('--delay', (idx * 0.07) + 's');
  card.dataset.id = work.id || ('w' + idx);
  const thumb = work.thumbnail_url
    ? `<img src="${esc(work.thumbnail_url)}" alt="${esc(work.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=work-thumb-placeholder><i class=fas\\ fa-film></i></div>'">`
    : `<div class="work-thumb-placeholder"><i class="fas fa-film"></i></div>`;
  const tags = Array.isArray(work.tags) && work.tags.length
    ? `<div class="work-tags">${work.tags.map(t => `<span class="work-tag">${esc(t)}</span>`).join('')}</div>` : '';
  card.innerHTML = `
    <div class="work-thumb">
      ${thumb}
      <div class="work-play-btn"><div class="play-circle"><i class="fas fa-play"></i></div></div>
      ${work.featured ? `<span class="work-featured-badge">✦ Featured</span>` : ''}
    </div>
    <div class="work-info">
      <div class="work-category">${esc(work.category || 'Project')}</div>
      <h3 class="work-title">${esc(work.title || 'Untitled')}</h3>
      ${work.description ? `<p class="work-desc">${esc(strip(work.description))}</p>` : ''}
      ${work.client_name ? `<div class="work-client"><i class="fas fa-building"></i>${esc(work.client_name)}</div>` : ''}
      ${tags}
    </div>`;
  card.addEventListener('click', () => openModal(work));
  return card;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderPortfolio(allWorks);
  });
});

/* ─────────────────────────────────────
   6. VIDEO MODAL
───────────────────────────────────── */
const modal          = document.getElementById('videoModal');
const modalClose     = document.getElementById('modalClose');
const modalVideoWrap = document.getElementById('modalVideoWrap');
const modalCategory  = document.getElementById('modalCategory');
const modalTitle     = document.getElementById('modalTitle');
const modalDesc      = document.getElementById('modalDesc');
const modalClient    = document.getElementById('modalClient');

function openModal(work) {
  if (!modal) return;
  modalCategory.textContent = work.category || '';
  modalTitle.textContent    = work.title || '';
  modalDesc.textContent     = strip(work.description || '');
  modalClient.textContent   = work.client_name ? '📌 Client: ' + work.client_name : '';
  modalVideoWrap.innerHTML  = buildEmbed(work.video_url);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (modalVideoWrap) modalVideoWrap.innerHTML = '';
}
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function buildEmbed(url) {
  if (!url) return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;background:#111"><i class="fas fa-film" style="margin-right:10px"></i>No video provided</div>';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `<iframe src="https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0" allow="autoplay;encrypted-media" allowfullscreen></iframe>`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `<iframe src="https://player.vimeo.com/video/${vi[1]}?autoplay=1" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  if (url.includes('facebook.com') || url.includes('fb.watch'))
    return `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true" allow="autoplay;clipboard-write;encrypted-media;picture-in-picture" allowfullscreen></iframe>`;
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i))
    return `<video controls autoplay playsinline style="width:100%;height:100%;background:#000"><source src="${esc(url)}" type="video/mp4"></video>`;
  return `<iframe src="${esc(url)}" allowfullscreen></iframe>`;
}

/* ─────────────────────────────────────
   7. CONTACT FORM
───────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    await new Promise(r => setTimeout(r, 1200));
    if (formSuccess) formSuccess.classList.add('show');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 5000);
  });
}

/* ─────────────────────────────────────
   8. SMOOTH SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' }); }
  });
});

/* ─────────────────────────────────────
   9. SERVICE CARD TILT
───────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── HELPERS ── */
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function strip(html) {
  const d = document.createElement('div'); d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', loadPortfolio);
