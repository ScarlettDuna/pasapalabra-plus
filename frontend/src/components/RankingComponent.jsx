import React, { useEffect, useState } from "react";
import "./RankingComponent.css";
import { getRanking } from "../services/ranking";

export default function RankingComponent() {
  const idiomas = ["ES", "EN", "FR"];

  const [indiceIdioma, setIndiceIdioma] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarRanking() {
      setCargando(true);
      setError("");

      try {
        const idioma = idiomas[indiceIdioma];
        const data = await getRanking(idioma);
        setRanking(data);
        console.log(ranking);
      } catch (err) {
        setError("No se pudo cargar el ranking");
      }

      setCargando(false);
    }

    cargarRanking();
  }, [indiceIdioma]);

  function cambiarIdioma() {
    setIndiceIdioma((indiceIdioma + 1) % idiomas.length);
  }

  function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString();
}

  return (
    <div className="ranking-container">
      <div className="ranking-selector">
        <p className="ranking-etiqueta">IDIOMA</p>
        <span className="ranking-flecha">↔</span>
        <button className="ranking-btn-idioma" onClick={cambiarIdioma}>
          {idiomas[indiceIdioma]}
        </button>
      </div>

      {cargando && <p className="ranking-mensaje">Cargando ranking...</p>}

      {error && <p className="ranking-error">{error}</p>}

      {!cargando && !error && ranking.length === 0 && (
        <p className="ranking-mensaje">No hay partidas registradas.</p>
      )}

      {!cargando && !error && ranking.length > 0 && (
        <div className="ranking-lista">
          {ranking.map((jugador, index) => (
            <div className="ranking-fila" key={index}>
              <p className="ranking-posicion">#{jugador.position}</p>
              <p className="ranking-nombre">{jugador.playerName}</p>
              <p className="ranking-puntos">{jugador.score} pts</p>
              <p className="ranking-fecha">{formatearFecha(jugador.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
