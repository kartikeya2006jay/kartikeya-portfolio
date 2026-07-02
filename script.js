// ─── PARTICLE CANVAS ───────────────────────────────────────────────────────
const pCanvas = document.getElementById('particleCanvas');
const pCtx = pCanvas.getContext('2d');
let particles = [], W, H;

function resizeCanvas() {
  W = pCanvas.width = window.innerWidth;
  H = pCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.7 ? '#6366f1' : '#ffffff';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    pCtx.fillStyle = this.color;
    pCtx.globalAlpha = this.alpha;
    pCtx.fill();
    pCtx.globalAlpha = 1;
  }
}

for (let i = 0; i < 180; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(particles[j].x, particles[j].y);
        pCtx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 100)})`;
        pCtx.lineWidth = 0.5;
        pCtx.stroke();
      }
    }
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── FACE CONSTELLATION CANVAS ─────────────────────────────────────────────
const fCanvas = document.getElementById('faceCanvas');
const fCtx = fCanvas.getContext('2d');
const fW = fCanvas.width, fH = fCanvas.height;

// Generate constellation nodes that form a face silhouette
const facePoints = [];
function makeFacePoints() {
  const cx = fW / 2, cy = fH / 2;
  // Head outline
  for (let a = 0; a < Math.PI * 2; a += 0.18) {
    const rx = 140 + Math.sin(a * 3) * 8;
    const ry = 160 + Math.cos(a * 2) * 10;
    facePoints.push({
      x: cx + rx * Math.cos(a) + (Math.random() - 0.5) * 20,
      y: cy + ry * Math.sin(a) + (Math.random() - 0.5) * 20,
      r: Math.random() * 2 + 0.8, alpha: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      baseX: 0, baseY: 0
    });
  }
  // Interior face features
  const features = [
    // eyes
    ...Array.from({length:12}, (_,i) => ({ x: cx - 50 + Math.cos(i/12*Math.PI*2)*20, y: cy - 40 + Math.sin(i/12*Math.PI*2)*10 })),
    ...Array.from({length:12}, (_,i) => ({ x: cx + 50 + Math.cos(i/12*Math.PI*2)*20, y: cy - 40 + Math.sin(i/12*Math.PI*2)*10 })),
    // nose
    ...Array.from({length:8}, (_,i) => ({ x: cx + (i-4)*6, y: cy + i*8 })),
    // mouth
    ...Array.from({length:16}, (_,i) => ({ x: cx - 60 + i*8, y: cy + 60 + Math.sin(i/15*Math.PI)*15 })),
    // scatter fill
    ...Array.from({length:60}, () => ({ x: cx + (Math.random()-0.5)*200, y: cy + (Math.random()-0.5)*240 }))
  ];
  features.forEach(f => facePoints.push({
    x: f.x + (Math.random()-0.5)*8, y: f.y + (Math.random()-0.5)*8,
    r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.9 + 0.1,
    vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15
  }));
  facePoints.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
}
makeFacePoints();

let faceAngle = 0;
function drawFace() {
  fCtx.clearRect(0, 0, fW, fH);
  faceAngle += 0.005;
  const cx = fW/2, cy = fH/2;

  // Glow background
  const grd = fCtx.createRadialGradient(cx, cy, 0, cx, cy, 180);
  grd.addColorStop(0, 'rgba(99,102,241,0.12)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  fCtx.fillStyle = grd;
  fCtx.fillRect(0, 0, fW, fH);

  // Draw connections between close points
  for (let i = 0; i < facePoints.length; i++) {
    for (let j = i+1; j < facePoints.length; j++) {
      const dx = facePoints[i].x - facePoints[j].x;
      const dy = facePoints[i].y - facePoints[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 45) {
        fCtx.beginPath();
        fCtx.moveTo(facePoints[i].x, facePoints[i].y);
        fCtx.lineTo(facePoints[j].x, facePoints[j].y);
        fCtx.strokeStyle = `rgba(99,102,241,${0.25*(1-d/45)})`;
        fCtx.lineWidth = 0.5;
        fCtx.stroke();
      }
    }
  }

  // Draw points
  facePoints.forEach(p => {
    p.x = p.baseX + Math.sin(faceAngle + p.baseY*0.01)*3;
    p.y = p.baseY + Math.cos(faceAngle + p.baseX*0.01)*2;
    fCtx.beginPath();
    fCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    const bright = Math.sin(faceAngle*2 + p.baseX*0.05) * 0.3 + 0.7;
    fCtx.fillStyle = `rgba(180,180,255,${p.alpha * bright})`;
    fCtx.fill();
    // Glow on bright points
    if (p.r > 1.5) {
      fCtx.beginPath();
      fCtx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
      fCtx.fillStyle = `rgba(99,102,241,${p.alpha*0.15*bright})`;
      fCtx.fill();
    }
  });

  requestAnimationFrame(drawFace);
}
drawFace();

// ─── NAVBAR ACTIVE LINK ON SCROLL ─────────────────────────────────────────
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const id = entry.target.id;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ─── SCROLL REVEAL ─────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bar animations
      const skillCat = entry.target.closest('.skill-category');
      if (skillCat) skillCat.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.project-card,.info-card,.timeline-item,.research-card,.skill-category,.about-text,.about-card-panel').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// Also trigger skill bars when section is visible
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-category').forEach(c => c.classList.add('visible'));
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.section-skills').forEach(s => skillObs.observe(s));

// ─── NAV SCROLL INDICATOR ─────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) navbar.style.background = 'rgba(5,5,8,0.97)';
  else navbar.style.background = 'rgba(5,5,8,0.85)';
});

// ─── TYPING EFFECT on hero name ──────────────────────────────────────────
const heroName = document.querySelector('.hero-name');
if (heroName) {
  const text = heroName.innerHTML;
  heroName.style.opacity = '1';
  // Already rendered, just add animated underline effect via CSS
}

// ─── CURSOR GLOW ─────────────────────────────────────────────────────────
const cursor = document.createElement('div');
cursor.style.cssText = `position:fixed;width:20px;height:20px;background:rgba(99,102,241,0.3);border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.1s;mix-blend-mode:screen;`;
document.body.appendChild(cursor);
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX - 10; my = e.clientY - 10;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
document.addEventListener('mousedown', () => cursor.style.transform = 'scale(2)');
document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1)');
