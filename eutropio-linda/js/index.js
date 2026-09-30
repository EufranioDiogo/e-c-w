(() => {
  "use strict";

  /* =========================================================
     WEDDING DATE — edit this if the date ever changes
     ========================================================= */
  const WEDDING_DATE = new Date("2026-12-19T19:00:00");

  /* =========================================================
     FLIP COUNTDOWN
     ========================================================= */
  const units = {
    days:    document.querySelector('[data-unit="days"]'),
    hours:   document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  const lastValues = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n){ return String(Math.max(n, 0)).padStart(2, "0"); }

  function flipTo(box, newValue){
    const valueEl = box.querySelector(".flip-box__value");
    const flap = box.querySelector(".flip-box__flap");
    const flapInner = box.querySelector(".flip-box__flap-inner");

    // flap currently shows the OLD number (top half) — start the fold
    flap.classList.add("is-flipping");

    // reveal the new number underneath immediately
    valueEl.textContent = newValue;

    const onEnd = () => {
      flap.removeEventListener("transitionend", onEnd);
      // reset instantly, no transition, loaded with the new number for next tick
      flap.classList.remove("is-flipping");
      flap.style.transition = "none";
      flapInner.textContent = newValue;
      // force reflow so the next flip's transition re-applies cleanly
      void flap.offsetHeight;
      flap.style.transition = "";
    };
    flap.addEventListener("transitionend", onEnd, { once: true });
  }

  function updateUnit(key, value){
    const formatted = pad(value);
    const box = units[key];
    if (!box) return;

    if (lastValues[key] === null){
      // first paint — no animation
      box.querySelector(".flip-box__value").textContent = formatted;
      box.querySelector(".flip-box__flap-inner").textContent = formatted;
      lastValues[key] = formatted;
      return;
    }

    if (lastValues[key] !== formatted){
      flipTo(box, formatted);
      lastValues[key] = formatted;
    }
  }

  function tick(){
    const now = new Date().getTime();
    let diff = WEDDING_DATE.getTime() - now;

    if (diff < 0) diff = 0;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
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

  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 90}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================================================
     COPY TO CLIPBOARD (bank details)
     ========================================================= */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message){
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
        // fallback for older browsers
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand("copy"); showToast("Copiado!"); }
        catch (e) { showToast("Não foi possível copiar"); }
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
      const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
      window.open(url, "_blank", "noopener");
    });
  });

  /* =========================================================
     SUBTLE PARALLAX ON HERO FLORALS
     ========================================================= */
  const florals = document.querySelectorAll(".floral");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const shift = Math.min(y * 0.08, 34);
      florals.forEach((el) => {
        const isTop = el.classList.contains("corner-tl") || el.classList.contains("corner-tr");
        el.style.setProperty("--shift", `${isTop ? -shift : shift}px`);
      });
      ticking = false;
    });
  }, { passive: true });

})();