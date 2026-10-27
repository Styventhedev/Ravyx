
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const searchInput = document.getElementById("command-search");
  const filterButtons = document.querySelectorAll(".filter-button");
  const commandCards = document.querySelectorAll(".command-card");
  const noResults = document.getElementById("no-results");
  const toast = document.getElementById("toast");
  const year = document.getElementById("year");

  let activeFilter = "all";
  let toastTimeout;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Menu mobile
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Ouvrir le menu" : "Fermer le menu"
      );

      navLinks.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  // Recherche et filtres des commandes
  function filterCommands() {
    const query = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    commandCards.forEach((card) => {
      const category = card.dataset.category;
      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch =
        card.textContent.toLowerCase().includes(query);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCommands);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      filterCommands();
    });
  });

  // Petit message de confirmation
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  // Copier une commande
  document.querySelectorAll(".copy-command").forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.dataset.command;

      if (!command) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(command);
        } else {
          const temporaryInput = document.createElement("textarea");
          temporaryInput.value = command;
          temporaryInput.setAttribute("readonly", "");
          temporaryInput.style.position = "fixed";
          temporaryInput.style.opacity = "0";

          document.body.appendChild(temporaryInput);
          temporaryInput.select();

          const copied = document.execCommand("copy");
          temporaryInput.remove();

          if (!copied) throw new Error("Copie indisponible");
        }

        showToast("Commande copiée : " + command);
      } catch (error) {
        showToast("Copie impossible. Sélectionne la commande manuellement.");
      }
    });
  });

  filterCommands();
});
