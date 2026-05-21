import React, { Component } from 'react'
import reactLogo from '../assets/logo-pasapalabra.png'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


const Welcome = () => {
        return (
            <>
                <div>
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </div>
                <h1>PASAPALABRAS-PLUS</h1>
                <h3>By Luis Sampedro, Arantxa Reinoso, Jaime Arenal</h3>
                <Link to="/home">
                    <button className='botonIniciar'>Iniciar</button>
                </Link>
            </>
        )
}

export default Welcome
