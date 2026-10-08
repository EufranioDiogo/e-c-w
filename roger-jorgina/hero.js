/* ===== hero.js — load AFTER extras.js ===== */
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nomes empilhados */
  const h1 = hero.querySelector(".hero__mono");
  h1.setAttribute("aria-label", "Jorgina e Roger");
  h1.innerHTML = '<span class="nm nm--a" aria-hidden="true">Jorgina</span>' +
    '<span class="amp" aria-hidden="true">&amp;</span>' +
    '<span class="nm nm--b" aria-hidden="true">Roger</span>';

  /* Data: o 24 como protagonista */
  const dt = hero.querySelector(".hero_date");
  dt.setAttribute("aria-label", "24 de abril de 2027");
  dt.innerHTML = '<span class="d-num" aria-hidden="true">24</span><span class="d-rule" aria-hidden="true"></span>' +
    '<span class="d-txt" aria-hidden="true"><span class="d-mo">abril</span><span class="d-yr">2027</span></span>';

  /* Casal dentro de um halo */
  const img = hero.querySelector(".story__img");
  const art = document.createElement("div");
  art.className = "hero__art";
  img.before(art); art.append(img);

  /* Quantos dias faltam (conta a subir) */
  const left = document.createElement("p");
  left.className = "hero__left";
  const days = Math.ceil((new Date(CONFIG.weddingDate) - Date.now()) / 864e5);
  if (days > 0) {
    left.innerHTML = 'Faltam <b>0</b> dias';
    dt.after(left);
    const b = left.querySelector("b");
    document.getElementById("openBtn").addEventListener("click", () => {
      if (reduce) { b.textContent = days; return; }
      setTimeout(() => {
        const t0 = performance.now(), dur = 1800;
        const step = (t) => {
          const k = Math.min((t - t0) / dur, 1);
          b.textContent = Math.round(days * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, 4200);
    }, { once: true });
    if (days === 1) left.innerHTML = 'Falta <b>1</b> dia';
  }

  const cue = document.createElement("span");
  cue.className = "hero__cue"; cue.setAttribute("aria-hidden", "true");
  hero.append(cue);

  /* Parallax suave: rato (desktop) + scroll */
  if (reduce) return;
  let mx = 0, my = 0, ticking = false;
  const apply = () => {
    const s = Math.min(scrollY, 700);
    art.style.transform = `translate3d(${mx * 10}px,${my * 8 + s * .07}px,0) scale(${1 + s * .00008})`;
    ticking = false;
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req();
  }, { passive: true });
  addEventListener("scroll", req, { passive: true });
})();