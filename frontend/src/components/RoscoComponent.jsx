import React, { useState } from "react";
import "./RoscoComponent.css";

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
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];

export default function RoscoComponent({ questions }) {
  //const preguntaActual = questions[0];
  const [indicePregunta, setIndicePregunta] = useState(0); // indice empieza en 0 ---> "a"
  const preguntaActual = questions[indicePregunta];

  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [estadoLetras, setEstadoLetras] = useState({});

function pasarPalabra() {
  setEstadoLetras({
    ...estadoLetras,
    [preguntaActual.letter]: "pasada"
  });

  if (indicePregunta < questions.length - 1) {
    setIndicePregunta(indicePregunta + 1);
  } else {
    setIndicePregunta(0);
  }

  setRespuestaUsuario("");
}

  function escribirRespuesta(evento) {
    setRespuestaUsuario(evento.target.value); // target es el input
  }

 function responderPregunta() {
  if (respuestaUsuario.toLowerCase() === preguntaActual.answer.toLowerCase()) {
    alert("Respuesta correcta");

    setEstadoLetras({
      ...estadoLetras,
      [preguntaActual.letter]: "correcta"
    });
  } else {
    alert("Respuesta incorrecta");

    setEstadoLetras({
      ...estadoLetras,
      [preguntaActual.letter]: "incorrecta"
    });
  }

  setRespuestaUsuario("");

  if (indicePregunta < questions.length - 1) {
    setIndicePregunta(indicePregunta + 1);
  } else {
    setIndicePregunta(0);
  }
}
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
          <p>Letra actual</p>
          <h3>{preguntaActual ? preguntaActual.letter : "-"}</h3>
          <span>02:00</span>
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
        />

        <div className="rosco-botones">
          <button type="button" onClick={responderPregunta}>
            RESPONDER
          </button>
          <button type="button" onClick={pasarPalabra}>
            PASAPALABRA
          </button>
          <button type="button">TERMINAR</button>
        </div>
      </div>
    </section>
  );
}
