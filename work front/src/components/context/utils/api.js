const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.msg || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const authApi = {
  login: (email, password, extra = {}) => apiRequest("/auth/login", { method: "POST", body: { email, password, ...extra } }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  me: (token) => apiRequest("/auth/me", { token }),
  requestPasswordReset: (email) => apiRequest("/auth/forgot", { method: "POST", body: { email } }),
};
