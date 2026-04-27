/* ═══════════════════════════════════════════════════════
   AHNAF PORTFOLIO — MAIN JS
   Handles: cursor, navbar, scroll reveal, stats counter,
            portfolio loading/filter, video modal, contact form
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
const cursorDot  = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth trailing glow
(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

// Scale dot on clickable elements
document.querySelectorAll('a, button, .work-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width  = '20px';
    cursorDot.style.height = '20px';
    cursorDot.style.opacity = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width  = '10px';
    cursorDot.style.height = '10px';
    cursorDot.style.opacity = '1';
  });
});

/* ─────────────────────────────────────
   2. NAVBAR SCROLL BEHAVIOUR
───────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  // Sticky style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ─────────────────────────────────────
   3. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────
   4. STATS COUNTER ANIMATION
───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => statsObserver.observe(el));

/* ─────────────────────────────────────
   5. PORTFOLIO — LOAD & FILTER
───────────────────────────────────── */
const portfolioGrid  = document.getElementById('portfolioGrid');
const portfolioEmpty = document.getElementById('portfolioEmpty');
const filterBtns     = document.querySelectorAll('.filter-btn');
let allWorks = [];
let currentFilter = 'all';

async function loadPortfolio() {
  try {
    const res = await fetch('tables/portfolio_works?limit=100&sort=created_at');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    allWorks = data.data || [];
    renderPortfolio(allWorks);
  } catch (err) {
    console.warn('Portfolio load error:', err);
    renderPortfolio([]);
  }
}

function renderPortfolio(works) {
  // Clear except empty message
  Array.from(portfolioGrid.children).forEach(child => {
    if (child.id !== 'portfolioEmpty') portfolioGrid.removeChild(child);
  });

  const filtered = currentFilter === 'all'
    ? works
    : works.filter(w => w.category === currentFilter);

  if (filtered.length === 0) {
    portfolioEmpty.style.display = 'flex';
    return;
  }
  portfolioEmpty.style.display = 'none';

  filtered.forEach((work, i) => {
    const card = buildWorkCard(work, i);
    portfolioGrid.appendChild(card);
    // Staggered reveal
    setTimeout(() => card.classList.add('revealed'), i * 80);
  });
}

function buildWorkCard(work, idx) {
  const card = document.createElement('article');
  card.className = 'work-card reveal-up';
  card.style.setProperty('--delay', (idx * 0.07) + 's');
  card.dataset.id = work.id;

  const thumb = work.thumbnail_url
    ? `<img src="${escHtml(work.thumbnail_url)}" alt="${escHtml(work.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=work-thumb-placeholder><i class=fas fa-film></i></div>'">`
    : `<div class="work-thumb-placeholder"><i class="fas fa-film"></i></div>`;

  const featuredBadge = work.featured
    ? `<span class="work-featured-badge">✦ Featured</span>` : '';

  const tagsHTML = Array.isArray(work.tags) && work.tags.length
    ? `<div class="work-tags">${work.tags.map(t => `<span class="work-tag">${escHtml(t)}</span>`).join('')}</div>`
    : '';

  const clientHTML = work.client_name
    ? `<div class="work-client"><i class="fas fa-building"></i>${escHtml(work.client_name)}</div>` : '';

  card.innerHTML = `
    <div class="work-thumb">
      ${thumb}
      <div class="work-play-btn">
        <div class="play-circle"><i class="fas fa-play"></i></div>
      </div>
      ${featuredBadge}
    </div>
    <div class="work-info">
      <div class="work-category">${escHtml(work.category || 'Project')}</div>
      <h3 class="work-title">${escHtml(work.title)}</h3>
      ${work.description ? `<p class="work-desc">${escHtml(stripHtml(work.description))}</p>` : ''}
      ${clientHTML}
      ${tagsHTML}
    </div>`;

  card.addEventListener('click', () => openModal(work));
  return card;
}

// Filter buttons
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
const modal         = document.getElementById('videoModal');
const modalClose    = document.getElementById('modalClose');
const modalVideoWrap = document.getElementById('modalVideoWrap');
const modalCategory = document.getElementById('modalCategory');
const modalTitle    = document.getElementById('modalTitle');
const modalDesc     = document.getElementById('modalDesc');
const modalClient   = document.getElementById('modalClient');

function openModal(work) {
  modalCategory.textContent = work.category || '';
  modalTitle.textContent    = work.title || '';
  modalDesc.textContent     = stripHtml(work.description || '');
  modalClient.textContent   = work.client_name ? '📌 Client: ' + work.client_name : '';
  modalVideoWrap.innerHTML  = buildVideoEmbed(work.video_url);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Stop video on close
  modalVideoWrap.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function buildVideoEmbed(url) {
  if (!url) return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:1.1rem;background:#111"><i class="fas fa-film" style="margin-right:10px"></i> No video provided</div>';

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  // Facebook video
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }
  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return `<video controls autoplay playsinline style="width:100%;height:100%;background:#000"><source src="${escHtml(url)}" type="video/mp4">Your browser does not support the video tag.</video>`;
  }
  // Fallback iframe
  return `<iframe src="${escHtml(url)}" allowfullscreen></iframe>`;
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

    // Simulate send (no backend — show success instantly)
    await new Promise(r => setTimeout(r, 1200));

    formSuccess.classList.add('show');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';

    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });
}

/* ─────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

/* ─────────────────────────────────────
   9. SERVICE CARD TILT (subtle 3D)
───────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio();
});
