/* =========================================================
   Configuração: alterem estes valores
   ========================================================= */
const CONFIG = {
  // Data e hora da cerimónia (hora de Angola, UTC+1)
  weddingDate: "2027-04-24T16:00:00+01:00",
  weddingDay: 24,
  // Número de WhatsApp que recebe as confirmações (só dígitos, com indicativo)
  whatsapp: "244900000000",
  // Música de fundo: coloquem um ficheiro (ex.: "musica.mp3") na mesma pasta
  // e escrevam o nome aqui. Vazio = usa a melodia de caixinha de música incluída.
  musicUrl: "./resources/audio/turning_the_page.mp3"
};

/* ===== Capa e abertura ===== */
const cover = document.getElementById("cover");
const invite = document.getElementById("invite");
const openBtn = document.getElementById("openBtn");
const musicBtn = document.getElementById("musicBtn");

document.body.classList.add("is-locked");

openBtn.addEventListener("click", () => {
  Music.start();
  cover.classList.add("is-open");
  Motion.start();
  invite.removeAttribute("aria-hidden");
  document.body.classList.remove("is-locked");
  window.scrollTo(0, 0);
  musicBtn.hidden = false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => {
    cover.classList.add("is-gone");
    document.querySelector(".hero__mono").setAttribute("tabindex", "-1");
    document.querySelector(".hero__mono").focus({ preventScroll: true });
  }, reduce ? 50 : 1450);
});

musicBtn.addEventListener("click", () => {
  const playing = Music.toggle();
  musicBtn.classList.toggle("is-muted", !playing);
  musicBtn.setAttribute("aria-label", playing ? "Pausar música" : "Tocar música");
});

/* ===== Música ===== */
const Music = (() => {
  let ctx, master, reverb, timer, audioEl;
  let playing = false;
  let nextBar = 0, bar = 0;
  const BEAT = 60 / 66;           // andamento calmo
  const BAR = BEAT * 4;

  const NOTES = { C: 0, "C#": 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  const hz = (n) => {
    const m = n.match(/^([A-G][#b]?)(\d)$/);
    const midi = 12 * (Number(m[2]) + 1) + NOTES[m[1]];
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  // Fá maior: F – Dm – Bb – C – F – Am – Bb – C
  const CHORDS = [
    ["F3", "A3", "C4", "F4"], ["D3", "F3", "A3", "D4"], ["Bb2", "D3", "F3", "Bb3"], ["C3", "E3", "G3", "C4"],
    ["F3", "A3", "C4", "F4"], ["A2", "C3", "E3", "A3"], ["Bb2", "D3", "F3", "Bb3"], ["C3", "E3", "G3", "C4"]
  ];
  const MELODY = [
    [["A5", 2], ["C6", 2]], [["A5", 2], ["F5", 2]], [["F5", 2], ["D6", 2]], [["E5", 4]],
    [["A5", 2], ["C6", 2]], [["C6", 2], ["E6", 2]], [["D6", 2], ["F5", 2]], [["G5", 4]]
  ];
  const ARP = [0, 1, 2, 3, 2, 1, 2, 1];

  function makeReverb() {
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    conv.connect(wet).connect(master);
    return conv;
  }

  function bell(freq, t, dur, vol) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(master);
    g.connect(reverb);
    [[1, 1], [2, 0.28], [3.01, 0.08]].forEach(([mult, amp]) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * mult;
      og.gain.value = amp;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    });
  }

  function pad(notes, t, dur) {
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 800;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.035, t + 1.2);
    g.gain.setValueAtTime(0.035, t + dur - 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.8);
    lp.connect(g);
    g.connect(master);
    g.connect(reverb);
    notes.slice(0, 3).forEach((n) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = hz(n);
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 1);
    });
  }

  function scheduleBar(i, t) {
    const chord = CHORDS[i % 8];
    pad(chord, t, BAR);
    ARP.forEach((idx, k) => {
      const n = chord[idx];
      const up = n.replace(/\d$/, (o) => String(Number(o) + 1));
      bell(hz(up), t + k * BEAT / 2, 1.6, 0.05);
    });
    // a melodia entra a partir da segunda volta
    if (i >= 8) {
      let beat = 0;
      MELODY[i % 8].forEach(([n, len]) => {
        bell(hz(n), t + beat * BEAT, len * BEAT + 1.2, 0.07);
        beat += len;
      });
    }
  }

  function tick() {
    while (nextBar < ctx.currentTime + 1.5) {
      scheduleBar(bar, nextBar);
      nextBar += BAR;
      bar++;
    }
  }

  function startSynth() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 2.5);
    master.connect(ctx.destination);
    reverb = makeReverb();
    nextBar = ctx.currentTime + 0.15;
    tick();
    timer = setInterval(tick, 250);
  }

  return {
    start() {
      if (playing) return;
      playing = true;
      if (CONFIG.musicUrl) {
        audioEl = new Audio(CONFIG.musicUrl);
        audioEl.loop = true;
        audioEl.volume = 0.6;
        audioEl.currentTime = 45;
        audioEl.play().catch(() => { playing = false; musicBtn.classList.add("is-muted"); });
      } else {
        startSynth();
      }
    },
    toggle() {
      playing = !playing;
      if (audioEl) playing ? audioEl.play() : audioEl.pause();
      if (ctx) playing ? ctx.resume() : ctx.suspend();
      return playing;
    },
    isPlaying: () => playing,
    suspendForHidden(hidden) {
      if (!playing) return;
      if (audioEl) hidden ? audioEl.pause() : audioEl.play();
      if (ctx) hidden ? ctx.suspend() : ctx.resume();
    }
  };
})();

