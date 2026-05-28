import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HeaderComponent from "../components/HeaderComponent";


const Welcome = () => {
        return (
            <>
                <HeaderComponent></HeaderComponent>
                <div className='presentacion'>
                    <h1>PASAPALABRAS-PLUS</h1>
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
