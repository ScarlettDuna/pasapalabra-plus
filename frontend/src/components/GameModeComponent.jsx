import React, { useEffect, useState } from "react";
import "./GameModeComponent.css";
import { getHealth } from "../services/health";

export default function GameModeComponent() {

  const [healthStatus, setHealthStatus] = useState("loading");

  useEffect(() => {
    async function comprobarBackend() {
      try {
        await getHealth();
        setHealthStatus("success");
      } catch (error) {
        setHealthStatus("error");
        console.error(error);
      }
    }

    comprobarBackend();
  }, []);

  let healthMessage = "Comprobando conexión con el backend...";

  if (healthStatus === "success") {
    healthMessage = "Backend conectado";
  }

  if (healthStatus === "error") {
    healthMessage = "No se pudo conectar con el backend";
  }

  const idiomas = ["ESPAÑOL", "INGLÉS", "FRANCES", "ALEMÁN"];
  const niveles = ["FÁCIL", "MEDIO", "DIFÍCIL"];
  const tematica = ["DEPORTES", "HISTORIA", "GEOGRAFÍA"];
  // definimos estado, indices empezando por 0
  const [indice, setIndice] = useState(0);
  function cambiarIdioma() {
    setIndice((indice + 1) % idiomas.length); // % hace que retorne a 0 cuando llegue al final
  }

  const [indiceDificultad, setIndiceDificultad] = useState(0);
  function cambiarDificultad() {
    setIndiceDificultad((indiceDificultad + 1) % niveles.length); // % hace que retorne a 0 cuando llegue al final
  }

  const [indiceTematica, setIndiceTematica] = useState(0);
  function cambiarTematica() {
    setIndiceTematica((indiceTematica + 1) % tematica.length); // % hace que retorne a 0 cuando llegue al final
  }

  return (
    <div className="contenedor-juego">
      
     <div className={`health-box health-${healthStatus}`}>
        {healthMessage}
      </div>

      {/* Fila de Idioma */}
      <div className="fila-selector">
        <p className="etiqueta-idioma">IDIOMA</p>
        <span className="flecha">↔</span>
        <button className="btn-idioma" onClick={cambiarIdioma}>
          {idiomas[indice]}
        </button>
      </div>

      {/* Fila de Temática */}
      <div className="fila-selector">
        <p className="etiqueta-tematica">TEMÁTICA</p>
        <span className="flecha">↔</span>
        <button className="btn-tematica" onClick={cambiarTematica}>
          {tematica[indiceTematica]}
        </button>
      </div>

      {/* Fila de Dificultad */}
      <div className="fila-selector">
        <p className="etiqueta-dificultad">DIFICULTAD</p>
        <span className="flecha">↔</span>
        <button className="btn-dificultad" onClick={cambiarDificultad}>
          {niveles[indiceDificultad]}
        </button>
      </div>

      <button className="btn-comenzar">COMENZAR</button>
    </div>
  );
}
