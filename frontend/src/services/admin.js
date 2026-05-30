import API_URL, { apiFetch } from "./api";

export async function getPendingQuestions() {
  const res = await apiFetch(`${API_URL}/admin/pending`);
  if (res.status === 403) throw new Error("403");
  if (!res.ok) throw new Error("No se pudieron cargar las preguntas");
  const data = await res.json();
  return data.preguntas;
}

export async function approveQuestion(id) {
  const res = await apiFetch(`${API_URL}/admin/${id}/approve`, { method: "PATCH" });
  if (!res.ok) throw new Error("No se pudo aprobar");
  return res.json();
}

export async function rejectQuestion(id) {
  const res = await apiFetch(`${API_URL}/admin/${id}/reject`, { method: "PATCH" });
  if (!res.ok) throw new Error("No se pudo rechazar");
  return res.json();
}