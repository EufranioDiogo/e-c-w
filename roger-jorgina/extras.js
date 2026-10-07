/* ===== extras.js — load AFTER script.js ===== */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EVENT = {
    title: "Casamento de Jorgina & Roger",
    date: "20270424", next: "20270425",   // dia inteiro (local ainda por definir)
    place: "Luanda, Angola",
    desc: "Convite formal a seguir. " + location.origin + location.pathname
  };

  /* Toast */
  const toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status");
  document.body.append(toast);
  let tt;
  const say = (m) => { toast.textContent = m; toast.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("is-on"), 2600); };

  /* 1. Convite personalizado: ?c=Maria%20e%20família */
  const guest = (new URLSearchParams(location.search).get("c") || "").trim().slice(0, 60);
  if (guest) {
    const p = document.createElement("p");
    p.className = "cover__guest"; p.textContent = "Para " + guest;
    $(".cover__content").prepend(p);
    const n = $("#guestName"); if (n) n.value = guest;
  }
  $("#openBtn").addEventListener("click", () => navigator.vibrate?.(14));

  /* 2. Barra de progresso */
  const bar = document.createElement("div"); bar.className = "progress";
  document.body.append(bar);
  let tick = false;
  addEventListener("scroll", () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.scale = (h > 0 ? Math.min(scrollY / h, 1) : 0) + " 1";
      tick = false;
    });
  }, { passive: true });

  /* 3. Adicionar ao calendário + partilhar */
  const ics = () => [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//JR//SaveTheDate//PT","BEGIN:VEVENT",
    "UID:jr-2027-04-24@savethedate",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ""),
    "DTSTART;VALUE=DATE:" + EVENT.date, "DTEND;VALUE=DATE:" + EVENT.next,
    "SUMMARY:" + EVENT.title, "LOCATION:" + EVENT.place,
    "DESCRIPTION:" + EVENT.desc,
    "BEGIN:VALARM","TRIGGER:-P7D","ACTION:DISPLAY","DESCRIPTION:Falta 1 semana","END:VALARM",
    "END:VEVENT","END:VCALENDAR"].join("\r\n");

  const box = document.createElement("div");
  box.className = "actions";
  box.innerHTML = '<p class="actions__title">Guarde esta data</p>' +
    '<button class="btn btn--solid" id="addIcs" type="button">Adicionar ao calendário</button>' +
    '<a class="btn btn--ghost" id="addGoogle" target="_blank" rel="noopener">Google Agenda</a>' +
    '<button class="btn btn--ghost" id="shareBtn" type="button">Partilhar convite</button>';
  const cd = $("#countdownDone"); cd?.after(box);
  $("#addGoogle").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(EVENT.title) + "&dates=" + EVENT.date + "/" + EVENT.next +
    "&location=" + encodeURIComponent(EVENT.place) + "&details=" + encodeURIComponent(EVENT.desc);
  $("#addIcs").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics()], { type: "text/calendar" }));
    a.download = "save-the-date-J-R.ics"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    say("Data guardada no seu calendário");
  });
  $("#shareBtn").addEventListener("click", async () => {
    const url = location.origin + location.pathname;
    try {
      if (navigator.share) await navigator.share({ title: document.title, text: "Save the date: J & R · 24 de abril de 2027", url });
      else { await navigator.clipboard.writeText(url); say("Ligação copiada"); }
    } catch {}
  });

  /* 4. Nº de pessoas no RSVP (entra na mensagem de WhatsApp) */
  const form = $("#rsvpForm"), area = $("#guestMsg");
  if (form && area) {
    const row = document.createElement("div");
    row.className = "party";
    row.innerHTML = '<span class="party__lbl" id="partyLbl">Quantas pessoas</span>' +
      '<div class="party__ctl" role="group" aria-labelledby="partyLbl">' +
      '<button type="button" aria-label="Menos uma pessoa">−</button>' +
      '<output class="party__n" aria-live="polite">1</output>' +
      '<button type="button" aria-label="Mais uma pessoa">+</button></div>';
    $(".choice", form).after(row);
    const out = $(".party__n", row), [minus, plus] = row.querySelectorAll("button");
    let n = 1;
    const set = (v) => { n = Math.max(1, Math.min(8, v)); out.textContent = n; };
    minus.onclick = () => set(n - 1); plus.onclick = () => set(n + 1);
    // capture: corre antes do handler original e acrescenta a contagem à mensagem
    form.addEventListener("submit", () => {
      const yes = $('[data-choice="yes"]', form).getAttribute("aria-pressed") === "true";
      if (yes && n > 1 && !/Seremos \d+/.test(area.value))
        area.value = `Seremos ${n} pessoas.` + (area.value ? "\n" + area.value : "");
      if (yes && !reduce) burst(form.getBoundingClientRect());
    }, true);
  }

  /* 5. Pétalas ao confirmar presença */
  function burst(r) {
    const x0 = r.left + r.width / 2, y0 = r.bottom - 40;
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("i"); p.className = "burst";
      p.style.left = x0 + "px"; p.style.top = y0 + "px";
      document.body.append(p);
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, d = 120 + Math.random() * 200;
      p.animate([
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 90}px) rotate(${Math.random() * 540}deg)`, opacity: 0 }
      ], { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => p.remove();
    }
  }
})();