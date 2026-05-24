// ═══════════════════════════════════════
//  极光背景 — 流光溢彩的 aurora borealis
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

  // 极光色带定义: [色相, 垂直位置比, 振幅, 频率, 速度, 宽度]
  const bands = [
    { hue: 170, baseY: 0.20, amp: 80, freq: 0.002, speed: 0.3, width: 120, alpha: 0.25 },
    { hue: 200, baseY: 0.28, amp: 100, freq: 0.0025, speed: 0.25, width: 100, alpha: 0.22 },
    { hue: 250, baseY: 0.35, amp: 70, freq: 0.003, speed: 0.35, width: 90, alpha: 0.18 },
    { hue: 180, baseY: 0.42, amp: 90, freq: 0.0022, speed: 0.28, width: 110, alpha: 0.20 },
  ];

  let time = 0;

  function drawBand(band) {
    // 用两个重叠的正弦波路径创建极光带
    const points1 = [], points2 = [];
    const step = 4;

    for (let x = -step; x <= w + step; x += step) {
      const t = time * band.speed * 0.01;
      const y1 = band.baseY * h +
        Math.sin(x * band.freq + t) * band.amp +
        Math.sin(x * band.freq * 0.5 + t * 1.3) * band.amp * 0.6 +
        Math.sin(x * band.freq * 0.3 + t * 0.7) * band.amp * 0.3;
      const y2 = y1 + band.width +
        Math.sin(x * band.freq * 0.8 + t * 1.1) * band.amp * 0.3;
      points1.push({ x, y: y1 });
      points2.push({ x, y: y2 });
    }

    // 绘制发光带
    ctx.beginPath();
    ctx.moveTo(points1[0].x, points1[0].y);
    for (let i = 1; i < points1.length; i++) {
      ctx.lineTo(points1[i].x, points1[i].y);
    }
    for (let i = points2.length - 1; i >= 0; i--) {
      ctx.lineTo(points2[i].x, points2[i].y);
    }
    ctx.closePath();

    // 主体填充
    const grad = ctx.createLinearGradient(0, band.baseY * h - band.amp, 0, band.baseY * h + band.amp + band.width);
    grad.addColorStop(0, `hsla(${band.hue}, 80%, 60%, 0)`);
    grad.addColorStop(0.3, `hsla(${band.hue}, 80%, 65%, ${band.alpha})`);
    grad.addColorStop(0.5, `hsla(${band.hue + 10}, 90%, 70%, ${band.alpha * 1.2})`);
    grad.addColorStop(0.7, `hsla(${band.hue}, 80%, 65%, ${band.alpha})`);
    grad.addColorStop(1, `hsla(${band.hue}, 80%, 60%, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // 顶部发光边缘
    ctx.beginPath();
    ctx.moveTo(points1[0].x, points1[0].y);
    for (let i = 1; i < points1.length; i++) {
      ctx.lineTo(points1[i].x, points1[i].y);
    }
    ctx.strokeStyle = `hsla(${band.hue}, 90%, 80%, ${band.alpha * 1.5})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = `hsla(${band.hue}, 90%, 70%, 0.5)`;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 1;

    // 先画柔光背景
    bands.forEach(band => {
      ctx.fillStyle = `hsla(${band.hue}, 60%, 50%, 0.03)`;
      ctx.fillRect(0, band.baseY * h - band.amp, w, band.width + band.amp * 2);
    });

    // 画极光带
    bands.forEach(band => drawBand(band));

    requestAnimationFrame(animate);
  }

  animate();
})();

// ═══════════════════════════════════════
//  星空粒子 + 流星
// ═══════════════════════════════════════
(function() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], meteors = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initStars(); });

  function initStars() {
    stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.005,
      hue: [220, 260, 180, 300, 200][Math.floor(Math.random() * 5)],
    }));
  }
  initStars();

  function spawnMeteor() {
    meteors.push({
      x: Math.random() * w * 0.8 + w * 0.1,
      y: Math.random() * h * 0.3,
      vx: Math.random() * 2 + 2,
      vy: Math.random() * 1.5 + 1,
      life: 1,
      decay: Math.random() * 0.01 + 0.008,
      len: Math.random() * 80 + 40,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = 0.2 + Math.sin(s.twinkle) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 60%, 80%, ${alpha})`;
      ctx.fill();
      if (s.r > 1.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${alpha * 0.15})`;
        ctx.fill();
      }
    });

    if (Math.random() < 0.02) spawnMeteor();
    meteors = meteors.filter(m => m.life > 0);
    meteors.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;
      const sx = m.x, sy = m.y;
      const ex = sx - m.vx * m.len * 0.15, ey = sy - m.vy * m.len * 0.15;
      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.life})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    });

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