document.addEventListener("visibilitychange", () => Music.suspendForHidden(document.hidden));

/* ===== Calendário (abril de 2027 começa numa quinta-feira) ===== */
(function buildCalendar() {
  const grid = document.getElementById("calGrid");
  const first = new Date(2027, 3, 1).getDay(); // 0 = domingo
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C12 21 3 15.5 3 9.5 3 6.5 5.4 4.5 8 4.5c1.7 0 3.1.9 4 2.2.9-1.3 2.3-2.2 4-2.2 2.6 0 5 2 5 5 0 6-9 11.5-9 11.5z"/></svg>';
  let html = "";
  for (let i = 0; i < first; i++) html += '<li aria-hidden="true"></li>';
  for (let d = 1; d <= 30; d++) {
    if (d === CONFIG.weddingDay) {
      html += `<li class="is-day" aria-label="${d} de abril, o dia do casamento">${heart}<span style="color: #fff;">${d}</span></li>`;
    } else {
      html += `<li>${d}</li>`;
    }
  }
  grid.innerHTML = html;
})();

/* ===== Contagem decrescente ===== */
(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const els = {};
  document.querySelectorAll(".countdown__num").forEach((el) => (els[el.dataset.unit] = el));
  const pad = (n) => String(n).padStart(2, "0");
  // Só substitui o número quando muda, para a animação de "queda" correr nesse momento
  const put = (el, v) => {
    if (el.dataset.v === v) return;
    el.dataset.v = v;
    const s = document.createElement("span");
    s.className = "countdown__digit";
    s.textContent = v;
    el.replaceChildren(s);
  };
  function update() {
    let diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      document.getElementById("countdown").hidden = true;
      document.getElementById("countdownDone").hidden = false;
      return;
    }
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    put(els.d, pad(d));
    put(els.h, pad(h));
    put(els.m, pad(m));
    put(els.s, pad(s));
    setTimeout(update, 1000 - (Date.now() % 1000));
  }
  update();
})();

/* ===== Copiar IBAN ===== */
document.getElementById("copyIban").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const text = document.getElementById("iban").textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "IBAN copiado";
  } catch {
    const r = document.createRange();
    r.selectNodeContents(document.getElementById("iban"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    btn.textContent = "IBAN selecionado, copie-o";
  }
  btn.classList.add("is-done");
  setTimeout(() => {
    btn.textContent = "Copiar IBAN";
    btn.classList.remove("is-done");
  }, 2500);
});

