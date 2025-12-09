document.addEventListener("DOMContentLoaded", () => {
  const includeTargets = document.querySelectorAll("[data-include]");
  includeTargets.forEach(async (el) => {
    const src = el.getAttribute("data-include");
    if (!src) return;
    try {
      const res = await fetch(src);
      if (!res.ok) return;
      el.innerHTML = await res.text();
    } catch (err) {
      // Fail silently to avoid blocking page rendering
    }
  });
});
