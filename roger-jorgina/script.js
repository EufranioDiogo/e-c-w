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
  musicUrl: ""
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
      html += `<li class="is-day" aria-label="${d} de abril, o dia do casamento">${heart}<span>${d}</span></li>`;
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
    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
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
  setTimeout(() => (btn.textContent = "Copiar IBAN"), 2500);
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
