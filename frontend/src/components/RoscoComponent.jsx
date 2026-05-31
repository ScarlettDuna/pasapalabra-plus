import React, { useEffect, useState, useRef } from "react";
import "./RoscoComponent.css";
import { finishGame } from "../services/games";
import { useNavigate } from 'react-router-dom';

const letrasRosco = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function RoscoComponent({ questions, gameId }) {
  const navigate = useNavigate();

  //const preguntaActual = questions[0];
  const [indicePregunta, setIndicePregunta] = useState(0); // indice empieza en 0 ---> "a"
  const preguntaActual = questions[indicePregunta];

  // estado para guardar el input del user
  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [estadoLetras, setEstadoLetras] = useState({});

  // array para guardar las respuestas que va dando el user
  const [answers, setAnswers] = useState([]);

  // estado para guardar resultado partida -- empieza en null
  const [resultadoFinal, setResultadoFinal] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const intervaloRef = useRef(null);

  // estado para el crono
  const [tiempoEmpleado, setTiempoEmpleado] = useState(0); // 0 seg

  useEffect(() => {

    iniciarCronometro();

    return () => {
      pararCronometro();
    };

  }, []);

  // para comprobar si esta la partida terminada
  let partidaTerminada = false;
  if (resultadoFinal !== null) {
    partidaTerminada = true;
  }

  function pasarPalabra() {
    const newEstado = { ...estadoLetras, [preguntaActual.letter]: "pasada" };
    setEstadoLetras(newEstado);
    irASiguientePregunta(newEstado);
    setRespuestaUsuario("");
  }

  function escribirRespuesta(evento) {
    setRespuestaUsuario(evento.target.value); // target es el input
  }

  function responderPregunta() {
    const newAnswers = [
      ...answers,
      { questionId: preguntaActual.questionId, answer: respuestaUsuario },
    ];
    setAnswers(newAnswers);

    const esCorrecta = normalize(respuestaUsuario) === normalize(preguntaActual.answer);
    const newEstado = {
      ...estadoLetras,
      [preguntaActual.letter]: esCorrecta ? "correcta" : "incorrecta",
    };
    setEstadoLetras(newEstado);
    setRespuestaUsuario("");

    const todasRespondidas = questions.every(
      (q) => newEstado[q.letter] === "correcta" || newEstado[q.letter] === "incorrecta"
    );

    if (todasRespondidas) {
      terminarPartida(newAnswers);
    } else {
      irASiguientePregunta(newEstado);
    }
  }

  // funcion para no vovler a caer en las letras ya jugadas.
  function irASiguientePregunta(estadoActual = estadoLetras) {
    let siguienteIndice = indicePregunta + 1;

    if (siguienteIndice >= questions.length) siguienteIndice = 0;

    while (
      estadoActual[questions[siguienteIndice].letter] === "correcta" ||
      estadoActual[questions[siguienteIndice].letter] === "incorrecta"
    ) {
      siguienteIndice++;
      if (siguienteIndice >= questions.length) siguienteIndice = 0;
      if (siguienteIndice === indicePregunta) break;
    }

    setIndicePregunta(siguienteIndice);
  }

  function iniciarCronometro() {

    // evita crear varios intervalos
    if (intervaloRef.current !== null) return;

    intervaloRef.current = setInterval(() => {
      setTiempoEmpleado((tiempoAnterior) => tiempoAnterior + 1);
    }, 1000);
  }

  function pararCronometro() {

    clearInterval(intervaloRef.current);

    // importante: resetear la referencia
    intervaloRef.current = null;
  }

  async function terminarPartida(currentAnswers = answers) {
    pararCronometro();
    const datosFinales = await finishGame(gameId, currentAnswers);
    if (datosFinales.score) {
      setResultadoFinal(datosFinales);
    } else {
      alert(datosFinales.message);
    }
  }

  return (
    resultadoFinal ? (
      <div>
        <div className="resultado-final">
          <p>PARTIDA TERMINADA</p>
          <p>Aciertos: {resultadoFinal.score.correct}</p>
          <p>Fallos: {resultadoFinal.score.wrong}</p>
          <p>Puntuación: {resultadoFinal.score.score}</p>
          <p>Tiempo empleado: {tiempoEmpleado} segundos</p>
        </div>

        {mostrarResumen && (
          <div style={{ maxWidth: "700px", margin: "0 auto 2rem", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1rem" }}>
            {questions.map((q) => {
              const estado = estadoLetras[q.letter];
              const color = estado === "correcta" ? "#7eff7e" : estado === "incorrecta" ? "#ff6b6b" : "#aaa";
              const icono = estado === "correcta" ? "✓" : estado === "incorrecta" ? "✗" : "—";
              return (
                <div key={q.letter} style={{
                  display: "flex", alignItems: "flex-start", gap: "0.75rem",
                  background: "rgba(0,0,0,0.35)", borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  borderLeft: `4px solid ${color}`,
                }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem", color, minWidth: "1.5rem" }}>
                    {icono} {q.letter}
                  </span>
                  <div style={{ flex: 1, fontSize: "0.85rem" }}>
                    <p style={{ margin: 0, opacity: 0.75 }}>{q.question}</p>
                    <p style={{ margin: "0.2rem 0 0", color: "#ffd740", fontWeight: "bold" }}>
                      {q.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="opciones-fin">
          <button className="btn-resumen" onClick={() => setMostrarResumen(!mostrarResumen)}>
            {mostrarResumen ? "Ocultar resumen" : "Ver resumen de letras"}
          </button>
          <button onClick={() => navigate("/ranking")}>Ver ranking</button>
          <button onClick={() => navigate("/gamemode")}>Volver a jugar</button>
          <button onClick={() => navigate("/")}>Salir</button>
        </div>
      </div>
    ) : (
      <section className="rosco">
        <div className="rosco-circulo">
          {letrasRosco.map((letra, index) => {
            const angulo = (360 / letrasRosco.length) * index - 90;
            const radio = 42;
            const x = 50 + radio * Math.cos((angulo * Math.PI) / 180);
            const y = 50 + radio * Math.sin((angulo * Math.PI) / 180);

            // cambiar estilo de la letra segun activa o no
            let claseLetra = "rosco-letra";

            if (estadoLetras[letra] === "correcta") {
              claseLetra = "rosco-letra correcta";
            }

            if (estadoLetras[letra] === "incorrecta") {
              claseLetra = "rosco-letra incorrecta";
            }

            if (estadoLetras[letra] === "pasada") {
              claseLetra = "rosco-letra pasada";
            }

            if (index === indicePregunta) {
              claseLetra = "rosco-letra activa";
            }

            return (
              <div
                key={letra}
                className={claseLetra}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {letra}
              </div>
            );
          })}

          <div className="rosco-centro">
            <h3>{preguntaActual ? preguntaActual.letter : "-"}</h3>
            <p>Tiempo:</p>
            <span>{tiempoEmpleado}</span>
          </div>
        </div>

        <div className="rosco-pregunta">
          <p>
            {preguntaActual
              ? preguntaActual.question
              : "No hay preguntas cargadas"}
          </p>
          <input
            type="text"
            placeholder="Escribe tu respuesta"
            value={respuestaUsuario}
            onChange={escribirRespuesta}
            disabled={partidaTerminada} // para deshabilitarlo cuando partidaTerminada
            onKeyDown={(e) => {
              if (e.key === "Enter" && !partidaTerminada) {
                e.preventDefault();
                responderPregunta();
              }
            }}
          />

          <div className="rosco-botones">
            <button
              type="button"
              onClick={responderPregunta}
              disabled={partidaTerminada}
            >
              Responder
            </button>
            <button
              type="button"
              onClick={pasarPalabra}
              disabled={partidaTerminada}
            >
              Pasapalabra
            </button>
            <button
              type="button"
              onClick={() => terminarPartida()}
              disabled={partidaTerminada}
            >
              Terminar
            </button>
          </div>
        </div>
      </section>
    )
  );
}