import { api } from "../api.js";
import { setToken, isTokenValid } from "../auth.js";
import { showAlert } from "../ui.js";

if (isTokenValid()) window.location.href = "../../dashboard.html";

const form = document.getElementById("formLogin");
const alertEl = document.getElementById("alert");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const username = fd.get("username");
  const password = fd.get("password");

  try {
    const res = await api.login(username, password);
    setToken(res.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    const msg =
      err?.data?.message === "LOGIN_FAILED"
        ? "Login gagal. Cek username/password."
        : (err?.data?.message || err.message || "Terjadi error.");
    showAlert(alertEl, "danger", msg);
  }
});
