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
    setEstadoLetras({
      ...estadoLetras, // usammos ... para añadir al obj la siguiente letra y no sobreescribir
      [preguntaActual.letter]: "pasada",
    });

    irASiguientePregunta();

    setRespuestaUsuario("");
  }

  function escribirRespuesta(evento) {
    setRespuestaUsuario(evento.target.value); // target es el input
  }

  function responderPregunta() {
    // guardamos la questionid ej 1,2,3,4 y la respuesta del user ej. cerebro dentro del usestate answer
    setAnswers([
      ...answers, // usamos ... para no sobreescribir
      {
        questionId: preguntaActual.questionId,
        answer: respuestaUsuario,
      },
    ]);
    if (
      respuestaUsuario.toLowerCase() === preguntaActual.answer.toLowerCase()
    ) {
      //alert("respuesta correcta");

      setEstadoLetras({
        ...estadoLetras,
        [preguntaActual.letter]: "correcta",
      });

      console.log("answers hasta ahora:", answers);
    } else {
      //alert("respuesta incorrecta");

      setEstadoLetras({
        ...estadoLetras,
        [preguntaActual.letter]: "incorrecta",
      });
    }

    setRespuestaUsuario("");

    irASiguientePregunta();
  }

  // funcion para no vovler a caer en las letras ya jugadas.
  function irASiguientePregunta() {
    let siguienteIndice = indicePregunta + 1;

    if (siguienteIndice >= questions.length) {
      siguienteIndice = 0;
    }

    while (
      estadoLetras[questions[siguienteIndice].letter] === "correcta" ||
      estadoLetras[questions[siguienteIndice].letter] === "incorrecta"
    ) {
      siguienteIndice = siguienteIndice + 1;

      if (siguienteIndice >= questions.length) {
        siguienteIndice = 0;
      }

      if (siguienteIndice === indicePregunta) {
        break;
      }
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

  async function terminarPartida() {

    pararCronometro();

    const datosFinales = await finishGame(gameId, answers);

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

        <div className="opciones-fin">
          <button onClick={() => navigate("/ranking")}>
            VER RANKING
          </button>
          <button onClick={() => navigate("/gamemode")}>
            VOLVER A JUGAR
          </button>
          <button onClick={() => navigate("/")}>
            SALIR
          </button>
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
            <p>Tiempo restante:</p>
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
              RESPONDER
            </button>
            <button
              type="button"
              onClick={pasarPalabra}
              disabled={partidaTerminada}
            >
              PASAPALABRA
            </button>
            <button
              type="button"
              onClick={terminarPartida}
              disabled={partidaTerminada}
            >
              TERMINAR
            </button>
          </div>
        </div>
      </section>
    )
  );
}
