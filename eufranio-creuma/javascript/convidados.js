const tables = [
  {
    number: "1", name: "Kernel", owner: "Eufránio", group: "Família do Noivo", description: "Sem vocês, o sistema não arranca.", seats: 8, guests: [
      ["Eutrópio Diogo"], ["Luisa Diogo", "guest-1-1"], ["Ari Silva"], ["Denise Silva", "guest-1-3"], ["Helga Valente", "guest-1-6"], ["Eleuterio Valente"], ["Marcos Caetano"], ["Suzana Samacongo", "guest-1-7"],
    ]
  },
  {
    number: "2", name: "Root", owner: "Creuma", group: "Família da Noiva", description: "Acesso total garantido, sem pedir palavra-passe.", seats: 8, guests: [
      ["Isidro Coutinho", "guest-2-2"], ["Maria Pedro"], ["Arlindo Pedro", "guest-2-4"], ["Cristina Pedro"], ["Júlio Pedro"], ["Domingos Pedro"], ["Jacinto Coutinho"], ["Joana Coutinho"],
    ]
  },
  {
    number: "3", name: "Servidor", owner: "Eufránio", group: "Família do Noivo", description: "18 lugares e zero lentidão: há sempre espaço para mais um tio.", seats: 18, guests: [
      ["Claudeth Fernandes"], ["Adriano Fernandes", "guest-3-1"], ["Amélia Alves"], ["Hélder Alves", "guest-3-3"], ["Paula Fortunato"], ["Narciso Fortunato"], ["Anabela Salvador"], ["Amélia Diogo"], ["Yana Magalhães", "guest-3-10"], ["Victoriano Magalhães"], ["Teresa Manuel (Avó)"], ["Celma Dos Anjos"], ["Leonel Lutumba", "guest-3-12"], ["Silvina Dos Anjos", "guest-3-15"], ["Claver Dos Anjos"], ["Teca Costa", "guest-3-17"], ["Jesus Costa"], ["Gizela"],
    ]
  },
  {
    number: "4", name: "Mainframe", owner: "Creuma", group: "Família da Noiva", description: "Grande, potente e fiável, como toda a boa família.", seats: 18, guests: [
      ["Edmundo Receado"], ["Esposa de Edmundo Receado", "guest-4-1"], ["João Coutinho"], ["Branca Miguel"], ["Catarina Coutinho"], ["Felix"], ["Esposa de Felix", "guest-4-6"], ["Miguel Ebo"], ["Rosa Ebo", "guest-4-8"], ["Fiel Constantino"], ["Esposa de Fiel Constantino", "guest-4-10"], ["Silvio Receado"], ["Esposa de Silvio Receado", "guest-4-12"], ["Walter Manuel"], ["Dorca Manuel (Esposa de Walter Manuel)", "guest-4-14"], ["Domingos Manuel"], ["Albertina Manuel", "guest-4-16"], ["Teresa Andre"],
    ]
  },
  {
    number: "5", name: "Wi-Fi", owner: "Eufránio", group: "Primos e Primas do Noivo", description: "A palavra-passe de hoje é: dançar até de madrugada.", seats: 8, guests: [
      ["Davi Fernandes"], ["Nilza Fernandes"], ["Lupercio Fortunato"], ["Otoniel Fernandes"], ["Laercio Fortunato"], ["Gabriela Valente"], ["Jane"], ["Zara Diogo"],
    ]
  },
  {
    number: "6", name: "Bluetooth", owner: "Creuma", group: "Primos e Primas da Noiva", description: "Os primos ligam-se à primeira, sem fios nem cerimónias.", seats: 8, guests: [
      ["Catarina Matias"], ["Márcia Matias"], ["Ana Matias"], ["Dalva Manuel"], ["Irasema Filipe"], ["Magno Matias"], ["Pedro Viana"], ["Neusa"],
    ]
  },
  {
    number: "7", name: "Backup", owner: "Eufránio", group: "Amigos do Noivo", description: "Vocês são o nosso backup para a vida.", seats: 8, guests: [
      ["Nalia Mutunda"], ["Audrey Salvador"], ["Anabela Francisco"], ["Jaime Borges"], ["Auria Paula"], ["Vicente Filipe"], ["Hevlin Valente"], ["Claudeth Fernandes"],
    ]
  },
  {
    number: "8", name: "Cloud", owner: "Creuma", group: "Amigos da Noiva", description: "Os amigos de sempre, esteja onde estiver.", seats: 8, guests: [
      ["Danny"], ["Dulce"], ["Enzo Pedro"], ["Ricardo Pedro"], ["Bela"], ["Tininho"], ["Neusa"], ["Mária da Silva"],
    ]
  },
  {
    number: "9", name: "Debug", owner: "Eufránio", group: "Colegas de Universidade do Noivo", description: "Sobrevivemos às noites de debug. Hoje é só festa.", seats: 8, guests: [
      ["Inocência Lutumba"], ["John Lutumba"], ["Isaias"], ["Esposa de Isaias", "guest-9-3"], ["Djary Carneiro"], ["Milton Campos"], ["Crisnela Campos"], ["Ricardo Sabino"],
    ]
  },
  {
    number: "10", name: "Cluster", owner: "Creuma", group: "Colegas de Trabalho da Noiva", description: "Trabalham em equipa 24/7. Hoje estão de folga!", seats: 16, guests: [
      ["Maenzinha"], ["Francisco Filipe"], ["Pedro Bandeira"], ["Cristina Bandeira"], ["Zé Neto"], ["Esposa de Zé Neto", "guest-10-5"], ["Ulisses Coutinho", "guest-10-8"], ["Lecticia Coutinho"], ["Valdemiro Gabriel", "guest-10-10"], ["Esposa de Valdemiro Gabriel"], ["Mária Tandala"], ["Leonel (Esposo de Mária Tandala)", "guest-10-11"], ["Laura", "guest-10-14"], ["Marinho"], ["Pedro", "guest-10-16"], ["Marisa"],
    ]
  },
  {
    number: "11", name: "Intervenção", owner: "Eufránio", group: "Convidados", description: "Sexta-feira ninguém coloca nada em PRD, mas hoje abre-se uma excepção.", seats: 16, guests: [
      ["Hernáni Neto"], ["Leila Neto", "guest-11-1"], ["Amâncio Sassamba"], ["Arminda Sassamba", "guest-11-3"], ["Anibal Brito"], ["Tilcia Brito", "guest-11-5"], ["Pedro Costa"], ["Acompanhante Pedro Costa", "guest-11-7"], ["Genésio António", "guest-11-10"], ["Luzia Miguel"], ["Constantino Dos Anjos"], ["Edmilson Fonseca"], ["Elca Fonseca (Esposa de Edmilson Fonseca)", "guest-11-12"], ["Esperança Dos Anjos"], ["Délio Africano"], ["Edson Costa"],
    ]
  },
  {
    number: "12", name: "Compilar", owner: "Creuma", group: "Convidados", description: "Compilou à primeira. Milagre que só acontece em casamentos.", seats: 8, guests: [
      ["Sara Tuma"], ["Isaura Manico", "guest-12-3"], ["Yuri Domingos"], ["Rita Chicoco"], ["Juscelino Francisco", "guest-12-4"], ["Acompanhante Juscelino", "guest-12-5"], ["Afonso Kapenda"], ["Dionisia Kapenda", "guest-12-7"],
    ]
  },
  {
    number: "13", name: "Pen Drive", owner: "Eufránio", group: "Convidados", description: "A Pendrive é pequena mas grande em armazenamento e está cheia de boas memórias vividas ao vosso lado meus amigos.", seats: 8, guests: [
      ["Clemente Muanda"], ["Nádia José"], ["Tiago Mabango"], ["Maria Mabango (Esposa de Tiago Mabango)", "guest-13-3"], ["Tiago Santiago"], ["Antónia Santiago (Esposa de Tiago Santiago)", "guest-13-5"], ["Lúcia Machado"], ["Walter Belengue"],
    ]
  },
  {
    number: "14", name: "Thread Dump", owner: "Eufránio", group: "Convidados", description: "Para o programa funcionar preciso de vocês como minhas threads de execução.", seats: 10, guests: [
      ["Íris de Paulo"], ["Naza Colombo"], ["Igor Magalhães"], ["Tamara Magalhães"], ["Eduardo Cussecala"], ["Vera Manuel"], ["Júlio dos Santos"], ["Ana do Júlio"], ["Martina Mlaker"], ["Mariana Américo"],
    ]
  },
];

