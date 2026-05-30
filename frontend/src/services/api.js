import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./token";

const API_URL = "https://b7dqr6qz-5000.uks1.devtunnels.ms/api";

export default API_URL;

export async function apiFetch(url, options = {}) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      window.location.href = "/login";
      return;
    }

    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!refreshRes.ok) {
      clearTokens();
      window.location.href = "/login";
      return;
    }

    const { token: newToken } = await refreshRes.json();
    saveTokens(newToken, refreshToken);

    res = await fetch(url, {
      ...options,
      headers: { ...headers, Authorization: `Bearer ${newToken}` },
    });
  }
  return res;
}