/* ===== quick helpers ===== */
const $ = (s, r = document) => (r || document).querySelector(s);
const $$ = (s, r = document) => Array.from((r || document).querySelectorAll(s));

/* ===== NAV TOGGLE (mobile) ===== */
const navToggle = $('#navToggle');
const siteNav = $('#siteNav') || $('#siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

/* ===== FLIP CARD ===== */
const flipCard = $('.flip-card');
const flipBtn = $('#flipBtn');
const flipBack = $('#flipBack');

if (flipBtn && flipCard) {
  flipBtn.addEventListener('click', () => {
    flipCard.classList.add('flipped');
    // update accessible attribute
    flipBtn.setAttribute('aria-pressed', 'true');
  });
}
if (flipBack && flipCard) {
  flipBack.addEventListener('click', () => {
    flipCard.classList.remove('flipped');
    flipBtn?.setAttribute('aria-pressed', 'false');
  });
}

/* ===== TYPING EFFECT (with cursor) ===== */
const typingEl = $('#typing');
const typingText = typingEl ? "Hi, I'm Shai Rishi" : "";
if (typingEl) {
  let k = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.opacity = '0.95';
  cursor.style.marginLeft = '8px';
  cursor.style.color = 'var(--accent)';
  cursor.setAttribute('aria-hidden', 'true');

  // ensure a text node to manipulate
  typingEl.appendChild(document.createTextNode(''));
  typingEl.appendChild(cursor);

  (function type() {
    const existingText = typingText.slice(0, k);
    typingEl.childNodes[0].nodeValue = existingText;
    k++;
    if (k <= typingText.length) {
      setTimeout(type, 60);
    } else {
      setInterval(() => cursor.style.opacity = cursor.style.opacity === '0' ? '0.95' : '0', 500);
    }
  })();
}

/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
const revealSelectors = ['.section', '.timeline-item', '.project-row', '.section-title', '.skill'];
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // animate skill bars when skills section enters view
      if (e.target.matches('.skill') || e.target.closest('#skills')) {
        $$('.bar span').forEach(s => {
          const pct = parseInt(s.getAttribute('data-percent') || s.dataset.percent || 0, 10);
          // clamp percent 0-100
          const clamped = Math.max(0, Math.min(100, isNaN(pct) ? 0 : pct));
          // small timeout for nicer sequence
          setTimeout(()=> s.style.width = clamped + '%', 120);
        });
        $$('.bar').forEach(b => b.classList.add('active'));
      }
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.16 });

revealSelectors.forEach(sel => $$(sel).forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  observer.observe(el);
}));

/* ===== NAV ACTIVE LINK HIGHLIGHT ON SCROLL ===== */
const navLinks = $$('.navbar nav a');
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
function onScrollNav() {
  const top = window.scrollY + 110;
  let current = sections[0];
  for (let sec of sections) {
    if (!sec) continue;
    if (sec.offsetTop <= top) current = sec;
  }
  navLinks.forEach(a => a.classList.toggle('active-nav', document.querySelector(a.getAttribute('href')) === current));
}
window.addEventListener('scroll', onScrollNav);
onScrollNav();

/* small active nav styles (injected) */
const style = document.createElement('style');
style.innerHTML = `.navbar nav a.active-nav{ color: #0b1220; } .navbar nav a.active-nav::after{ width:48%; }`;
document.head.appendChild(style);

/* ===== NAV SHRINK ON SCROLL ===== */
const nav = $('.navbar');
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 40) nav.classList.add('shrink'); else nav.classList.remove('shrink');
});

/* ===== SMOOTH NAV (offset navigation) ===== */
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72);
    window.scrollTo({ top: y, behavior: 'smooth' });
    // close mobile nav if open
    if (siteNav && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ===== PROJECT IMAGE: ensure no inline transform persists ===== */
$$('.project-img img').forEach(img => {
  img.style.transform = 'none';
  img.style.transition = 'transform .45s cubic-bezier(.2,.9,.25,1), filter .35s';
  img.addEventListener('mouseleave', () => img.style.transform = 'none');
});

/* ===== CONTACT FORM: client-side validation + simulated send + toast (no DB) ===== */
const contactForm = document.querySelector('.contact-form') || document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name?.value.trim();
    const email = contactForm.email?.value.trim();
    const message = contactForm.message?.value.trim();
    if (!name || !email || !message) {
      toast('Please fill in all fields', 'warning');
      return;
    }
    const btn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.btn');
    const prev = btn?.innerText || 'Send';
    if (btn){ btn.disabled = true; btn.innerText = 'Sending...'; }
    // simulate network delay
    setTimeout(() => {
      if (btn){ btn.disabled = false; btn.innerText = prev; }
      contactForm.reset();
      toast('Message sent — thank you! I will reply soon.', 'success');
    }, 900);
  });
}

/* ===== SIMPLE TOAST FEEDBACK ===== */
const toast = (msg, type='info') => {
  const t = document.createElement('div');
  t.className = 'site-toast ' + type;
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', right: '20px', bottom: '24px', padding: '12px 16px', borderRadius: '10px',
    background: type==='success' ? 'linear-gradient(90deg,#48bb78,#9be7b3)' : type==='warning' ? 'linear-gradient(90deg,#f6ad55,#ffd29f)' : 'linear-gradient(90deg,#63b3ed,#a0d2ff)',
    color:'#042024', fontWeight:700, boxShadow:'0 10px 30px rgba(2,6,23,0.12)', zIndex:2000, opacity:0, transform:'translateY(10px)'
  });
  document.body.appendChild(t);
  requestAnimationFrame(()=> { t.style.transition='all .35s cubic-bezier(.2,.9,.25,1)'; t.style.opacity='1'; t.style.transform='translateY(0)'; });
  setTimeout(()=> {
    t.style.opacity='0'; t.style.transform='translateY(10px)';
    setTimeout(()=> t.remove(), 400);
  }, 2800);
};

/* ===== ON LOAD: gentle entrance & year update ===== */
window.addEventListener('load', ()=> {
  const hero = document.querySelector('.hero');
  if (hero) { hero.classList.add('reveal', 'visible'); }
  // initialize skill bars (in case user is already past them)
  $$('.bar span').forEach(s => {
    const pct = parseInt(s.getAttribute('data-percent') || s.dataset.percent || 0, 10);
    const clamped = Math.max(0, Math.min(100, isNaN(pct) ? 0 : pct));
    s.style.width = clamped + '%';
  });
  // set year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(y);
});
