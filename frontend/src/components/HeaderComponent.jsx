import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './HeaderComponent.css'
import logo from '../assets/logo-pasapalabra.webp';
import { isLoggedIn } from '../services/token';

function HeaderComponent() {
  return (
    <header className='Header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to='/home'>
        <img className="logo" src={logo} alt="logo" />
      </Link>
      {isLoggedIn() && (
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none", paddingRight: "1rem" }}>
            Mi perfil
          </Link>
        )}
    </header>
  )
}

export default HeaderComponent;