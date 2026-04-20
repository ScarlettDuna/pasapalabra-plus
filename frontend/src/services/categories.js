import API_URL from "./api";

export async function getCategories(language) {
  const response = await fetch(`${API_URL}/categories?language=${language}`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las categorías");
  }

  return response.json();
}
// aqui cargamos las categorias en un json para luego leerlas desde el juego