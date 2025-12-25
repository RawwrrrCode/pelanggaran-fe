export function showAlert(el, type, msg) {
  el.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(msg)}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDateTimeLocalToSQL(dtLocal) {
  // input: "2025-12-25T16:30"
  if (!dtLocal) return null;
  return dtLocal.replace("T", " ") + ":00"; // "YYYY-MM-DD HH:MM:SS"
}

export function renderPagination(container, { page, pageCount }, onPage) {
  if (!pageCount || pageCount <= 1) {
    container.innerHTML = "";
    return;
  }

  const prevDisabled = page <= 1 ? "disabled" : "";
  const nextDisabled = page >= pageCount ? "disabled" : "";

  let items = "";
  const max = 7;
  let start = Math.max(1, page - 3);
  let end = Math.min(pageCount, start + (max - 1));
  start = Math.max(1, end - (max - 1));

  for (let p = start; p <= end; p++) {
    items += `
      <li class="page-item ${p === page ? "active" : ""}">
        <button class="page-link" data-page="${p}">${p}</button>
      </li>
    `;
  }

  container.innerHTML = `
    <nav>
      <ul class="pagination">
        <li class="page-item ${prevDisabled}">
          <button class="page-link" data-page="${page - 1}">Prev</button>
        </li>
        ${items}
        <li class="page-item ${nextDisabled}">
          <button class="page-link" data-page="${page + 1}">Next</button>
        </li>
      </ul>
    </nav>
  `;

  container.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = Number(btn.dataset.page);
      if (p >= 1 && p <= pageCount) onPage(p);
    });
  });
}
