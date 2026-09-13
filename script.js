document.getElementById("year").textContent = new Date().getFullYear();

/*
 * CONFIGURA AQUI OS DOIS SITES:
 * Substitui os URLs abaixo pelos endereços reais dos teus projectos.
 */
const projects = [
  {
    name: "Projecto 1",
    url: "https://example.com"
  },
  {
    name: "Projecto 2",
    url: "https://example.com"
  }
];

projects.forEach((project, index) => {
  const n = index + 1;
  const frame = document.getElementById(`project${n}-frame`);
  const link = document.getElementById(`project${n}-link`);
  const title = frame?.closest(".project-card")?.querySelector("h3");

  if (frame) frame.src = project.url;
  if (link) link.href = project.url;
  if (title) title.textContent = project.name;
});
