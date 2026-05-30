import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HeaderComponent from "../components/HeaderComponent";


const Welcome = () => {
        return (
            <>
                <HeaderComponent></HeaderComponent>
                <div className='presentacion'>
                    <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 3.5rem)", wordBreak: "break-word" }}>PASAPALABRA-PLUS</h1>
                    <h3>By Luis Sampedro, Arantxa Reinoso, Jaime Arenal</h3>
                    <h3>2º Desarrollo Aplicaciones Web Bilingüe</h3>
                    <Link to="/home">
                        <button className='botonIniciar'>INICIAR</button>
                    </Link>
                </div>
            </>
        )
}

export default Welcome
