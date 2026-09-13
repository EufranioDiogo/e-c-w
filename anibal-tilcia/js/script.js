async function submitForm(e, body) {
  e.preventDefault();
  const SCRIPT_URL = window.ENV.SCRIPT_URL;
  
  const rsvpForm = document.getElementById("rsvp-form");
  const submitBtn = rsvpForm.querySelector(".rsvp__submit");
  const errorEl = document.getElementById("rsvp-error");
  const successEl = document.getElementById("rsvp-success");
  const successTitle = document.getElementById("rsvp-success-title");
  const successText = document.getElementById("rsvp-success-text");

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      signal: AbortSignal.timeout(10000), // 10s timeout
      mode: "no-cors", // necessário para Apps Script
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Como "no-cors" não permite ler a resposta, assume-se sucesso

    rsvpForm.style.display = "none";
    if (body.presence === true) {
      successTitle.textContent = `Obrigado, ${body.name}!`;
      successText.textContent =
        "Mal podemos esperar para celebrar este dia convosco.";
    } else {
      successTitle.textContent = `Vamos sentir a vossa falta, ${body.name}.`;
      successText.textContent =
        "Obrigado por nos avisarem — ficará sempre no nosso coração.";
    }
  } catch (error) {
    successTitle.textContent = `${body.name}, Infelizmente não foi possível confirmar a sua presença, tente mais tarde e contacte o anfitrião!`;
  }

  submitBtn.classList.remove("is-loading");
  submitBtn.disabled = false;

  rsvpForm.hidden = true;
  successEl.hidden = false;
}

