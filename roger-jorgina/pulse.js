/* ===== pulse.js — load AFTER hero.js =====
   O casal pulsa ao ritmo da música (graves analisados com Web Audio).
   Não precisa de alterar o script.js: apanha o <audio> quando é tocado. */
(() => {
  const hero = document.querySelector(".hero");
  const art = hero && hero.querySelector(".hero__art");
  if (!art || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const musicBtn = document.getElementById("musicBtn");
  let ctx, an, data, el = null, raf = 0, p = 0, peak = .25, sim = false;

  function hook(a) {
    el = a;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();                       // criado dentro do toque em "Abrir convite"
      const src = ctx.createMediaElementSource(a);
      an = ctx.createAnalyser();
      an.fftSize = 512; an.smoothingTimeConstant = .6;
      src.connect(an); an.connect(ctx.destination);
      ctx.resume();
      data = new Uint8Array(an.frequencyBinCount);
    } catch (e) { an = null; }
  }

  const orig = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const r = orig.apply(this, arguments);
    if (!el && this instanceof HTMLAudioElement) hook(this);
    if (ctx && ctx.state === "suspended") ctx.resume();
    kick();
    return r;
  };

  function frame(t) {
    const muted = musicBtn && musicBtn.classList.contains("is-muted");
    const playing = el ? !el.paused : (sim && !muted);
    let raw = 0;
    if (an && playing) {                     // média dos graves (~90–500 Hz)
      an.getByteFrequencyData(data);
      let s = 0; for (let i = 1; i <= 6; i++) s += data[i];
      raw = s / 6 / 255;
    } else if (!el && playing) {             // sem ficheiro (melodia sintetizada): batida simulada a 66 bpm
      const ph = (t / 1000) / (60 / 66);
      raw = Math.pow(Math.max(0, Math.cos(ph * 2 * Math.PI)), 6) * .8 + .1;
    }
    peak = Math.max(raw, peak * .997, .12);  // normaliza para o volume da faixa
    const n = Math.pow(raw / peak, 2.2);
    p = n > p ? p + (n - p) * .6 : p * .9;   // ataque rápido, queda suave

    art.style.scale = (1 + p * .05).toFixed(4);
    hero.style.setProperty("--p", p.toFixed(3));

    if (playing || p > .003) raf = requestAnimationFrame(frame);
    else { raf = 0; art.style.scale = ""; hero.style.setProperty("--p", 0); }
  }

  function kick() {
    art.classList.add("is-pulsing");
    if (!raf) raf = requestAnimationFrame(frame);
  }

  document.getElementById("openBtn").addEventListener("click", () => {
    setTimeout(() => { if (!el) { sim = true; kick(); } }, 1000);
  }, { once: true });
})();