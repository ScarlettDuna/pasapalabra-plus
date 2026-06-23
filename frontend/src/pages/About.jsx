import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HeaderComponent from "../components/HeaderComponent";


const About = () => {
    return (
        <>
            <HeaderComponent></HeaderComponent>
            <div className='presentacion'>
                <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 3.5rem)", wordBreak: "break-word" }}>PASAPALABRA+</h1>
                <h3>Proyecto desarrollado como Trabajo de Fin de Ciclo de DAW</h3>
                <p style={{ marginBottom: "8px" }}>
                    Actualmente mantenido y desarrollado por Arantxa Reinoso.<br />
                    Creado junto a Luis Sampedro y Jaime Arenal.
                </p>
                <a
                    href="https://github.com/ScarlettDuna"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#FFD700", fontWeight: "bold" }}
                >
                    github.com/ScarlettDuna
                </a>
                <Link to="/home" style={{ marginTop: "16px" }}>
                    <button className='botonIniciar'>Volver al menú</button>
                </Link>
            </div>
        </>
    )
}

export default About
