(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("guest");
  const partySize = Number.parseInt(params.get("guests"), 10);
  const nameElement = document.getElementById("guest-name");
  const partyElement = document.getElementById("party-size");

  if (guestName && nameElement) {
    nameElement.textContent = guestName;
    document.title = `Um convite especial para ${guestName} · Aníbal & Tílcia`;
  }

  if (Number.isInteger(partySize) && partySize > 0 && partyElement) {
    partyElement.textContent = `Este convite é válido para ${partySize} ${partySize === 1 ? "pessoa" : "pessoas"}.`;
    partyElement.hidden = false;
  }
})();
