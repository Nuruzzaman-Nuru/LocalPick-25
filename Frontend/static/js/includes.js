document.addEventListener("DOMContentLoaded", () => {
  const includeTargets = document.querySelectorAll("[data-include]");
  includeTargets.forEach(async (el) => {
    const src = el.getAttribute("data-include");
    if (!src) return;
    try {
      const res = await fetch(src);
      if (!res.ok) return;
      el.innerHTML = await res.text();

      // Initialize nav toggle if present inside the included fragment
      const toggle = el.querySelector(".nav-toggle");
      const links = el.querySelector(".nav-links");
      const actions = el.querySelector(".nav-actions");
      if (toggle && links && actions) {
        toggle.addEventListener("click", () => {
          const isOpen = !links.classList.contains("open");
          links.classList.toggle("open", isOpen);
          actions.classList.toggle("open", isOpen);
          toggle.setAttribute("aria-expanded", isOpen.toString());
        });
      }
    } catch (err) {
      // Fail silently to avoid blocking page rendering
    }
  });
});
