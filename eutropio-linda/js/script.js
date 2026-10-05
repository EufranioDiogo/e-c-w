const cover = document.getElementById('cover');
const bird = document.getElementById('bird');
const petalsBox = document.getElementById('petals');
const audio = document.getElementById("wedding-music");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

async function tryPlayMusic() {
    if (!audio) return;
    try {
      await audio.play();
      setMusicState(true);
    } catch (err) {
      setMusicState(false);
    }
}
  
/* ---- Abertura espetacular: pétalas + portas florais que se abrem ---- */
function spawnPetals(n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    const s = 10 + Math.random() * 16;
    p.className = 'petal';
    p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s * 1.3}px;` +
      `--dx:${(Math.random() - .5) * 240}px;--r:${Math.random() * 720 - 360}deg;` +
      `animation-duration:${4 + Math.random() * 4}s;animation-delay:${Math.random() * 2.5}s`;
    petalsBox.appendChild(p);
  }
}

function setGuestName() {
  const guestName = urlParams.get('guest');
  const guestTable = urlParams.get('table');
  console.log(guestTable)

  const guestNameElement = document.querySelector('.guest-name');
  
  if (guestNameElement) {
    const personSpan = guestNameElement.querySelector('.guest-person') || guestNameElement;
    const tableSpan = guestNameElement.querySelector('.guest-table');

    personSpan.textContent = guestName ? `${guestName}!` : 'Sem convidado definido';

    if (tableSpan) {
      tableSpan.textContent = guestTable ? `${guestTable}` : 'Mesa por ser definida';
    }
  }
}

function openInvite() {
  if (cover.classList.contains('open')) return;
  spawnPetals(60);
  cover.classList.add('open');
  setTimeout(() => {
    document.body.classList.remove('locked');
    cover.classList.add('gone');
    bird.classList.add('show');
    revealCheck();
  }, 2200);
  setTimeout(() => cover.remove(), 7000);
  tryPlayMusic();
  setGuestName();
}
document.getElementById('seal').addEventListener('click', openInvite);

/* ---- Revelar elementos ao scroll ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
const revealCheck = () => document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---- Pomba que voa ao longo do scroll ---- */
let cx = innerWidth * .2, cy = innerHeight * .3, angle = 0, dir = 1, t = 0;

function target() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  const w = innerWidth, h = innerHeight;
  return {
    x: w * (.5 + .36 * Math.sin(p * Math.PI * 6 - 1)),
    y: h * (.22 + .5 * p) + Math.sin(p * Math.PI * 9) * h * .08
  };
}

function fly() {
  t += .02;
  const g = target();
  const tx = g.x + Math.sin(t * 2) * 14;
  const ty = g.y + Math.cos(t * 3) * 10;
  const dx = tx - cx, dy = ty - cy;
  cx += dx * .045; cy += dy * .045;
  if (Math.abs(dx) > .6) dir += ((dx > 0 ? 1 : 1) - dir) * 1;
  angle += ((dy * .6 * dir) - angle) * .1;
  const a = Math.max(-25, Math.min(25, angle));
  bird.style.transform = `translate(${cx - 45}px,${cy - 30}px) scaleX(${dir}) `;
  requestAnimationFrame(fly);
}
fly();

/* ---- Contagem decrescente (Luanda, UTC+1) ---- */
const wedding = new Date('2026-10-30T14:00:00+01:00');
function tick() {
  let s = Math.max(0, Math.floor((wedding - Date.now()) / 1000));
  const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
  for (const k in v) document.getElementById(k).textContent = v[k];
}
tick(); setInterval(tick, 1000);

/* ---- Confirmação de presença via WhatsApp ---- */
const WHATSAPP = '244975598874';
document.getElementById('rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const n = document.getElementById('pessoas').value;
  const p = document.querySelector('input[name=p]:checked').value;
  const msg = document.getElementById('msg').value.trim();
  const text = `Olá Eutrópio e Linda! Sou ${nome} e ${p} no casamento de Eutrópio & Linda (${n} pessoa${n > 1 ? 's' : ''}).` + (msg ? `\n\n${msg}` : '');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
});