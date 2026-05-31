import API_URL, { apiFetch } from "./api";

export async function createQuestion(data) {
  const res = await apiFetch(`${API_URL}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "No se pudo crear la pregunta");
  }
  return res.json();
}

export async function getMyQuestions() {
  const res = await apiFetch(`${API_URL}/questions/mine`);
  if (!res.ok) throw new Error("No se pudieron cargar tus preguntas");
  return res.json();
}