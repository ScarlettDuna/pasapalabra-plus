import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderComponent.css';
import logo from '../assets/logo-pasapalabra.webp';
import { isLoggedIn, getRole } from '../services/token';
import { logoutUser } from '../services/auth';

function HeaderComponent() {
  const loggedIn = isLoggedIn();
  const isAdmin = getRole() === "admin";

  async function handleLogout() {
    await logoutUser();
    window.location.href = "/";
  }

  return (
    <header className='Header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to='/home'>
        <img className="logo" src={logo} alt="logo" />
      </Link>
      {loggedIn && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingRight: "1.5rem" }}>
          {isAdmin && (
            <Link to="/admin" style={linkStyle}>Admin</Link>
          )}
          <Link to="/profile" style={linkStyle}>Mi perfil</Link>
          <button onClick={handleLogout} style={btnStyle}>Cerrar sesión</button>
        </div>
      )}
    </header>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "0.9rem",
};

const btnStyle = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "#fff",
  borderRadius: "6px",
  padding: "0.3rem 0.8rem",
  cursor: "pointer",
  fontSize: "0.9rem",
};

export default HeaderComponent;