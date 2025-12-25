import { CONFIG } from "./config.js";
import { getToken, clearToken } from "./auth.js";

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // kalau token invalid/expired -> paksa balik login (sesuai soal "expired token")
  if (res.status === 401) {
    clearToken();
    window.location.href = "login.html";
    return;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(data?.message || "REQUEST_FAILED");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password }, auth: false }),

  getPelanggaran: (page = 1) => request(`/pelanggaran?page=${page}`),
  createPelanggaran: (payload) => request("/pelanggaran", { method: "POST", body: payload }),

  getObjek: (page = 1) => request(`/objek-melintas?page=${page}`),
  createObjek: (payload) => request("/objek-melintas", { method: "POST", body: payload }),
};
