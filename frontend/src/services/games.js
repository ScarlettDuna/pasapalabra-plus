import API_URL from "./api";

export async function startGame(language, difficulty, categoryId) {
  const response = await fetch(`${API_URL}/games/start`, { // pide al servidor y espera hasta que lo devuelva para continuar
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language,
      difficulty,
      categoryId,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo iniciar la partida");
  }

  return response.json();
}