(() => {
  "use strict";

  /* =========================================================
     WEDDING DATE — edit this if the date ever changes
     ========================================================= */
  const WEDDING_DATE = new Date("2026-12-19T19:00:00");

  /* =========================================================
     INVITATION OPENING + MUSIC
     ========================================================= */
  const cover = document.getElementById("invitation-cover");
  const card = document.getElementById("invitation-card");
  const openBtn = document.getElementById("open-invitation");
  const header = document.getElementById("site-header");
  const musicWrap = document.getElementById("music-control");
  const musicBtn = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const audio = document.getElementById("wedding-music");

  // Lock scroll behind the cover until it's opened.
  document.body.classList.add("invitation-opening");

  let hasOpened = false;

  function setMusicState(isPlaying) {
    if (!musicWrap || !musicBtn) return;
    musicWrap.classList.toggle("music-playing", isPlaying);
    musicBtn.setAttribute("aria-pressed", String(isPlaying));
    musicBtn.setAttribute(
      "aria-label",
      isPlaying ? "Pausar música" : "Reproduzir música",
    );
    if (musicLabel) {
      musicLabel.textContent = isPlaying ? "A tocar" : "Música";
    }
  }

  async function tryPlayMusic() {
    if (!audio) return;
    setupVisualizer();
    if (audioCtx && audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
      } catch (e) {
        /* ignore */
      }
    }
    try {
      await audio.play();
      setMusicState(true);
    } catch (err) {
      // Autoplay was blocked — leave it paused, the visible button lets
      // the guest start it with a click.
      setMusicState(false);
    }
  }

  /* =========================================================
     MUSIC VISUALIZER — warm equalizer bars driven by the real
     audio signal (Web Audio API), so it reflects whatever is
     actually playing rather than a generic canned animation.
     ========================================================= */
  const visCanvas = document.getElementById("music-visualizer");
  let audioCtx = null;
  let analyser = null;

  function setupVisualizer() {
    if (!visCanvas || !audio || audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const sourceNode = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (err) {
      // Web Audio unavailable/blocked — the toggle still works, just no bars.
      audioCtx = null;
      analyser = null;
    }
  }

  function drawVisualizer() {
    if (!visCanvas) return;
    const ctx = visCanvas.getContext("2d");
    const w = visCanvas.width,
      h = visCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const barCount = 5;
    const gap = 3;
    const barWidth = (w - gap * (barCount - 1)) / barCount;

    let levels;
    if (analyser && audio && !audio.paused) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const step = Math.max(1, Math.floor(data.length / barCount));
      levels = Array.from({ length: barCount }, (_, i) => data[i * step] / 255);
    } else {
      // gentle idle "breathing" while paused, so it never looks broken
      const t = Date.now() / 600;
      levels = Array.from(
        { length: barCount },
        (_, i) => 0.25 + 0.18 * Math.sin(t + i),
      );
    }

    levels.forEach((lvl, i) => {
      const barH = Math.max(2, lvl * h);
      const x = i * (barWidth + gap);
      const y = h - barH;
      ctx.fillStyle = "#ad9557"; // warm gold, echoes the bolero's warmth
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barH);
      }
    });

    requestAnimationFrame(drawVisualizer);
  }

  if (visCanvas) drawVisualizer();

  function openInvitation() {
    if (hasOpened || !card) return;
    hasOpened = true;
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 'smooth' animates the scroll; 'instant' jumps immediately
    });
    card.classList.add("is-opening");
    if (openBtn) openBtn.disabled = true;

    // start the soundtrack the moment the guest interacts — this click
    // counts as a user gesture, so autoplay restrictions are satisfied
    tryPlayMusic();

    const revealSite = () => {
      document.body.classList.remove("invitation-opening");
      document.body.classList.add("site-unlocked");

      if (cover) cover.classList.add("is-open");
      if (header) header.classList.add("is-visible");
      if (musicWrap) musicWrap.classList.add("is-visible");

      // Only now do the reveal-on-scroll elements start being observed —
      // doing this earlier (while the invitation still covers the page)
      // meant the fade-in already finished, invisibly, before the guest
      // ever saw it.
      requestAnimationFrame(setupScrollReveal);

      // hand focus to the page for keyboard/screen-reader users
      window.setTimeout(() => {
        const main = document.querySelector(".hero");
        if (main) main.setAttribute("tabindex", "-1");
        if (main) main.focus({ preventScroll: true });
      }, 50);
    };

    const front = card.querySelector(".invitation-card__front");
    if (front) {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        revealSite();
      };
      front.addEventListener("transitionend", finish, { once: true });
      // safety net in case transitionend doesn't fire (reduced motion, etc.)
      window.setTimeout(finish, 1400);
    } else {
      revealSite();
    }
  }

  if (openBtn) openBtn.addEventListener("click", openInvitation);
  if (card) {
    card.addEventListener("click", (e) => {
      // avoid double-handling when the button itself was clicked
      if (e.target === openBtn || (openBtn && openBtn.contains(e.target)))
        return;
      openInvitation();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", async () => {
      if (!audio) return;
      if (audio.paused) {
        await tryPlayMusic();
      } else {
        audio.pause();
        setMusicState(false);
      }
    });
  }

  // Keep the icon/label honest if playback stops for any external reason
  // (e.g. the browser tab was muted, or another tab claimed audio focus).
  if (audio) {
    audio.addEventListener("pause", () => setMusicState(false));
    audio.addEventListener("play", () => setMusicState(true));
  }

  /* =========================================================
     STICKY HEADER STATE ON SCROLL
     ========================================================= */
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("is-scrolled", window.scrollY > 10);
      },
      { passive: true },
    );
  }

  /* =========================================================
     MOBILE NAV TOGGLE
     ========================================================= */
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.classList.toggle("is-active", isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("is-active");
      });
    });
  }

  /* =========================================================
     FLIP COUNTDOWN
     ========================================================= */
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  const lastValues = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n) {
    return String(Math.max(n, 0)).padStart(2, "0");
  }

  function flipTo(box, newValue) {
    const valueEl = box.querySelector(".flip-box__value");
    const flap = box.querySelector(".flip-box__flap");
    const flapInner = box.querySelector(".flip-box__flap-inner");

    flap.classList.add("is-flipping");
    valueEl.textContent = newValue;

    const onEnd = () => {
      flap.removeEventListener("transitionend", onEnd);
      flap.classList.remove("is-flipping");
      flap.style.transition = "none";
      flapInner.textContent = newValue;
      void flap.offsetHeight;
      flap.style.transition = "";
    };
    flap.addEventListener("transitionend", onEnd, { once: true });
  }

  function updateUnit(key, value) {
    const formatted = pad(value);
    const box = units[key];
    if (!box) return;

    if (lastValues[key] === null) {
      box.querySelector(".flip-box__value").textContent = formatted;
      box.querySelector(".flip-box__flap-inner").textContent = formatted;
      lastValues[key] = formatted;
      return;
    }

    if (lastValues[key] !== formatted) {
      flipTo(box, formatted);
      lastValues[key] = formatted;
    }
  }

  function tick() {
    const now = new Date().getTime();
    let diff = WEDDING_DATE.getTime() - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateUnit("days", days);
    updateUnit("hours", hours);
    updateUnit("minutes", minutes);
    updateUnit("seconds", seconds);
  }

  tick();
  setInterval(tick, 1000);

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */
  const revealEls = document.querySelectorAll("[data-reveal]");
  let revealStarted = false;

  function setupScrollReveal() {
    if (revealStarted) return;
    revealStarted = true;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
      );

      revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 90}ms`;
        io.observe(el);
      });
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Fallback: if there's no invitation cover on this page at all, start
  // reveal right away instead of waiting for an "openInvitation" that
  // will never fire.
  if (!cover) setupScrollReveal();

  /* =========================================================
     RSVP FORM
     ========================================================= */
  const rsvpForm = document.getElementById("rsvp-form");

  if (rsvpForm) {
    const attendingInput = document.getElementById("rsvp-attending");
    const choiceBtns = rsvpForm.querySelectorAll(".choice__btn");
    const guestsWrap = document.getElementById("rsvp-guests-wrap");
    const guestsInput = document.getElementById("rsvp-guests");
    const messageMobileNumberInput = document.getElementById(
      "rsvp-message-mobile-number",
    );
    const messageInput = document.getElementById("rsvp-message");
    const errorEl = document.getElementById("rsvp-error");
    const submitBtn = rsvpForm.querySelector(".rsvp__submit");
    const nameInput = document.getElementById("rsvp-name");

    choiceBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        choiceBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const choice = btn.getAttribute("data-choice");
        attendingInput.value = choice;
        errorEl.textContent = "";

        if (choice === "sim") {
          guestsWrap.classList.add("is-open");
        } else {
          guestsWrap.classList.remove("is-open");
          guestsInput.value = "";
        }
      });
    });

    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const name = nameInput.value.trim();
      const attending = attendingInput.value;
      const messageMobileNumber = messageMobileNumberInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        errorEl.textContent = "Por favor, indique o seu nome.";
        nameInput.focus();
        return;
      }
      if (!attending) {
        errorEl.textContent = "Por favor, confirme se estará presente.";
        return;
      }

      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;

      const body = {
        name: name,
        presence: attending === "sim" ? true : false,
        quant_people:
          !guestsInput.value.trim().length !== 0
            ? Number(guestsInput.value.trim())
            : 0,
        message: message,
        mobile_number: messageMobileNumber,
      };

      submitForm(e, body)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error("Erro ao enviar formulário:", error);
        });
    });
  }

  /* =========================================================
     COPY TO CLIPBOARD (bank details)
     ========================================================= */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const row = btn.closest(".gift__copy-row");
      const valueEl = row ? row.querySelector("[data-copy]") : null;
      const text = valueEl ? valueEl.getAttribute("data-copy") : "";
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast("Copiado!");
      } catch (err) {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
          showToast("Copiado!");
        } catch (e) {
          showToast("Não foi possível copiar");
        }
        document.body.removeChild(temp);
      }
    });
  });

  /* =========================================================
     MAP LINKS
     ========================================================= */
  document.querySelectorAll("[data-map]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const place = btn.getAttribute("data-map");
      const url =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(place);
      window.open(url, "_blank", "noopener");
    });
  });

  /* =========================================================
     SUBTLE PARALLAX ON HERO FLORALS
     ========================================================= */
  const florals = document.querySelectorAll(".floral");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const shift = Math.min(y * 0.08, 34);
        florals.forEach((el) => {
          const isTop =
            el.classList.contains("corner-tl") ||
            el.classList.contains("corner-tr");
          el.style.setProperty("--shift", `${isTop ? -shift : shift}px`);
        });
        ticking = false;
      });
    },
    { passive: true },
  );
})();