const guests = tables.flatMap((table) =>
  table.guests.map(([name, partnerId], seatIndex) => ({
    id: `guest-${table.number}-${seatIndex + 1}`,
    name,
    table,
    seat: seatIndex + 1,
    partnerId,
  })),
);
const guestsById = new Map(guests.map((guest) => [guest.id, guest]));
window.weddingGuestData = { tables, guests, guestsById };

if (document.getElementById("guest-search")) {
  const storageKey = "eufranio-creuma-checkins-v1";
  const searchInput = document.getElementById("guest-search");
  const searchResults = document.getElementById("search-results");
  const invitation = document.getElementById("personal-invitation");
  const copyStatus = document.getElementById("copy-status");
  let selectedGuest = null;

  function normalize(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt");
  }

  function getInviteUrl(guest) {
    const primaryGuest = guest.partnerId ? guestsById.get(guest.partnerId) : guest;
    const url = new URL("convite-publico.html", window.location.href);
    url.searchParams.set("convidado", (primaryGuest || guest).id);
    return url.toString();
  }

  function buildInviteMessage(guest) {
    const partner = getPartner(guest);
    const invitees = partner ? [guest, partner] : [guest];
    const names = invitees.map((invitee) => invitee.name).join(" e ");
    const greeting = partner ? `Olá, ${names}!` : `Olá, ${guest.name}!`;
    const invitation = partner ? "convidamo-vos" : "convidamos-te";
    const pronoun = partner ? "vocês" : "ti";

    return [
      `${greeting}`,
      `Com muita alegria, ${invitation} para celebrar connosco o nosso casamento no dia 27 de Novembro de 2026.`,
      "Cerimónia religiosa: 14h00, na Igreja Nossa Senhora de Fátima.",
      "Copo de água: 20h00, no Salão Silv Place (Projecto Nova Vida).",
      `A mesa ${guest.table.number} — ${guest.table.name} está reservada para ${pronoun}.`,
      `Consulta o teu convite personalizado: ${getInviteUrl(guest)}`,
    ].join("\n\n");
  }

  function getPartner(guest) {
    if (guest.partnerId) return guestsById.get(guest.partnerId) || null;
    return guests.find((candidate) => candidate.partnerId === guest.id) || null;
  }

  function readCheckins() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
    } catch (error) {
      document.getElementById("storage-note").textContent = "Não foi possível ler os registos guardados neste navegador.";
      console.error("Falha ao ler entradas registadas:", error);
      return {};
    }
  }

  function saveCheckins(checkins) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkins));
      document.getElementById("storage-note").textContent = "Entradas guardadas apenas neste navegador.";
      renderEntryLog(checkins);
    } catch (error) {
      document.getElementById("storage-note").textContent = "Não foi possível guardar a entrada neste navegador.";
      console.error("Falha ao guardar entrada:", error);
    }
  }

  function loadEntryLog() {
    renderEntryLog(readCheckins());
    if (!document.getElementById("storage-note").textContent) {
      document.getElementById("storage-note").textContent = "Entradas guardadas apenas neste navegador.";
    }
  }

  function renderEntryLog(checkins) {
    const list = document.getElementById("entry-list");
    const checkedInGuests = guests.filter((guest) => checkins[guest.id]).sort(
      (a, b) => new Date(checkins[b.id]).getTime() - new Date(checkins[a.id]).getTime(),
    );
    document.getElementById("entry-count").textContent = `${checkedInGuests.length} ${checkedInGuests.length === 1 ? "pessoa" : "pessoas"}`;
    list.replaceChildren();
    checkedInGuests.slice(0, 8).forEach((guest) => {
      const item = document.createElement("li");
      item.className = "entry-item";
      const label = document.createElement("span");
      label.textContent = `${guest.name} · Mesa ${guest.table.number} — ${guest.table.name}`;
      const time = document.createElement("time");
      time.dateTime = checkins[guest.id];
      time.textContent = new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short" }).format(new Date(checkins[guest.id]));
      item.append(label, time);
      list.append(item);
    });
  }

  function selectGuest(guest) {
    selectedGuest = guest;
    const partner = getPartner(guest);
    const members = partner ? [guest, partner] : [guest];
    document.getElementById("invitation-type").textContent = partner ? "Convite do casal" : "Convite individual";
    document.getElementById("invitation-name").textContent = members.map((member) => member.name).join(" & ");
    document.getElementById("invitation-message").textContent = partner
      ? "O vosso lugar está reservado para celebrarem connosco."
      : "O teu lugar está reservado para celebrares connosco.";
    document.getElementById("invitation-table-label").textContent = partner ? "A vossa mesa" : "A tua mesa";
    document.getElementById("invitation-table").textContent = `Mesa ${guest.table.number} · ${guest.table.name}`;
    document.getElementById("invitation-table-note").textContent = `${guest.table.group} · responsável: ${guest.table.owner} · ${guest.table.seats} lugares`;
    document.getElementById("invitation-table-description").textContent = guest.table.description;
    renderCheckinControls(members);
    invitation.hidden = false;
    copyStatus.textContent = "";
    invitation.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderCheckinControls(members) {
    const party = document.getElementById("party-members");
    const partyList = document.getElementById("party-list");
    const checkins = readCheckins();
    partyList.replaceChildren();
    members.forEach((member) => {
      const item = document.createElement("li");
      item.className = "checkin-item";
      const name = document.createElement("span");
      name.textContent = member.name;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "checkin-toggle";
      const isCheckedIn = Boolean(checkins[member.id]);
      button.textContent = isCheckedIn ? "Entrada registada · Anular" : "Marcar entrada";
      button.setAttribute("aria-pressed", String(isCheckedIn));
      button.addEventListener("click", () => {
        const updatedCheckins = readCheckins();
        if (updatedCheckins[member.id]) {
          delete updatedCheckins[member.id];
        } else {
          updatedCheckins[member.id] = new Date().toISOString();
        }
        saveCheckins(updatedCheckins);
        renderCheckinControls(members);
      });
      item.append(name, button);
      partyList.append(item);
    });
    party.hidden = false;
  }

  function renderSearchResults(query) {
    searchResults.replaceChildren();
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return;
    const invitees = guests.filter((guest) => !guest.partnerId);
    const matches = invitees.filter((guest) => {
      const partner = getPartner(guest);
      return [guest, partner].filter(Boolean).some((member) => normalize(member.name).includes(normalizedQuery));
    }).slice(0, 12);
    if (!matches.length) {
      const message = document.createElement("p");
      message.className = "no-results";
      message.textContent = "Não encontrámos esse nome. Experimenta pesquisar de outra forma ou confirma a escrita.";
      searchResults.append(message);
      return;
    }
    matches.forEach((guest) => {
      const card = document.createElement("article");
      card.className = "result-card";
      const details = document.createElement("div");
      const name = document.createElement("p");
      name.className = "result-name";
      const partner = getPartner(guest);
      name.textContent = partner ? `${guest.name} & ${partner.name}` : guest.name;
      const meta = document.createElement("p");
      meta.className = "result-meta";
      meta.textContent = `Mesa ${guest.table.number} · ${guest.table.name}`;
      details.append(name, meta);
      const actions = document.createElement("div");
      actions.className = "result-actions";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "result-open";
      open.textContent = "Gerir convite";
      open.addEventListener("click", () => selectGuest(guest));
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "result-copy";
      copy.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg> Copiar mensagem + link';
      copy.addEventListener("click", () => copyInviteLink(guest, copy));
      actions.append(open, copy);
      card.append(details, actions);
      searchResults.append(card);
    });
  }

  async function copyInviteLink(guest, button) {
    const message = buildInviteMessage(guest);
    try {
      let clipboardError = null;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(message);
          showCopySuccess(button);
          return;
        } catch (error) {
          clipboardError = error;
        }
      }

      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = message;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.append(temporaryInput);
      temporaryInput.select();
      let copied;
      try {
        copied = document.execCommand("copy");
      } finally {
        temporaryInput.remove();
      }
      if (!copied) {
        throw clipboardError || new Error("O navegador não conseguiu copiar a mensagem.");
      }
      if (clipboardError) {
        console.warn("A API de clipboard falhou; a mensagem foi copiada pelo método alternativo.", clipboardError);
      }
      showCopySuccess(button);
    } catch (error) {
      copyStatus.textContent = "Não foi possível copiar a mensagem. Tenta novamente ou copia o link manualmente.";
      console.error("Falha ao copiar a mensagem do convite:", error);
    }
  }

  function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.textContent = "Mensagem copiada";
    copyStatus.textContent = "Mensagem personalizada e link copiados. Já podes enviar ao convidado.";
    window.setTimeout(() => { button.innerHTML = originalText; }, 1800);
  }

  searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
  document.getElementById("copy-invitation-link").addEventListener("click", (event) => {
    if (selectedGuest) copyInviteLink(selectedGuest, event.currentTarget);
  });

  loadEntryLog();
}
