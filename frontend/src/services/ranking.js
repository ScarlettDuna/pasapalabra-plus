import API_URL from "./api";

export async function getRanking(language) { 
  const response = await fetch(`${API_URL}/ranking?language=${language}`);

  if (!response.ok) {
    throw new Error("No se pudo cargar el ranking");
  }

  return response.json();
}

// service que recibe el idioma, llama a  /api/ranking y devuelve json con datos