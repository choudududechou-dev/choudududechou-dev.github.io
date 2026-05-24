// ═══════════════════════════════════════
//  粒子背景
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * h;
    }
    reset() {
      this.x = Math.random() * w;
      this.y = -10;
      this.size = Math.random() * 2 + 1;
      this.speed = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.y += this.speed;
      if (this.y > h + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });

    // 连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();

// ═══════════════════════════════════════
//  打字机效果
// ═══════════════════════════════════════
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['从电商运营到 AI 开发', '用代码替换重复劳动', '每个项目解决一个真实问题', '相信 AI 会放大每个人的能力'];
  let wordIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = words[wordIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // 打完停顿
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
})();

// ═══════════════════════════════════════
//  滚动入场动画
// ═══════════════════════════════════════
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ═══════════════════════════════════════
//  导航栏滚动显隐
// ═══════════════════════════════════════
(function() {
  let lastScroll = 0;
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 100) {
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    } else {
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    }
    lastScroll = current;
  });
})();
