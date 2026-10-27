(() => {
  "use strict";

  const guests = [
    { name: "Franciliana Almeida", party: 2 },
    { name: "Emerande dos Santos", party: 2 },
    { name: "Tatiana Brito", party: 2 },
    { name: "Franciliana Almeida", party: 2 },
    { name: "Yannick e esposa", party: 2 },
    { name: "Mariquinha e Mário", party: 2 },
    { name: "Janira Zua", party: 1 },
    { name: "Mirian Hermenegilda de Brito Ramires Manuel e esposo", party: 2 },
    { name: "Shelsea Costa", party: 1 },
    { name: "Dello Correia dC", party: 2 },
    { name: "Nuno pina", party: 1 },
    { name: "Nickson e esposa", party: 2 },
    { name: "Zulmira Brito e esposo", party: 2 },
    { name: "Domilde Almeida", party: 2 },
    { name: "Vanusa Miranda", party: 2 },
    { name: "Carlota Costa", party: 2 },
    { name: "Alexandre Cristóvão", party: 2 },
    { name: "Samira Boavida", party: 2 },
    { name: "Emiliano Brito", party: 1 },
    { name: "António Kabanda", party: 1 },
    { name: "Cleidiane Almeida", party: 1 },
    { name: "Joelson Emanuel De Brito Ramires.  PAula Kélia Tavares Lopes", party: 2 },
    { name: "Kissima Keita", party: 1 },
    { name: "Elton Garcia", party: 1 },
    { name: "Carlos Elizandro Correia Esteves", party: 2 },
    { name: "Natalício da Silva", party: 2 },
    { name: "Genoveva de Brito", party: 2 },
    { name: "Zenea Cipriano ❤️", party: 2 },
    { name: "Nickson Pinto e Esposa", party: 2 },
    { name: "Helder Brito e esposa", party: 2 },
    { name: "Mongo Saraiva", party: 2 },
    { name: "Eufránio e creuma Diogo", party: 2 },
    { name: "Rosana e Esposo", party: 2 },
    { name: "José Boio", party: 2 },
    { name: "Osvaldo de Jesus e Catarina Costa", party: 2 },
    { name: "Mirian Mateus", party: 1 },
    { name: "Maria E Marcelo Pimentel", party: 2 },
    { name: "Claudia Patrícia e acompanhante", party: 2 },
    { name: "Shirley Dos Reis", party: 2 },
    { name: "Josimar Sanches Lucamba", party: 1 },
    { name: "Carlos Cruz e Esposa", party: 2 },
    { name: "Maninho e esposa", party: 2 },
    { name: "Herculano Brito e Izaida Brito", party: 2 },
    { name: "Sávio Mateus António Miguel", party: 1 },
    { name: "Marina Santiago", party: 2 },
    { name: "Márcia Soma", party: 2 },
    { name: "Inocêncio Lunga", party: 1 },
  ];

  const guestGrid = document.getElementById("guest-grid");
  const searchInput = document.getElementById("guest-search");
  const recordCount = document.getElementById("guest-record-count");
  const personCount = document.getElementById("guest-person-count");
  const listStatus = document.getElementById("list-status");
  const emptyState = document.getElementById("empty-state");
  const toast = document.getElementById("copy-toast");
  let toastTimeout;

  recordCount.textContent = String(guests.length);
  personCount.textContent = String(guests.reduce((total, guest) => total + guest.party, 0));

  function makeCard(guest, index) {
    const card = document.createElement("article");
    card.className = "guest-card";

    const details = document.createElement("div");
    details.className = "guest-details";

    const name = document.createElement("strong");
    name.className = "guest-name";
    name.textContent = guest.name;

    const party = document.createElement("span");
    party.className = "guest-party";
    party.textContent = `${guest.party} ${guest.party === 1 ? "convidado" : "convidados"} · confirmação ${String(index + 1).padStart(2, "0")}`;

    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.setAttribute("aria-label", `Copiar convite para ${guest.name}`);
    button.innerHTML = '<svg class="copy-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1.5"></rect><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"></path></svg><span>Copiar convite</span>';
    button.addEventListener("click", () => copyInvitation(guest, button));

    details.append(name, party);
    card.append(details, button);
    return card;
  }

  function renderGuests() {
    const searchTerm = searchInput.value.trim().toLocaleLowerCase("pt");
    const matches = guests
      .map((guest, index) => ({ guest, index }))
      .filter(({ guest }) => guest.name.toLocaleLowerCase("pt").includes(searchTerm));

    guestGrid.replaceChildren(...matches.map(({ guest, index }) => makeCard(guest, index)));
    emptyState.hidden = matches.length > 0;
    listStatus.textContent = searchTerm
      ? `${matches.length} ${matches.length === 1 ? "resultado" : "resultados"}`
      : `${guests.length} confirmações recebidas`;
  }

  function buildInvitation(guest) {
    const invitationUrl = new URL("./convite.html", window.location.href);
    invitationUrl.searchParams.set("guest", guest.name);
    invitationUrl.searchParams.set("guests", String(guest.party));

    return `Seja bem-vindo(a) ao nosso casamento, ${guest.name}! Aproveite ao máximo a festa e faça fotos com os noivos, porque o momento é único.\n\nO seu convite personalizado: ${invitationUrl.href}`;
  }

  async function copyInvitation(guest, button) {
    const originalLabel = button.querySelector("span").textContent;
    try {
      await copyText(buildInvitation(guest));
      button.querySelector("span").textContent = "Copiado!";
      showToast(`Convite de ${guest.name} copiado.`);
    } catch (error) {
      console.error("Não foi possível copiar o convite.", error);
      showToast("Não foi possível copiar. Verifique as permissões do navegador.", true);
    } finally {
      window.setTimeout(() => {
        const label = button.querySelector("span");
        if (label) label.textContent = originalLabel;
      }, 1800);
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("O navegador recusou a cópia para a área de transferência.");
  }

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("toast--error", isError);
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  searchInput.addEventListener("input", renderGuests);
  renderGuests();
})();
