const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export function getRole() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).role ?? null;
  } catch {
    return null;
  }
}