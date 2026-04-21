import React, { useState } from 'react';
import './HeroComponent.css';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function HeroComponent() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen(!open);
    };

    return (
        <div className='menu'>
            <div className='titulo'>
                <h1>Menú</h1>
                <h1>Principal</h1>
            </div>

            <div className='opciones'>
                
                {/* BOTÓN PRINCIPAL */}
                <button className='botonJugar' onClick={toggleMenu}>
                    Jugar
                </button>

                {/* MENU DESPLEGABLE */}
                {open && (
                    <div className="dropdown">
                        <button onClick={() => navigate("/login")}>
                            Iniciar sesión
                        </button>

                        <button onClick={() => navigate("/register")}>
                            Registrarse
                        </button>

                        <Link to='/gamemode'>
                            <button onClick={() => navigate("/home")}>
                                Continuar como invitado
                            </button>
                        </Link>
                    </div>
                )}

                <button onClick={() => navigate("/")} className='botonSalir'>
                    Salir
                </button>

            </div>
        </div>
    );
}
