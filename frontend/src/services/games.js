import API_URL from "./api";

// service para crear una partida y mandar idioma dificultad y categ. Y lo guardamso todo dentro de datos. 
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

// service que recibe gameId y las respuestas  y llama a backend para cerrar la parrtida 
export async function finishGame(gameId, answers) {
  const respuesta = await fetch(`${API_URL}/games/${gameId}/finish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answers: answers
    })
  });

  const datos = await respuesta.json();
  return datos;
}


