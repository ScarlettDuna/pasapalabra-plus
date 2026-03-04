import React from 'react'
import './HeaderComponent.css'

function HeaderComponent() {
  return (
    <header className='Header'>
      <div className='logo'>
        <img src="src/assets/logo-pasapalabra.png" alt="logo" />
        <h3>PASAPALABRA</h3>
      </div>
    </header>
  )
}

export default HeaderComponent;