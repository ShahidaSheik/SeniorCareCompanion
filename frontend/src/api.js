const API_BASE = "http://localhost:8000/api/v1";
export const BACKEND_BASE = "http://localhost:8000";

export function makeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_BASE}${url}`;
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let message = await res.text();
    try { message = JSON.parse(message).detail || message; } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}
