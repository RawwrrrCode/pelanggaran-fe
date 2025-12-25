import { api } from "../api.js";
import { logout } from "../auth.js";
import { showAlert } from "../ui.js";

document.getElementById("btnLogout").addEventListener("click", logout);

const alertEl = document.getElementById("alert");
const countP = document.getElementById("countPelanggaran");
const countO = document.getElementById("countObjek");

(async () => {
  try {
    const pel = await api.getPelanggaran(1);
    const obj = await api.getObjek(1);
    countP.textContent = pel?.meta?.total ?? 0;
    countO.textContent = obj?.meta?.total ?? 0;
  } catch (err) {
    showAlert(alertEl, "danger", err?.data?.message || err.message || "Gagal load dashboard.");
  }
})();
