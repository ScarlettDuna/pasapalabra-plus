// src/pages/Home.jsx
import React from 'react';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import HeroComponent from '../components/HeroComponent';

const Home = () => {
  return (
    <main>
      <HeaderComponent></HeaderComponent>
      <HeroComponent></HeroComponent>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default Home;