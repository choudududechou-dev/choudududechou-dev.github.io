// ═══════════════════════════════════════
//  极光背景
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('aurora');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 多层极光波浪
  const layers = [
    { hue: 180, speed: 0.0003, amp: 0.25, freq: 0.004, offset: 0 },
    { hue: 220, speed: 0.0005, amp: 0.2, freq: 0.003, offset: 2 },
    { hue: 260, speed: 0.0004, amp: 0.15, freq: 0.005, offset: 4 },
    { hue: 160, speed: 0.00035, amp: 0.18, freq: 0.0035, offset: 1 },
  ];

  let time = 0;

  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 1;

    layers.forEach(layer => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      const baseAlpha = 0.06;

      for (let i = 0; i < 8; i++) {
        const pos = i / 7;
        const waveY = Math.sin(time * layer.speed + pos * 8 + layer.offset) * h * layer.amp + h * 0.35;
        const alpha = baseAlpha * (1 - Math.abs(pos - 0.5) * 1.8);
        grad.addColorStop(pos, `hsla(${layer.hue}, 70%, 60%, ${Math.max(0, alpha)})`);
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    // 横向流动波纹
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yBase = h * (0.25 + i * 0.2);
      for (let x = 0; x <= w; x += 3) {
        const y = yBase + Math.sin(x * 0.003 + time * 0.02 + i * 3) * 60 +
                  Math.cos(x * 0.007 + time * 0.015 + i) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${180 + i * 40}, 80%, 60%, 0.04)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ═══════════════════════════════════════
//  星空粒子
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initStars(); });

  function initStars() {
    stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));
  }
  initStars();

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = 0.3 + Math.sin(s.twinkle) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    // 偶尔画流星
    if (Math.random() < 0.003) {
      const sx = Math.random() * w, sy = Math.random() * h * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 80, sy + 40);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

// ═══════════════════════════════════════
//  打字机效果
// ═══════════════════════════════════════
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['从电商运营到 AI 开发', '6 周从小白到开源贡献者', '用代码替换重复劳动', '每个项目解决一个真实问题'];
  let wordIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = words[wordIdx];
    el.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
    charIdx += isDeleting ? -1 : 1;

    let speed = isDeleting ? 35 : 90;
    if (!isDeleting && charIdx === current.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 400; }

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
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
