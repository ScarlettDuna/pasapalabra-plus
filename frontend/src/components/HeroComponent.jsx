import React, { useState } from 'react';
import './HeroComponent.css';
import { useNavigate } from 'react-router-dom';

export default function HeroComponent() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen(!open);
    };

    return (
        <div className='menu'>
            <div className='titulo'>
                <h1>Menú <span>Principal</span></h1>
            </div>

            <div className='opciones'>
                
                {/* BOTÓN PRINCIPAL */}
                <button className='botonJugar' onClick={toggleMenu}>
                    JUGAR
                </button>

                {/* MENU DESPLEGABLE */}
                {open && (
                    <div className="dropdown">
                        <button onClick={() => navigate("/login")}>
                            INICIAR SESIÓN
                        </button>

                        <button onClick={() => navigate("/register")}>
                            REGISTRARSE
                        </button>

                        <button onClick={() => navigate("/gamemode")}>
                            INVITADO
                        </button>
                    </div>
                )}

                <button onClick={() => navigate("/")} className='botonSalir'>
                    SALIR
                </button>

            </div>
        </div>
    );
}
