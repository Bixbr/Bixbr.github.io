(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointerFine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const KEY = 'bix-theme';
  const hasIO = 'IntersectionObserver' in window;

  const toggle = $('#theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');
  const applyTheme = (t, save) => {
    root.dataset.theme = t;
    if (toggle) toggle.setAttribute('aria-pressed', String(t === 'dark'));
    if (themeMeta) themeMeta.content = t === 'dark' ? '#000000' : '#f5f5f7';
    if (save) { try { localStorage.setItem(KEY, t); } catch (e) {} }
  };
  applyTheme(root.dataset.theme || 'dark', false);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition && !motion.matches) {
        const r = toggle.getBoundingClientRect();
        root.style.setProperty('--tx', r.left + r.width / 2 + 'px');
        root.style.setProperty('--ty', r.top + r.height / 2 + 'px');
        document.startViewTransition(() => applyTheme(next, true));
      } else {
        applyTheme(next, true);
      }
    });
  }
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'light' : 'dark', false);
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const splitWords = (el, cls) => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const s = document.createElement('span');
              s.className = cls;
              s.style.setProperty('--i', i++);
              s.textContent = part;
              frag.appendChild(s);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    return $$('.' + cls, el);
  };

  const lines = $$('.taglines li');
  if (lines.length) {
    lines.forEach(li => splitWords(li, 'tw'));
    const wrap = $('.tagline');
    let idx = 0, timer, paused = false;
    const show = n => {
      lines[idx].classList.remove('on');
      idx = (n + lines.length) % lines.length;
      lines[idx].classList.add('on');
    };
    const tick = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!paused && !document.hidden) show(idx + 1);
        tick();
      }, 4200);
    };
    wrap.addEventListener('pointerenter', () => { paused = true; });
    wrap.addEventListener('pointerleave', () => { paused = false; });
    wrap.addEventListener('click', () => { show(idx + 1); tick(); });
    tick();
  }

  const show = el => {
    el.classList.add('in');
    if (el.classList.contains('reveal')) {
      const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal'), 1600 + d * 1000);
    }
  };
  const io = hasIO
    ? new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        show(e.target);
        io.unobserve(e.target);
      }), { threshold: .1, rootMargin: '0px 0px -5% 0px' })
    : null;
  const watch = el => (io ? io.observe(el) : el.classList.add('in'));

  $$('main h2, .extra-title').forEach(h => { splitWords(h, 'hw'); watch(h); });

  $$('.code-block .ln').forEach((l, i) => l.style.setProperty('--n', i));
  $$('.code-block').forEach(c => c.classList.add('js-lines'));
  $$('.skill-category').forEach(c => {
    c.classList.add('js-bars');
    $$('.bar', c).forEach((b, i) => b.style.setProperty('--n', i));
  });

  $$('.about-text, .code-block, .project-item, .skill-category, .platform-card, .contact-item, .extra-lead, .link-list').forEach(el => {
    const sibling = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', Math.min(sibling, 5) * .07 + 's');
    el.classList.add('reveal');
    watch(el);
  });

  const paras = $$('.about-text p:not(.credit)').map(p => ({ w: splitWords(p, 'pw'), p, n: -1 }));
  const paintWords = () => {
    const vh = innerHeight;
    paras.forEach(o => {
      const r = o.p.getBoundingClientRect();
      const t = motion.matches ? 1 : Math.min(Math.max((vh * .9 - r.top) / (vh * .45 + r.height * .35), 0), 1);
      const n = t >= 1 ? o.w.length : Math.round(t * o.w.length * 1.15);
      if (n === o.n) return;
      o.n = n;
      o.w.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  };

  const pill = $('.nav-pill');
  const hero = $('#hero');
  const h1 = $('.hero h1');

  if (h1 && hasIO) {
    new IntersectionObserver(([e]) => root.classList.toggle('scrolled', !e.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' }).observe(h1);
  }

  if (pill) {
    const links = $$('a', pill);
    const place = () => {
      const a = $('a.on', pill);
      if (!a) { pill.classList.remove('has-active'); return; }
      const first = !pill.classList.contains('has-active');
      if (first) pill.classList.add('snap');
      pill.style.setProperty('--x', a.offsetLeft + 'px');
      pill.style.setProperty('--w', a.offsetWidth + 'px');
      pill.classList.add('has-active');
      if (first) requestAnimationFrame(() => requestAnimationFrame(() => pill.classList.remove('snap')));
      if (pill.scrollWidth > pill.clientWidth) {
        pill.scrollTo({ left: a.offsetLeft - (pill.clientWidth - a.offsetWidth) / 2, behavior: motion.matches ? 'auto' : 'smooth' });
      }
    };
    if (hasIO) {
      const spy = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => {
          const on = a.hash === '#' + e.target.id;
          a.classList.toggle('on', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
        place();
      }), { rootMargin: '-45% 0px -50% 0px' });
      $$('main > section[id]').forEach(s => spy.observe(s));
    }
    addEventListener('resize', place);
  }

  let queued = false;
  const update = () => {
    queued = false;
    if (hero && !motion.matches) {
      const y = scrollY, vh = innerHeight;
      if (y < vh * 1.2) {
        const p = Math.min(y / (vh * .85), 1);
        hero.style.setProperty('--hy', (y * .2).toFixed(1));
        hero.style.setProperty('--hs', (1 - p * .07).toFixed(3));
        hero.style.setProperty('--ho', Math.max(1 - p * 1.15, 0).toFixed(3));
      }
    }
    paintWords();
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();

  if (pointerFine) {
    $$('.project-item, .platform-card, .contact-item').forEach(c => {
      const tilt = c.matches('a.platform-card') && !motion.matches;
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px');
        c.style.setProperty('--my', y + 'px');
        if (tilt) {
          c.style.setProperty('--ry', ((x / r.width - .5) * 9).toFixed(2) + 'deg');
          c.style.setProperty('--rx', ((.5 - y / r.height) * 9).toFixed(2) + 'deg');
        }
      });
      c.addEventListener('pointerleave', () => {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
    if (!motion.matches) {
      $$('.btn').forEach(b => {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.translate = (e.clientX - r.left - r.width / 2) * .2 + 'px ' + (e.clientY - r.top - r.height / 2) * .3 + 'px';
        });
        b.addEventListener('pointerleave', () => { b.style.translate = ''; });
      });
    }
  }
})();
