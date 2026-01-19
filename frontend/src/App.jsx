import { useState } from 'react'
import reactLogo from './assets/logo-pasapalabra.png'
import viteLogo from '/vite.svg'
import ButtonComponent_Inicio from "./components/ButtonComponent_Inicio";
import ButtonComponent_Invitado from "./components/ButtonComponent_Invitado";

import './App.css'

function App() {

  return (
    <>
      <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>PASAPALABRAS-PLUS</h1>
      <h3>By Luis Sampedro, Arantxa Reinoso, Jaime Arenal  </h3>
    <ButtonComponent_Inicio></ButtonComponent_Inicio>
    <ButtonComponent_Invitado></ButtonComponent_Invitado>
    
    </>
  )
}

export default App
