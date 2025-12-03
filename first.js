/* first.js - interactions, animations, AJAX contact */

// ---------- Utilities ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- FLIP CARD ----------
const flipCard = document.querySelector('.flip-card');
const flipBtn = document.getElementById('flipBtn');
const flipBack = document.getElementById('flipBack');

if (flipBtn) flipBtn.addEventListener('click', ()=> flipCard.classList.add('flipped'));
if (flipBack) flipBack.addEventListener('click', ()=> flipCard.classList.remove('flipped'));

// ---------- TYPING EFFECT ----------
const typingEl = document.getElementById('typing');
const typingText = typingEl ? "Hi, I'm Shai Rishi" : '';
if (typingEl){
  let i = 0;
  (function type(){
    if (i <= typingText.length){
      typingEl.innerText = typingText.slice(0, i);
      i++;
      setTimeout(type, 60);
    }
  })();
}

// ---------- SCROLL REVEAL ----------
const revealEls = $$('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if (en.isIntersecting){
      en.target.classList.add('visible');
      observer.unobserve(en.target);
    }
  });
},{ threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Add .reveal classes to major blocks to animate
['.section', '.timeline-item', '.project-row', '.section-title', '.skill'].forEach(sel=>{
  $$(sel).forEach(el=>{
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    observer.observe(el);
  });
});

// ---------- SKILL BARS ANIMATION ----------
const animateSkillBars = () => {
  $$('.bar span').forEach(span=>{
    const val = span.getAttribute('data-percent') || span.dataset.percent || 0;
    span.style.width = (val) + '%';
  });
};

// animate skill bars when skills are in view
const skillsSection = document.getElementById('skills');
if (skillsSection){
  const skillsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        animateSkillBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  skillsObserver.observe(skillsSection);
}

// ---------- SMOOTH NAV ----------
document.querySelectorAll('.navbar nav a').forEach(a=>{
  a.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// ---------- PROJECT-image reveal hover (glass effect) ----------
$$('.project-img img').forEach(img=>{
  img.style.transition = 'transform .6s cubic-bezier(.2,.9,.25,1), filter .5s';
  img.addEventListener('mouseenter', ()=> img.style.transform = 'scale(1.03)');
  img.addEventListener('mouseleave', ()=> img.style.transform = 'scale(1)');
});

// ---------- NAV shrink on scroll ----------
window.addEventListener('scroll', ()=>{
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  if (window.scrollY > 40) nav.style.height = '62px';
  else nav.style.height = '72px';
});

// ---------- CONTACT FORM AJAX (POST to /api/contact) ----------
const contactForm = document.querySelector('.contact-form') || document.getElementById('contactForm');

if (contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.target;
    // collect values
    const name = form.name?.value?.trim() || '';
    const email = form.email?.value?.trim() || '';
    const message = form.message?.value?.trim() || '';

    // basic validation
    if (!name || !email || !message){
      alert('Please fill name, email and message.');
      return;
    }

    // disable UI
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
    const originalText = submitBtn?.innerText || '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Sending...'; }

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!resp.ok) throw new Error('Network response not ok');

      const data = await resp.json();
      // success handling
      alert('Thanks! Your message has been sent.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('There was a problem sending your message. Try again later.');
    } finally {
      if (submitBtn){ submitBtn.disabled = false; submitBtn.innerText = originalText; }
    }
  });
}





