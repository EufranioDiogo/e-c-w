/* ==========================================================================
   EUFRÁNIO & CREUMA — WEDDING WEBSITE
   Script principal — comentado para fácil personalização
   ========================================================================== */

/* -------------------------------------------------------------------------
   CONFIGURAÇÃO — edita apenas esta secção para personalizar o site
   ------------------------------------------------------------------------- */
const CONFIG = {
  // Data e hora do casamento (formato: "AAAA-MM-DDTHH:MM:SS")
  weddingDate: "2026-11-27T00:00:00",

  // Número de WhatsApp Business dos noivos, em formato internacional, SEM "+" e sem espaços
  whatsappNumber: "244922873628",
};

/* -------------------------------------------------------------------------
   1. NAV — scroll state, active link, mobile burger
   ------------------------------------------------------------------------- */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
  toggleBackToTop();
  highlightActiveLink();
}, { passive: true });

navBurger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navBurger.classList.toggle('is-open', isOpen);
  navBurger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navBurger.classList.remove('is-open');
  });
});

const sections = document.querySelectorAll('section[id], .hero[id]');
function highlightActiveLink(){
  let current = sections[0]?.id;
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  });
}

/* -------------------------------------------------------------------------
   2. FLOATING HEARTS — subtle decorative background effect
   ------------------------------------------------------------------------- */
const floatiesContainer = document.getElementById('floaties');
const HEART_COUNT = window.innerWidth < 700 ? 8 : 14;

function createFloaty(){
  const el = document.createElement('div');
  el.className = 'floaty';
  el.innerHTML = `<svg width="${10 + Math.random()*10}" height="${10 + Math.random()*10}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.4-9.5 9-9.5 9z"/></svg>`;
  el.style.left = Math.random() * 100 + 'vw';
  el.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
  const duration = 14 + Math.random() * 14;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = (Math.random() * -duration) + 's';
  floatiesContainer.appendChild(el);
}
for (let i = 0; i < HEART_COUNT; i++) createFloaty();

/* -------------------------------------------------------------------------
   3. COUNTDOWN
   ------------------------------------------------------------------------- */
const targetDate = new Date(CONFIG.weddingDate).getTime();
const elDays = document.getElementById('cd-days');
const elHours = document.getElementById('cd-hours');
const elMins = document.getElementById('cd-mins');
const elSecs = document.getElementById('cd-secs');

function pad(n){ return String(n).padStart(2, '0'); }

function updateCountdown(){
  const now = Date.now();
  let diff = targetDate - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  elDays.textContent = pad(days);
  elHours.textContent = pad(hours);
  elMins.textContent = pad(mins);
  elSecs.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* -------------------------------------------------------------------------
   4. SCROLL REVEAL — IntersectionObserver fade/slide-in
   ------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* -------------------------------------------------------------------------
   5. BACK TO TOP
   ------------------------------------------------------------------------- */
const backToTop = document.getElementById('backToTop');
function toggleBackToTop(){
  backToTop.classList.toggle('is-visible', window.scrollY > 600);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* -------------------------------------------------------------------------
   6. MODAL — Formas de contribuição
   ------------------------------------------------------------------------- */
const contribModal = document.getElementById('contribModal');
document.getElementById('openContribModal').addEventListener('click', () => openModal(contribModal));
contribModal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(contribModal)));

function openModal(modal){
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(modal){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Copy IBAN / phone to clipboard
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      const original = btn.textContent;
      btn.textContent = 'Copiado!';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-copied');
      }, 1800);
    } catch (err){
      alert('Não foi possível copiar automaticamente. Valor: ' + value);
    }
  });
});

/* -------------------------------------------------------------------------
   7. GALLERY LIGHTBOX
   ------------------------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src.replace(/\/\d+\/\d+$/, '/1400/1600'); // versão maior
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Close any overlay with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    closeLightbox();
    closeModal(contribModal);
  }
});

/* -------------------------------------------------------------------------
   8. RSVP FORM → WhatsApp Business
   Monta uma mensagem pré-preenchida com os dados do formulário e abre
   uma conversa no WhatsApp do casal (wa.me), evitando a necessidade
   de qualquer backend/servidor.
   ------------------------------------------------------------------------- */
const rsvpForm = document.getElementById('rsvpForm');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(rsvpForm);
  const nome = data.get('nome')?.trim();
  const telefone = data.get('telefone')?.trim();
  const presenca = data.get('presenca');
  const restricoes = data.get('restricoes')?.trim() || 'Nenhuma';
  const mensagem = data.get('mensagem')?.trim() || '—';

  if (!nome || !telefone){
    alert('Por favor preenche o nome e o telefone antes de enviar.');
    return;
  }

  const texto =
`Olá Eufránio & Creuma 💙! Gostaria de confirmar a minha presença no casamento de 

*Nome:* ${nome}
*Telefone:* ${telefone}
*Confirmação:* ${presenca}
*Restrições alimentares:* ${restricoes}
*Mensagem:* ${mensagem}`;

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
});

/* -------------------------------------------------------------------------
   Init
   ------------------------------------------------------------------------- */
highlightActiveLink();
toggleBackToTop();