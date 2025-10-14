/* script.js — Smooth scroll, nav toggle, reveals, modal, toggles
   Beginner-friendly, commented so you can explain it in class.
*/

/* ---- helpers ---- */
const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => Array.from((root || document).querySelectorAll(s));

/* ---- mobile nav toggle (hamburger only visible on small screens) ---- */
const hamburger = qs('#hamburger');
const navMenu = qs('#navMenu');
hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

/* ---- smooth scroll for anchor links with navbar offset ---- */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = qs(id);
    if (!target) return;

    // account for fixed navbar height
    const navHeight = qs('.navbar').offsetHeight;
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

    window.scrollTo({ top: targetY, behavior: 'smooth' });

    // close mobile nav if open
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ---- active nav link while scrolling ---- */
const navLinks = qsa('.nav-link');
const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = navLinks.find(l => l.getAttribute('href') === id);
    if (entry.isIntersecting) {
      navLinks.forEach(n => n.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}, { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- scroll progress bar ---- */
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = (height > 0) ? (scrollTop / height) * 100 : 0;
  qs('#progress-bar').style.width = pct + '%';
});

/* ---- reveal on scroll for sections ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
qsa('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Did You Know toggles (smooth) ---- */
function toggleFact(btn){
  const fact = btn.nextElementSibling;
  if (!fact) return;
  if (fact.classList.contains('hidden')){
    fact.classList.remove('hidden');
    fact.style.opacity = 0;
    setTimeout(()=> fact.style.opacity = 1, 20);
    btn.setAttribute('aria-expanded','true');
  } else {
    fact.style.opacity = 0;
    setTimeout(()=> {
      fact.classList.add('hidden');
      btn.setAttribute('aria-expanded','false');
    }, 220);
  }
}

/* ---- Fact card (inside perception) ---- */
function toggleCard(card){
  const p = card.querySelector('p');
  if (!p) return;
  if (p.classList.contains('hidden')){
    p.classList.remove('hidden');
  } else {
    p.classList.add('hidden');
  }
}

/* ---- Gallery modal ---- */
function openModal(imgEl){
  const modal = qs('#modal');
  const modalImg = qs('#modal-img');
  const caption = qs('#modal-caption');
  modalImg.src = imgEl.src;
  caption.textContent = imgEl.alt || '';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  const modal = qs('#modal');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
/* close modal on click outside or ESC */
window.addEventListener('click', e => {
  const modal = qs('#modal');
  if (modal && e.target === modal) closeModal();
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ---- back to top button ---- */
qs('#year').textContent = new Date().getFullYear();
qs('#backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- small parallax effect for hero background (subtle) ---- */
window.addEventListener('scroll', () => {
  const hero = qs('.hero');
  if (!hero) return;
  hero.style.backgroundPositionY = `${window.pageYOffset * 0.25}px`;
});

function toggleFact(button) {
  const fact = button.nextElementSibling;
  const isHidden = fact.classList.contains('hidden');
  
  fact.classList.toggle('hidden', !isHidden);
  button.setAttribute('aria-expanded', isHidden);
}
