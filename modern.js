(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  const KEY = 'bix-theme';
  let theme = 'dark';
  try { theme = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
  const toggle = document.getElementById('dark-mode-toggle');
  const apply = t => { root.dataset.theme = t; if (toggle) toggle.checked = t === 'light'; };
  apply(theme);
  if (toggle) toggle.addEventListener('change', () => {
    const next = toggle.checked ? 'light' : 'dark';
    const save = () => { apply(next); try { localStorage.setItem(KEY, next); } catch (e) {} };
    if (document.startViewTransition && !reduce) {
      const r = toggle.getBoundingClientRect();
      root.style.setProperty('--tx', r.left + r.width / 2 + 'px');
      root.style.setProperty('--ty', r.top + r.height / 2 + 'px');
      document.startViewTransition(save);
    } else save();
  });

  const h1 = document.querySelector('h1');
  if (h1) {
    const t = h1.textContent.trim();
    h1.setAttribute('aria-label', t);
    h1.textContent = '';
    [...t].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = c;
      h1.appendChild(s);
    });
  }

  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  const secs = [...document.querySelectorAll('main > section[id]')];
  const dock = document.createElement('nav');
  dock.className = 'dock';
  dock.setAttribute('aria-label', 'Sections');
  secs.forEach(s => {
    const a = document.createElement('a');
    a.href = '#' + s.id;
    a.textContent = s.id === 'hero' ? 'Home' : s.id[0].toUpperCase() + s.id.slice(1);
    dock.appendChild(a);
  });
  document.body.appendChild(dock);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) dock.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));

  const wrap = document.querySelector('.hero-wrapper');
  let busy = false;
  const onScroll = () => {
    if (busy) return;
    busy = true;
    requestAnimationFrame(() => {
      const y = scrollY, max = root.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? y / max : 0);
      if (wrap && !reduce) {
        wrap.style.setProperty('--py', y * .25);
        wrap.style.setProperty('--po', 1 - Math.min(y / (innerHeight * .8), 1));
      }
      busy = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.skill').forEach(s => {
    const l = s.querySelector('label'), b = s.querySelector('.bar');
    if (!l || !b) return;
    const p = document.createElement('span');
    p.className = 'pct';
    p.textContent = (parseFloat(b.style.width) || 0) + '%';
    l.appendChild(p);
  });
  const count = cat => {
    if (reduce) return;
    cat.querySelectorAll('.pct').forEach(p => {
      const to = parseFloat(p.textContent) || 0, t0 = performance.now() + 300;
      p.textContent = '0%';
      const step = n => {
        const k = Math.min(Math.max((n - t0) / 1300, 0), 1);
        p.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%';
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    if (e.target.classList.contains('skill-category')) count(e.target);
  }), { threshold: .12 });
  document.querySelectorAll('section h2, .about-text, .code-block, .project-item, .skill-category, .platform-card, .contact-item').forEach(el => {
    el.style.setProperty('--d', Math.min([...el.parentElement.children].indexOf(el), 5) * 90 + 'ms');
    el.classList.add('reveal');
    io.observe(el);
  });

  if (fine) {
    document.querySelectorAll('.project-item, .platform-card, .contact-item').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px');
        c.style.setProperty('--my', y + 'px');
        if (!reduce) {
          c.style.setProperty('--ry', (x / r.width - .5) * 8 + 'deg');
          c.style.setProperty('--rx', (.5 - y / r.height) * 8 + 'deg');
        }
      });
      c.addEventListener('pointerleave', () => {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
    if (!reduce) document.querySelectorAll('.link-btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.translate = (e.clientX - r.left - r.width / 2) * .25 + 'px ' + (e.clientY - r.top - r.height / 2) * .35 + 'px';
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }
})();
