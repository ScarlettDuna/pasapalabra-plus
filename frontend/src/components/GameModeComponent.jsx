import React, { useEffect, useState } from "react";
import "./GameModeComponent.css";
import { useNavigate } from "react-router-dom"; // para hacer redirecciones
import { getHealth } from "../services/health";
import { getCategories } from "../services/categories";
import { startGame } from "../services/games";

export default function GameModeComponent() {
  const idiomas = ["ESPAÑOL", "INGLÉS", "FRANCÉS"];
  const niveles = ["FÁCIL", "MEDIO", "DIFÍCIL"];

  const [healthStatus, setHealthStatus] = useState("cargando"); //para saber como va la conexion con la bbdd
  const [categorias, setCategorias] = useState([]);
  const [indiceIdioma, setIndice] = useState(0); // indice del idioma , empeznado por 0 ES
  const [indiceDificultad, setIndiceDificultad] = useState(0);
  const [indiceTematica, setIndiceTematica] = useState(0);
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

  // useffect  cargar categorias
  useEffect(() => {
    async function cargarCategorias() {
      const codigosIdioma = ["ES", "EN", "FR"];

      const languageCode = codigosIdioma[indiceIdioma];
      const data = await getCategories(languageCode);
      setCategorias(data); // se piden las categorias seleccionadas filtradas por idioma al backend y se guardan en data
    }

    cargarCategorias();
  }, [indiceIdioma]); // ejecuntamos este effect cada vez que cambie el indice idioma

  let mensajeConexion = "Comprobando conexion con el backend...";

  if (healthStatus === "bien") {
    mensajeConexion = "Backend conectado";
  }

  if (healthStatus === "error") {
    mensajeConexion = "No se pudo conectar con el backend";
  }

  let nombreCategoria = "CARGANDO CATEGORIAS..."; // por defecto si no cargan

  if (categorias.length > 0) {
    nombreCategoria = categorias[indiceTematica].name; // http://localhost:5000/api/categories?language=ES
  }

  function cambiarIdioma() {
    setIndice((indiceIdioma + 1) % idiomas.length);
  }

  function cambiarDificultad() {
    setIndiceDificultad((indiceDificultad + 1) % niveles.length);
  }

  function cambiarTematica() {
    if (categorias.length === 0) return;
    setIndiceTematica((indiceTematica + 1) % categorias.length);
  }

  async function handleComenzar() {
    const idioma = ["ES", "EN", "FR"][indiceIdioma];
    const dificultad = ["easy", "medium", "hard"][indiceDificultad];
    const categoria = categorias[indiceTematica].id;

    const datos = await startGame(idioma, dificultad, categoria);

    const gameId = datos.gameId;
    const game = datos.game;
    const questions = datos.questions;

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
        CONFIGURE SU PARTIDA
      </p>
      
      {/* PRUEBA CONEXIÓN CON BACKEND
      
      <div className={`health-box health-${healthStatus}`}>
        {mensajeConexion}
      </div>

      */}

      <div className="fila-selector">
        <p className="etiqueta-idioma">IDIOMA</p>
        <span className="flecha">⇔</span>
        <button className="btn-idioma" onClick={cambiarIdioma}>
          {idiomas[indiceIdioma]}
        </button>
      </div>

      <div className="fila-selector">
        <p className="etiqueta-tematica">TEMÁTICA</p>
        <span className="flecha">⇔</span>
        <button className="btn-tematica" onClick={cambiarTematica}>
          {nombreCategoria.toUpperCase()}
        </button>
      </div>

      <div className="fila-selector">
        <p className="etiqueta-dificultad">DIFICULTAD</p>
        <span className="flecha">⇔</span>
        <button className="btn-dificultad" onClick={cambiarDificultad}>
          {niveles[indiceDificultad]}
        </button>
      </div>

      <button className="btn-comenzar" onClick={handleComenzar}>
        COMENZAR
      </button>
    </div>
  );
}
