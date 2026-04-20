import API_URL from "./api";

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("No se pudo conectar con el backend!!");
  }

  return response.json();
}
