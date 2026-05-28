import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './HeaderComponent.css'
import logo from '../assets/logo-pasapalabra.png'

function HeaderComponent() {
  return (
    <header className='Header'>
      <Link to='/home'>
        <img className="logo" src={logo} alt="logo" />
      </Link>
    </header>
  )
}

export default HeaderComponent;