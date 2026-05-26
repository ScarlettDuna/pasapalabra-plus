import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './HeaderComponent.css'

function HeaderComponent() {
  return (
    <header className='Header'>
      <Link to='/home'>
        <img className='logo' src="src/assets/logo-pasapalabra.png" alt="logo" />
      </Link>
    </header>
  )
}

export default HeaderComponent;