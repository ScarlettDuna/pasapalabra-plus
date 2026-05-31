import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HeaderComponent.css";
import logo from "../assets/logo-pasapalabra.webp";
import { isLoggedIn, getRole } from "../services/token";
import { logoutUser } from "../services/auth";

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
      {isAdmin && (
        <Link
          to="/admin"
          className="header-link"
          onClick={cerrar}
        >
          Admin ⚙️
        </Link>
      )}

      <Link
        to="/profile"
        className="header-link"
        onClick={cerrar}
      >
        Mi perfil 👤
      </Link>

      <Link
        to="/logros"
        className="header-link"
        onClick={cerrar}
      >
        Mis logros 🏆
      </Link>

      <button
        onClick={handleLogout}
        className="header-logout-btn"
      >
        Cerrar sesión ⏻
      </button>
    </>
  );

  return (
    <header className="Header header-container">
      <Link to="/home">
        <img
          className="logo"
          src={logo}
          alt="logo"
        />
      </Link>

      {loggedIn && (
        <>
          {/* Desktop */}
          <nav className="nav-desktop">
            {navLinks}
          </nav>

          {/* Móvil */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Menú móvil */}
          {menuOpen && (
            <div className="mobile-menu">
              {navLinks}
            </div>
          )}
        </>
      )}
    </header>
  );
}

export default HeaderComponent;