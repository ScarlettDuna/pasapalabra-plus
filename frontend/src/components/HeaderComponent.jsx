import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HeaderComponent.css';
import logo from '../assets/logo-pasapalabra.webp';
import { isLoggedIn, getRole } from '../services/token';
import { logoutUser } from '../services/auth';

function HeaderComponent() {
  const loggedIn = isLoggedIn();
  const isAdmin = getRole() === "admin";
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutUser();
    window.location.href = "/";
  }

  const cerrar = () => setMenuOpen(false);

  const navLinks = (
    <>
      {isAdmin && <Link to="/admin" style={linkStyle} onClick={cerrar}>Admin</Link>}
      <Link to="/profile" style={linkStyle} onClick={cerrar}>Mi perfil</Link>
      <Link to="/logros" style={linkStyle} onClick={cerrar}>Mis logros</Link>
      <button onClick={handleLogout} style={btnStyle}>Cerrar sesión</button>
    </>
  );

  return (
    <header className='Header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <Link to='/home'>
        <img className="logo" src={logo} alt="logo" />
      </Link>

      {loggedIn && (
        <>
          {/* Desktop */}
          <nav className="nav-desktop">{navLinks}</nav>

          {/* Móvil — botón hamburguesa */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Móvil — menú desplegable */}
          {menuOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0,
              background: "rgba(15,10,40,0.97)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "0 0 10px 10px",
              display: "flex", flexDirection: "column",
              gap: "0.75rem", padding: "1rem 1.25rem",
              zIndex: 100, minWidth: "160px",
            }}>
              {navLinks}
            </div>
          )}
        </>
      )}
    </header>
  );
}

const linkStyle = {
  color: "#fff", textDecoration: "none", fontSize: "0.9rem",
  border: "1px solid rgba(255,255,255,0.4)", borderRadius: "6px",
  padding: "0.3rem 0.8rem", background: "rgba(0,0,0,0.4)",
};

const btnStyle = {
  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.4)",
  color: "#fff", borderRadius: "6px", padding: "0.3rem 0.8rem",
  cursor: "pointer", fontSize: "0.9rem",
};

export default HeaderComponent;