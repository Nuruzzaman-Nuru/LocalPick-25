const SHOP_API_BASE = "http://localhost:5000/api";

function getShopId() {
  return localStorage.getItem("localpick_shopId") || "";
}

function setShopId(id) {
  if (id) localStorage.setItem("localpick_shopId", id);
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("localpick_user") || "{}");
  } catch (_e) {
    return {};
  }
}

function qs(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${SHOP_API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function renderStatus(text, type = "info") {
  const el = document.querySelector(".page-status");
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  el.classList.toggle("error", type === "error");
  el.classList.toggle("success", type === "success");
}
