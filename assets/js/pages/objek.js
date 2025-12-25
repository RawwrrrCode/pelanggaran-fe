import { api } from "../api.js";
import { logout } from "../auth.js";
import { showAlert, renderPagination, escapeHtml, formatDateTimeLocalToSQL } from "../ui.js";

document.getElementById("btnLogout").addEventListener("click", logout);

const alertEl = document.getElementById("alert");
const tbody = document.getElementById("tbodyObjek");
const pagEl = document.getElementById("pagination");
const metaText = document.getElementById("metaText");
const form = document.getElementById("formObjek");

let currentPage = 1;

async function load(page = 1) {
  currentPage = page;
  try {
    const res = await api.getObjek(page);
    const rows = res?.data || [];

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${escapeHtml(r.jenis_objek)}</td>
        <td>${escapeHtml(r.lokasi ?? "-")}</td>
        <td>${escapeHtml(r.waktu ?? "-")}</td>
        <td>${escapeHtml(r.keterangan ?? "-")}</td>
      </tr>
    `).join("");

    metaText.textContent = `Page ${res.meta.page} / ${res.meta.pageCount} • Total ${res.meta.total}`;
    renderPagination(pagEl, { page: res.meta.page, pageCount: res.meta.pageCount }, load);
  } catch (err) {
    showAlert(alertEl, "danger", err?.data?.message || err.message || "Gagal load objek melintas.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);

  const payload = {
    jenis_objek: fd.get("jenis_objek"),
    lokasi: fd.get("lokasi") || null,
    keterangan: fd.get("keterangan") || null,
    waktu: formatDateTimeLocalToSQL(fd.get("waktu")),
  };

  try {
    await api.createObjek(payload);
    showAlert(alertEl, "success", "Data objek melintas berhasil disimpan.");
    form.reset();
    await load(1);
  } catch (err) {
    const msg = err?.data?.message === "VALIDATION_ERROR"
      ? JSON.stringify(err.data.errors)
      : (err?.data?.message || err.message || "Gagal submit.");
    showAlert(alertEl, "danger", msg);
  }
});

load(1);
