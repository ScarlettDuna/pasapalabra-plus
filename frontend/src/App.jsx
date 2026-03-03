import { useState } from 'react'
import reactLogo from './assets/logo-pasapalabra.png'
import viteLogo from '/vite.svg'
import ButtonComponent_Inicio from "./components/ButtonComponent_Inicio";
import ButtonComponent_Invitado from "./components/ButtonComponent_Invitado";
import './App.css'

// 1. Importamos Home y el Router
import Home from './pages/Home'; 
import Login from './pages/Login'; 
import Contact from './pages/Contact'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

          </>
        } />

        {/* RUTA 2: La página Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;