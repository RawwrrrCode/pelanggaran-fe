const KEY = "pelanggaran_token";

export function setToken(token) {
  localStorage.setItem(KEY, token);
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  const payload = decodeJwt(token);
  if (!payload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function requireAuthOrRedirect() {
  if (!isTokenValid()) {
    clearToken();
    window.location.href = "login.html";
  }
}

export function logout() {
  clearToken();
  window.location.href = "login.html";
}
