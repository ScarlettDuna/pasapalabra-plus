import React, { useEffect, useState } from "react";
import "./GameModeComponent.css";
import { useNavigate } from "react-router-dom"; // para hacer redirecciones
import { getHealth } from "../services/health";
import { getCategories } from "../services/categories";
import { startGame } from "../services/games";

export default function GameModeComponent() {

  const [healthStatus, setHealthStatus] = useState("cargando"); //para saber como va la conexion con la bbdd
  const [categorias, setCategorias] = useState([]);
  const [idioma, setIdioma] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [categoriaId, setCategoriaId] = useState(null);
  const navigate = useNavigate();

  // COMPROBAMOS QUE ESTÁ CORRECTAMENTE CONECTADO AL BACKEND Y MOSTRAMOS
  useEffect(() => {
    async function comprobarBackend() {
      try {
        await getHealth(); // llamada a back para comprobar
        setHealthStatus("bien"); // si funciona guardamos "bien"
      } catch (error) {
        setHealthStatus("error");
        console.error(error);
      }
    }
    comprobarBackend();
  }, []);

  // useffect  cargar categorias — espera a que el health check responda para no pillar la BD en frío
  useEffect(() => {
    if (healthStatus === "cargando") return;
    if (!idioma) return;

    async function cargarCategorias() {
      try {
        const data = await getCategories(idioma);
        setCategorias(data);
        setCategoriaId(data[0]?.id ?? null);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    }

    cargarCategorias();
  }, [idioma, healthStatus]); // healthStatus asegura que el pool de BD ya está caliente

  async function handleComenzar() {
    const datos = await startGame(idioma, dificultad, categoriaId);
    navigate("/game", {
      state: {
        questions: datos.questions,
        gameId: datos.gameId,
      },
    });
  }

  return (
    <div className="contenedor-juego">
      <p className="enunciado">
        Configure su partida
      </p>

      <div className="selector-grupo">
        <select className="selector-select" value={idioma} onChange={e => setIdioma(e.target.value)}>
          <option value="" disabled>— Idioma —</option>
          <option value="ES">Español</option>
          <option value="EN">Inglés</option>
          <option value="FR">Francés</option>
        </select>
    </div>

    <div className="selector-grupo">
        <select className="selector-select" value={categoriaId ?? ""} onChange={e => setCategoriaId(Number(e.target.value))}>
          <option value="" disabled>— Categoría —</option>
            {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
    </div>

    <div className="selector-grupo">
        <select className="selector-select" value={dificultad} onChange={e => setDificultad(e.target.value)}>
          <option value="" disabled>— Dificultad —</option>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
    </div>

      <button className="btn-comenzar" onClick={handleComenzar}>
        Comenzar
      </button>

      <button className="btn-volver" onClick={() => navigate("/home")}>
        Volver al menú
      </button>
    </div>
  );
}
