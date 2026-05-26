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

export default function RoscoComponent({ questions }) {
  //const preguntaActual = questions[0];
  const [indicePregunta, setIndicePregunta] = useState(0); // indice empieza en 0 ---> "a"
  const preguntaActual = questions[indicePregunta];

  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [estadoLetras, setEstadoLetras] = useState({});

function pasarPalabra() {
  setEstadoLetras({
    ...estadoLetras, // usammos ... para añadir al obj la siguiente letra y no sobreescribir
    [preguntaActual.letter]: "pasada"
  });

  irASiguientePregunta();

  setRespuestaUsuario("");
}

  function escribirRespuesta(evento) {
    setRespuestaUsuario(evento.target.value); // target es el input
  }

 function responderPregunta() {
  if (respuestaUsuario.toLowerCase() === preguntaActual.answer.toLowerCase()) {
    //alert("respuesta correcta");

    setEstadoLetras({
      ...estadoLetras,
      [preguntaActual.letter]: "correcta"
    });
  } else {
    //alert("respuesta incorrecta");

    setEstadoLetras({
      ...estadoLetras,
      [preguntaActual.letter]: "incorrecta"
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
  return (
    <section className="rosco">
      <div className="rosco-circulo">
        {letrasRosco.map((letra, index) => {
          const angulo = (360 / letrasRosco.length) * index - 90;
          const radio = 170;
          const x = 200 + radio * Math.cos((angulo * Math.PI) / 180);
          const y = 200 + radio * Math.sin((angulo * Math.PI) / 180);

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
              style={{ left: `${x}px`, top: `${y}px` }}
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
