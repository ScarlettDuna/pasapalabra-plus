import React from "react";
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import GameModeComponent from "../components/GameModeComponent";

const GameMode = () => {
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent></HeaderComponent>
      <h2><span className='flechaSelección'>➥</span> MODOS DE JUEGO</h2>
      <GameModeComponent></GameModeComponent>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default GameMode;
