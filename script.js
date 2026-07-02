/* ====== PARTICLES CANVAS ====== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.2 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.gold = Math.random() > 0.85;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.gold
      ? `rgba(245,166,35,${this.opacity})`
      : `rgba(180,180,180,${this.opacity * 0.4})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  const golden = particles.filter(p => p.gold);
  for (let i = 0; i < golden.length; i++) {
    for (let j = i + 1; j < golden.length; j++) {
      const dx = golden[i].x - golden[j].x;
      const dy = golden[i].y - golden[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        ctx.beginPath();
        ctx.moveTo(golden[i].x, golden[i].y);
        ctx.lineTo(golden[j].x, golden[j].y);
        ctx.strokeStyle = `rgba(245,166,35,${0.06 * (1 - dist / 160)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ====== LOADER ====== */
const lines = ['l1','l2','l3','l4'];
const bar = document.getElementById('lb');
const welcome = document.getElementById('lw');
let progress = 0;

function runLoader() {
  lines.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.classList.add('show');
      if (i > 0) document.getElementById(lines[i-1]).classList.add('done');
    }, i * 600);
  });

  const barInterval = setInterval(() => {
    progress += 1.2;
    bar.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) clearInterval(barInterval);
  }, 40);

  setTimeout(() => {
    document.getElementById('l4').classList.add('done');
    welcome.classList.add('show');
  }, 2600);

  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    document.body.style.overflow = 'auto';
    startHeroAnimations();
  }, 3800);
}

document.body.style.overflow = 'hidden';
runLoader();

/* ====== HERO ANIMATIONS ====== */
function startHeroAnimations() {
  setTimeout(() => document.getElementById('hero-slash').classList.add('active'), 300);
}

/* ====== NAV SCROLL ====== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ====== HAMBURGER ====== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ====== SCROLL REVEAL ====== */
const revealEls = document.querySelectorAll(
  '.section-heading,.about-para,.about-mission,.philosophy-grid,.mission-card,.exploring-card,.loves-card,.stack-cat,.project-card,.ach-item,.tl-item,.terminal-wrap,.section-label'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when stack section visible
      if (entry.target.classList.contains('stack-cat')) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ====== QUOTE ROTATOR ====== */
const quotes = [
  "The future belongs to engineers who never stop learning.",
  "Curiosity is my operating system.",
  "AI isn't magic. It's engineering.",
  "Build. Break. Learn. Repeat.",
  "Every intelligent system starts with a curious mind."
];
let qIdx = 0;
const qText = document.getElementById('quote-text');
const qDots = document.querySelectorAll('.qdot');

function setQuote(i) {
  qText.style.opacity = '0';
  setTimeout(() => {
    qText.textContent = quotes[i];
    qText.style.opacity = '1';
  }, 400);
  qDots.forEach((d, j) => d.classList.toggle('active', j === i));
  qIdx = i;
}

qDots.forEach(dot => {
  dot.addEventListener('click', () => setQuote(parseInt(dot.dataset.i)));
});

setInterval(() => {
  setQuote((qIdx + 1) % quotes.length);
}, 4000);

/* ====== TERMINAL INTERACTION ====== */
document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value.trim().toLowerCase();
        
        if (val === '1' || val === 'email') {
          window.open('https://mail.google.com/mail/?view=cm&fs=1&to=kartikeya2006jay@gmail.com', '_blank');
          terminalInput.value = '';
        } else if (val === '2' || val === 'linkedin') {
          window.open('https://linkedin.com/in/kartikeya2006', '_blank');
          terminalInput.value = '';
        } else if (val === '3' || val === 'github') {
          window.open('https://github.com/kartikeya2006jay', '_blank');
          terminalInput.value = '';
        } else if (val === '4' || val === 'schedule' || val === 'meeting') {
          window.open('https://cal.com/kartikeya-yadav-jerjn6/collaboration', '_blank');
          terminalInput.value = '';
        } else {
          // just clear if unknown command
          terminalInput.value = '';
          terminalInput.placeholder = 'Command not found. Try 1, 2, 3, or 4.';
          setTimeout(() => {
            terminalInput.placeholder = 'Type a command (e.g. 1, 2, 3, 4, email) or select an option above';
          }, 3000);
        }
      }
    });
  }

  const dmTrigger = document.getElementById('dm-trigger-btn');
  if (dmTrigger && terminalInput) {
    dmTrigger.addEventListener('click', () => {
      // Add a status message visually
      terminalInput.value = '';
      terminalInput.placeholder = 'Type [1] or [email], or click the EMAIL card above!';
      terminalInput.focus();
      
      // Scroll terminal slightly into view if needed
      terminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the input temporarily
      terminalInput.parentElement.style.boxShadow = '0 0 15px rgba(245,166,35,0.4)';
      terminalInput.parentElement.style.transition = 'box-shadow 0.3s';
      setTimeout(() => {
        terminalInput.parentElement.style.boxShadow = 'none';
        terminalInput.placeholder = 'Type a command (e.g. 1, 2, 3, 4, email) or select an option above';
      }, 3500);
    });
  }
});
