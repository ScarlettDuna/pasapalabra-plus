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
                            <p>1. Completar el Rosco: Responde correctamente a las definiciones de la A a la Z.</p>
                            <p>2. Responder: Escribe tu respuesta y pulsa 'Enter' o el botón de enviar.</p>
                            <p>3. Pasapalabra: Si no sabes una respuesta, usa 'Pasapalabra' para saltarla y volver a ella al final de la vuelta.</p>
                            <p>4. Tiempo: El cronómetro medirá cuánto tardas en completar el juego. ¡Sé el más rápido para subir en el ranking!</p>
                            <p>5. Colores: El verde indica acierto, el rojo fallo y el azul/amarillo letras pendientes.</p>
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
