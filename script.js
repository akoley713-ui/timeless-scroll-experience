(() => {
  'use strict';

  const TOTAL = 300;   // frames/ezgif-frame-001.jpg … 300.jpg
  const KEY = 10;      // keyframes kept in memory permanently (every 10th)
  const WINDOW = 30;   // frames kept loaded on each side of the current one

  const $ = (s) => document.querySelector(s);
  const canvas = $('#canvas');
  const ctx = canvas.getContext('2d');
  const hero = $('#hero');
  const steps = [...document.querySelectorAll('.step')];
  const bar = $('#progress');
  const counter = $('#counter');
  const serial = $('#serial');
  const fallback = $('#fallback');
  const small = matchMedia('(max-width: 700px)');

  const frames = new Array(TOTAL).fill(null);
  const pending = new Set();
  let w = 0, h = 0, shown = -1, want = 0, active = -1, ticking = false;

  const stepSize = () => (small.matches ? 2 : 1); // mobile uses every 2nd frame
  const src = (i) => `frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

  function load(i) {
    if (frames[i]) return Promise.resolve(frames[i]);
    if (pending.has(i)) return Promise.resolve(null);
    pending.add(i);
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { pending.delete(i); frames[i] = img; resolve(img); render(); };
      img.onerror = () => { pending.delete(i); resolve(null); };
      img.src = src(i);
    });
  }

  function nearest(i) {
    for (let d = 0; d < TOTAL; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  }

  function render() {
    const i = nearest(want);
    if (i < 0 || i === shown) return;
    const img = frames[i];
    shown = i;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const mobile = small.matches;
    const s = mobile ? Math.min((w * 1.15) / iw, (h * 0.56) / ih) : Math.max(w / iw, h / ih);
    const dw = iw * s, dh = ih * s;
    const cx = mobile ? w / 2 : w * 0.64;
    const cy = mobile ? h * 0.3 : h / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  }

  // Load outward from the current frame; free frames outside the window (keyframes stay).
  function manage() {
    const s = stepSize();
    for (let d = 0; d <= WINDOW; d++) {
      if (want + d * s < TOTAL) load(want + d * s);
      if (want - d * s >= 0) load(want - d * s);
    }
    const lo = want - WINDOW * s, hi = want + WINDOW * s;
    for (let i = 0; i < TOTAL; i++) {
      if (frames[i] && i % KEY && i !== TOTAL - 1 && (i < lo || i > hi)) frames[i] = null;
    }
  }

  function setStep(k) {
    active = k;
    steps.forEach((el, i) => {
      el.classList.toggle('active', i === k);
      el.inert = i !== k;
    });
    const n = String(k + 1).padStart(2, '0');
    counter.textContent = `${n} / ${String(steps.length).padStart(2, '0')}`;
    serial.textContent = `No. ${n}`;
  }

  function update() {
    ticking = false;
    const max = hero.offsetHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / max)) : 0;
    const s = stepSize();
    const n = Math.min(TOTAL - 1, Math.round((p * (TOTAL - 1)) / s) * s);
    if (n !== want) { want = n; manage(); }
    render();
    bar.style.transform = `scaleX(${p})`;
    const k = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (k !== active) setStep(k);
  }

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    shown = -1;
    requestUpdate();
  }

  function hideLoader() { $('#loader').classList.add('done'); }

  async function boot() {
    const keys = [];
    for (let i = 0; i < TOTAL; i += KEY) keys.push(i);
    keys.push(TOTAL - 1);
    const first = await load(0);
    if (!first) { fallback.hidden = false; hideLoader(); return; } // frames missing
    let done = 0;
    const bar = $('#loadBar'), label = $('#loadPct');
    const all = Promise.all(keys.map((i) => load(i).then(() => {
      done++;
      bar.style.transform = `scaleX(${done / keys.length})`;
      label.textContent = `${Math.round((done / keys.length) * 100)}%`;
    })));
    await Promise.race([all, new Promise((r) => setTimeout(r, 8000))]); // never trap the visitor
    hideLoader();
    manage();
    update();
  }

  // Reveal below-the-fold content once
  const reveal = document.querySelectorAll('.sec .label, .sec h2, .sec .body, .sec .ph, .rows li, .cards article, #viewing');
  reveal.forEach((el) => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add('in'));
  }

  // Private viewing form (client-side only: connect to your backend or email service)
  const form = $('#viewing'), msg = $('#formMsg'), email = $('#email');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!email.checkValidity() || !email.value.trim()) {
      msg.textContent = 'Enter a valid email address so we can reach you.';
      email.focus();
      return;
    }
    msg.textContent = 'Thank you. We will be in touch about your private viewing.';
    form.reset();
  });

  let resizeTimer;
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });

  resize();
  setStep(0);
  boot();
})();
