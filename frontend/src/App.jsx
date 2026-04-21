import { useState } from 'react'
import reactLogo from './assets/logo-pasapalabra.png'
import viteLogo from '/vite.svg'
import './App.css'

// 1. Importamos Home y el Router
import Home from './pages/Home'; 
import Login from './pages/Login'; 
import Register from './pages/Register';
import GameMode from './pages/GameMode';
import Game from './pages/Game';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; 


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA 1: Lo que ves al entrar (Login/Bienvenida) */}
        <Route path="/" element={
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
        } />

        {/* RUTA 2: La página Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gamemode" element={<GameMode />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;