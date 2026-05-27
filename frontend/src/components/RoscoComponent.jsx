import React, { useEffect, useState } from "react";
import "./RoscoComponent.css";
import { finishGame } from "../services/games";

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

  // estado para el crono
  const [tiempoRestante, setTiempoRestante] = useState(10); // 120 seg

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

  async function terminarPartida() {
    const datosFinales = await finishGame(gameId, answers); // llamada al backend
    if (datosFinales.score) {
    setResultadoFinal(datosFinales); // lo guarda en el estado
  } else {
    alert(datosFinales.message); // si ya fue jugada la partida, lanza alert. 
  }
  }

  function restarTiempo() {
    setTiempoRestante(function (tiempoAnterior) {
      if (tiempoAnterior > 0) {
        return tiempoAnterior - 1;
      } else {
        return 0;
      }
    });
  }

  // useEffect para el cronómetro
  useEffect(function () {
    const intervalo = setInterval(restarTiempo, 1000);

    return function () {
      clearInterval(intervalo);
    };
  }, []);

  //para terminar la partida cuando llegue a 0 el contador
  useEffect(
    function () {
      if (tiempoRestante === 0) {
        terminarPartida();
      }
    },
    [tiempoRestante],
  );

  return (
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
          <span>{tiempoRestante}</span>
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

      {resultadoFinal && (
        <div className="resultado-final">
          <p>Partida terminada</p>
          <p>Aciertos: {resultadoFinal.score.correct}</p>
          <p>Fallos: {resultadoFinal.score.wrong}</p>
          <p>Puntuación: {resultadoFinal.score.score}</p>
        </div>
      )}
    </section>
  );
}
