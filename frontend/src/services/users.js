import API_URL, { apiFetch } from "./api";

export async function getMe() {
  const res = await apiFetch(`${API_URL}/users/me`);
  if (!res.ok) throw new Error("No se pudo cargar el perfil");
  return res.json();
}

export async function getMyStats() {
  const res = await apiFetch(`${API_URL}/users/me/stats`);
  if (!res.ok) throw new Error("No se pudo cargar las estadísticas");
  return res.json();
}
