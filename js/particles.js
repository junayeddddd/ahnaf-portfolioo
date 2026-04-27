/* ═══════════════════════════════════════
   PARTICLE CANVAS — Ambient Background
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  const COLORS = ['#FF4081', '#FF6A00', '#FF80AB', '#FFD740', '#ffffff'];
  const COUNT  = window.innerWidth < 768 ? 55 : 110;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.twinkleSpeed * this.twinkleDir;
      if (this.alpha >= 0.65 || this.alpha <= 0.05) this.twinkleDir *= -1;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(255,64,129,' + (0.08 * (1 - d / maxDist)) + ')';
          ctx.globalAlpha = 1;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);
  }

  resize();
  buildParticles();
  loop();
  window.addEventListener('resize', () => { resize(); buildParticles(); });
})();
