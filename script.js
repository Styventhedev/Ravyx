
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");

  menuBtn.textContent = isOpen ? "✕" : "☰";
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.textContent = "☰";
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();
