// src/pages/Home.jsx
import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import LoginComponent from '../components/LoginComponent';
import FooterComponent from '../components/FooterComponent';

const Login = () => {
  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <HeaderComponent></HeaderComponent>
      <h2>INICIAR SESIÓN</h2>
      <section>
        <LoginComponent></LoginComponent>
      </section>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default Login;