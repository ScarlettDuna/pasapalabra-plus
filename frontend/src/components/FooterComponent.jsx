import React from 'react'
import './FooterComponent.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function FooterComponent() {
  return (
    <footer className="footer">
        <div className="footer-container">

            <div className="footer-section">
            <ul>
              <Link to='/ranking'>
                <li>🌍 Ranking global</li>
              </Link>

              <Link to='/#'>
                <li>🏆 Acerca de nosotros</li>
              </Link>
            </ul>
            </div>
        </div>
    </footer>
  )
}
