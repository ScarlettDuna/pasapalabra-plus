import React, { useState } from 'react';
import './HeroComponent.css';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../services/token';

export default function HeroComponent() {

  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  const loggedIn = isLoggedIn();


  return (
    <div className='menu'>
      <div className='titulo'>
        <h1>Menú <span>Principal</span></h1>
      </div>

      <div className='opciones'>

        {loggedIn ? (
          <button className='botonJugar' onClick={() => navigate("/gamemode")}>
            Jugar
          </button>
        ) : (
          <>
            <button className='botonJugar' onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
            <button className='botonJugar' onClick={() => navigate("/register")}>
              Registrarse
            </button>
            <button className='botonJugar' onClick={() => navigate("/gamemode")}>
              Jugar como invitado
            </button>
          </>
        )}

        <button className='botonInstrucciones' onClick={() => setOpenPopup(true)}>
          Instrucciones
        </button>

        {openPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Instrucciones del juego</h2>

              <p><strong>1. El Rosco:</strong> Responde correctamente a las definiciones de la A a la Z. Cada letra tiene una pregunta cuya respuesta empieza (o
                contiene) esa letra.</p>

              <p><strong>2. Responder:</strong> Escribe tu respuesta y pulsa Enter o el botón Responder.</p>

              <p><strong>3. Pasapalabra:</strong> Si no sabes una respuesta, pásala y vuelve a ella al final de la vuelta. Puedes dar tantas vueltas como quieras
                hasta que respondas todas o te rindas.</p>

              <p><strong>4. Colores:</strong> 🟢 Verde = acierto · 🔴 Rojo = fallo · 🟡 Amarillo = pendiente.</p>

              <p><strong>5. Puntuación:</strong> Cada acierto suma 100 puntos. Cada fallo resta 25. El tiempo empleado también descuenta, así que cuanto más rápido,
                mejor posición en el ranking.</p>

              <p><strong>6. Temáticas:</strong> Antes de jugar elige una categoría (Ciencia, Historia, Música, Deporte…) para que las preguntas sean del tema que
                más te guste.</p>

              <p><strong>7. Dificultad:</strong> Fácil, Media o Difícil. Las preguntas más difíciles son más específicas, pero la fórmula de puntuación es la misma
                para todos.</p>

              <p><strong>8. Idiomas:</strong> Puedes jugar en Español, Inglés o Francés. En inglés y francés las preguntas son de vocabulario y traducción.</p>

              <button onClick={() => setOpenPopup(false)}>Cerrar</button>
            </div>
          </div>
        )}

        <button onClick={() => navigate("/")} className='botonSalir'>
          Salir
        </button>

      </div>
    </div>
  );
}
