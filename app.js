/* =========================================================
   1С:Фреш — landing · app.js (L2 interactions, vanilla)
   ========================================================= */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const inView = (el, margin = 0.96) => {
  const r = el.getBoundingClientRect();
  return r.top < (window.innerHeight || 800) * margin && r.bottom > 0;
};

/* ---------- Reveal on scroll (progressive, robust) ---------- */
(() => {
  const els = [...document.querySelectorAll('.reveal')];
  const reveal = (el) => el.classList.add('in-view');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(reveal); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach((el) => io.observe(el));

  // Safety net: reveal anything already in the viewport, so above-the-fold
  // content shows immediately even if IO callbacks are delayed on first paint.
  const sweep = () => els.forEach((el) => { if (!el.classList.contains('in-view') && inView(el)) reveal(el); });
  window.addEventListener('load', sweep);
  setTimeout(sweep, 500);
})();

/* ---------- Nav: scrolled state (rAF throttled) ---------- */
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let ticking = false;
  const update = () => { nav.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ---------- Burger / mobile menu ---------- */
(() => {
  const nav = document.getElementById('nav');
  const burger = nav?.querySelector('.burger');
  if (!nav || !burger) return;
  const toggle = (open) => {
    const isOpen = open ?? !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  };
  burger.addEventListener('click', () => toggle());
  nav.querySelectorAll('.nav-link').forEach((a) => a.addEventListener('click', () => toggle(false)));
})();

/* ---------- Magnetic buttons ---------- */
(() => {
  if (reduce || !canHover) return;
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const strength = 0.3;
    let raf = 0;
    btn.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        raf = 0;
      });
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
})();

/* ---------- Count-up stats (RU formatting) ---------- */
(() => {
  const fmt = (v, isFloat) => isFloat
    ? v.toFixed(1).replace('.', ',')
    : Math.round(v).toLocaleString('ru-RU');

  const run = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = !Number.isInteger(target);
    if (reduce) { el.textContent = fmt(target, isFloat) + suffix; return; }
    const dur = 1500, t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, isFloat) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target, isFloat) + suffix;
    };
    requestAnimationFrame(step);
  };

  const nums = [...document.querySelectorAll('.stat-num[data-count]')];
  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
  // Safety net for first paint
  const sweep = () => nums.forEach((n) => { if (!n.dataset.done && inView(n, 1)) run(n); });
  window.addEventListener('load', sweep);
  setTimeout(sweep, 500);
})();
