import React from 'react';
import './RoscoComponent.css';

const letrasRosco = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'L', 'M', 'N', 'Ñ',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'X', 'Y', 'Z'
];

export default function RoscoComponent({ questions }) {
  const preguntaActual = questions[0];
  return (
    <section className="rosco">
      <div className="rosco-circulo">
        
        {letrasRosco.map((letra, index) => {
          const angulo = (360 / letrasRosco.length) * index - 90;
          const radio = 170;
          const x = 200 + radio * Math.cos((angulo * Math.PI) / 180);
          const y = 200 + radio * Math.sin((angulo * Math.PI) / 180);

    

          return (
            <div
              key={letra}
              className={`rosco-letra ${index === 0 ? 'activa' : ''}`}
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
        <p>{preguntaActual ? preguntaActual.question : "No hay preguntas cargadas"}</p>
        <input type="text" placeholder="Escribe tu respuesta" />

        <div className="rosco-botones">
          <button type="button">RESPONDER</button>
          <button type="button">PASAPALABRA</button>
          <button type="button">TERMINAR</button>
        </div>
      </div>
    </section>
  );
}
