const invitationData = window.weddingGuestData;
const guestId = new URLSearchParams(window.location.search).get("convidado");
const invitedGuest = invitationData?.guestsById.get(guestId);
const invitationMusic = document.querySelector(".invitation-music");
const invitationGate = document.getElementById("invitation-gate");
const openInvitationButton = document.getElementById("open-invitation");
const publicInvitation = document.getElementById("public-invitation");
const musicStatus = document.getElementById("music-status");
const musicStartTime = 30;

window.addEventListener("pagehide", () => invitationMusic.pause());

function skipMusicIntro() {
  if (Number.isFinite(invitationMusic.duration) && invitationMusic.duration > musicStartTime) {
    invitationMusic.currentTime = musicStartTime;
  }
}

function startMusic() {
  if (invitationMusic.readyState < HTMLMediaElement.HAVE_METADATA) {
    invitationMusic.addEventListener("loadedmetadata", skipMusicIntro, { once: true });
  } else {
    skipMusicIntro();
  }

  invitationMusic.play().then(() => {
    musicStatus.textContent = "";
  }).catch((error) => {
    musicStatus.textContent = "Não foi possível iniciar a música neste dispositivo.";
    console.error("Falha ao iniciar a música do convite:", error);
  });
}

openInvitationButton.addEventListener("click", () => {
  startMusic();
  invitationGate.hidden = true;
  publicInvitation.hidden = false;
  publicInvitation.scrollIntoView({ behavior: "smooth", block: "start" });
});

if (invitedGuest) {
  const companion = invitedGuest.partnerId
    ? invitationData.guestsById.get(invitedGuest.partnerId)
    : invitationData.guests.find((guest) => guest.partnerId === invitedGuest.id);
  const primaryGuest = invitedGuest.partnerId ? companion : invitedGuest;
  if (primaryGuest && primaryGuest.id !== guestId) {
    const canonicalUrl = new URL(window.location.href);
    canonicalUrl.searchParams.set("convidado", primaryGuest.id);
    window.history.replaceState(null, "", canonicalUrl);
  }
  const inviteMembers = [
    primaryGuest,
    primaryGuest?.id === invitedGuest.id ? companion : invitedGuest,
  ].filter(Boolean);
  document.getElementById("public-guest-names").textContent = inviteMembers
    .map((guest) => guest.name)
    .join(" & ");
  document.getElementById("public-invitation-message").textContent = companion
    ? "O vosso lugar está reservado para celebrarem connosco."
    : "O teu lugar está reservado para celebrares connosco.";
  document.getElementById("public-table-label").textContent = companion ? "A vossa mesa" : "A tua mesa";
  document.getElementById("public-table-name").textContent =
    `Mesa ${invitedGuest.table.number} · ${invitedGuest.table.name}`;
  document.getElementById("public-table-details").textContent =
    `${invitedGuest.table.group} · ${invitedGuest.table.seats} lugares`;
  document.getElementById("public-table-description").textContent =
    invitedGuest.table.description;
  invitationGate.hidden = false;
} else {
  document.getElementById("invalid-invitation").hidden = false;
}
