import API_URL from "./api";

export async function startGame(language, difficulty, categoryId) {
  const respuesta = await fetch(`${API_URL}/games/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      language: language,
      difficulty: difficulty,
      categoryId: categoryId
    })
  });

  const datos = await respuesta.json();
  return datos;
}

// service para crear una partida y mandar idioma dificultad y categ. Y lo guardamso todo dentro de datos. 