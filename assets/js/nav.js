import { decodeJwt, getToken, logout } from "./auth.js";

export function initNav() {
  const btn = document.getElementById("btnLogout");
  if (btn) btn.addEventListener("click", logout);

  const token = getToken();
  const payload = token ? decodeJwt(token) : null;

  const el = document.getElementById("navUser");
  if (el && payload) {
    el.textContent = payload.username || payload.name || "User";
  }
}