/* ===== Confirmação de presença ===== */
(function rsvp() {
  const form = document.getElementById("rsvpForm");
  const err = document.getElementById("rsvpError");
  const ok = document.getElementById("rsvpOk");
  const btns = form.querySelectorAll(".choice__btn");
  let choice = null;

  btns.forEach((b) =>
    b.addEventListener("click", () => {
      choice = b.dataset.choice;
      btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      err.textContent = "";
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("guestName");
    const name = nameEl.value.trim();
    const msg = document.getElementById("guestMsg").value.trim();
    if (!name) { err.textContent = "Escreva o seu nome para confirmar."; nameEl.focus(); return; }
    if (!choice) { err.textContent = "Escolha se vai estar presente ou não."; btns[0].focus(); return; }
    err.textContent = "";
    const lines = [
      `Olá J & R! Sou ${name}.`,
      choice === "yes" ? "Confirmo a minha presença no dia 24 de abril de 2027." : "Infelizmente não poderei estar presente no dia 24 de abril de 2027.",
      msg ? `\n${msg}` : ""
    ];
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n").trim())}`;
    window.open(url, "_blank", "noopener");
    ok.textContent = "A abrir o WhatsApp para enviar a sua mensagem.";
  });
})();

/* ===== Animações =====
   Prepara as classes ao carregar (o convite está escondido atrás da capa)
   e só começa a revelar quando o convite é aberto. */
const Motion = (() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);
  const watched = [];
  let started = false;

  // Marca elementos para animar; --d é o atraso, step escalona vários elementos
  function tag(sel, classes, { delay = 0, step = 0 } = {}) {
    $$(sel).forEach((el, i) => {
      el.classList.add("js-anim", ...classes.split(" ").filter(Boolean));
      el.style.setProperty("--d", `${(delay + i * step).toFixed(2)}s`);
      watched.push(el);
    });
  }

  // Traços SVG: normaliza o comprimento para poder "desenhá-los"
  function draw(sel, opts) {
    $$(sel).forEach((svg) =>
      $$("circle, path, rect, line, polyline", svg).forEach((shape, k) => {
        shape.setAttribute("pathLength", "1");
        shape.style.setProperty("--k", k);
      })
    );
    tag(sel, "draw", opts);
  }

  // Divide a citação em palavras que aparecem uma a uma
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "word";
      s.style.setProperty("--i", i);
      s.textContent = w;
      el.append(s, " ");
    });
  }

  function fireflies() {
    const story = document.querySelector(".story");
    if (!story) return;
    const layer = document.createElement("div");
    layer.className = "fireflies";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 18; i++) {
      const f = document.createElement("span");
      f.className = "firefly";
      f.style.left = `${rand(4, 96)}%`;
      f.style.top = `${rand(6, 94)}%`;
      f.style.setProperty("--s", `${rand(2, 4.5).toFixed(1)}px`);
      f.style.setProperty("--dx", `${rand(-30, 30).toFixed(0)}px`);
      f.style.setProperty("--dy", `${rand(-40, 20).toFixed(0)}px`);
      f.style.setProperty("--t", `${rand(6, 12).toFixed(1)}s`);
      f.style.setProperty("--tw", `${rand(2.5, 5).toFixed(1)}s`);
      f.style.setProperty("--dl", `${-rand(0, 5).toFixed(1)}s`);
      layer.append(f);
    }
    story.prepend(layer);
  }

  function petals() {
    const layer = document.createElement("div");
    layer.className = "petals";
    layer.setAttribute("aria-hidden", "true");
    const tones = [["#F4F2E2", "#D6D49A"], ["#E8E6C2", "#BAB86C"], ["#FDFCF7", "#E3E1C4"], ["#DCDAA8", "#A6A35A"]];
    const count = window.innerWidth < 500 ? 10 : 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const [c1, c2] = tones[i % tones.length];
      p.className = "petal";
      p.style.setProperty("--x", `${rand(0, 100).toFixed(1)}vw`);
      p.style.setProperty("--s", `${rand(9, 16).toFixed(0)}px`);
      p.style.setProperty("--drift", `${rand(-18, 18).toFixed(0)}vw`);
      p.style.setProperty("--spin", `${rand(-360, 360).toFixed(0)}deg`);
      p.style.setProperty("--dur", `${rand(12, 22).toFixed(1)}s`);
      p.style.setProperty("--delay", `${rand(0, 12).toFixed(1)}s`);
      p.style.setProperty("--fl", `${rand(1.4, 3).toFixed(1)}s`);
      p.style.setProperty("--o", rand(.5, .85).toFixed(2));
      p.style.setProperty("--c1", c1);
      p.style.setProperty("--c2", c2);
      p.append(document.createElement("i"));
      layer.append(p);
    }
    document.body.append(layer);
  }

  // Flores da abertura descem um pouco mais devagar que o scroll
  function parallax() {
    const flora = $$(".hero__flora");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        flora.forEach((f) => (f.style.translate = `0 ${(y * 0.18).toFixed(1)}px`));
        ticking = false;
      });
    }, { passive: true });
  }

  function setup() {
    // Abertura
    tag(".hero__kicker", "reveal", { delay: .5 });
    tag(".hero__mono", "reveal", { delay: .7 });
    tag(".hero__text", "reveal", { delay: 1.3 });
    draw(".rings", { delay: 1.6 });

    // História
    tag(".story__label", "spread", { delay: .1 });
    tag(".story > svg", "vine", { delay: .2 });
    tag(".story__img", "reveal reveal--zoom float", { delay: .3 });
    $$(".story__quote").forEach(splitWords);
    tag(".story__quote", "words");
    fireflies();

    // Calendário
    tag(".calendar__title", "reveal", { delay: .3 });
    tag(".calendar__flora--l", "reveal reveal--left sway", { delay: .3 });
    tag(".calendar__flora--r", "reveal reveal--right sway", { delay: .3 });
    tag(".calendar__week", "reveal reveal--fade", { delay: .1 });
    $$("#calGrid li").forEach((li, i) =>
      li.style.setProperty("--i", li.classList.contains("is-day") ? 46 : i)
    );
    tag("#calGrid", "pop-group");
    tag(".calendar__bigday", "reveal reveal--fade", { delay: 1.4 });
    draw(".calendar__bigday svg", { delay: 1.4 });
    tag(".countdown__item", "reveal", { delay: .1, step: .12 });

    // Confirmação
    tag(".rsvp__img", "reveal reveal--left float", { delay: .1 });
    tag(".rsvp__title, .rsvp__sub", "reveal", { delay: .2, step: .6 });
    tag(".rsvp__form > :not(.rsvp__title):not(.rsvp__sub)", "reveal reveal--right", { delay: .7, step: .07 });

    // Contribuições
    tag(".gift__card", "reveal reveal--zoom shine");
    draw(".gift__icon", { delay: .4 });
    tag(".gift__title", "write", { delay: .6 });
    tag(".gift__card > :not(.gift__icon):not(.divider):not(.gift__title)", "reveal", { delay: .5, step: .1 });
    tag(".divider", "");

    // Encerramento
    tag(".closing__line", "grow");
    tag(".closing__day, .closing__date, .closing__place, .closing__note", "reveal", { delay: .5, step: .15 });
    tag(".closing__mono", "reveal", { delay: 1.2 });
    tag(".closing__flora", "reveal sway", { delay: .2, step: .15 });
  }

  if (!reduce) setup();

  return {
    start() {
      if (started) return;
      started = true;
      document.body.classList.add("is-opened");
      if (reduce || !("IntersectionObserver" in window)) {
        watched.forEach((el) => el.classList.add("is-in"));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      watched.forEach((el) => io.observe(el));
      petals();
      parallax();
    }
  };
})();