import React from "react";
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import GameModeComponent from "../components/GameModeComponent";

const GameMode = () => {
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent></HeaderComponent>
      <h2>MODOS DE JUEGO</h2>
      <p>
        ¡Prepárate para el desafío definitivo! <br />Pon a prueba tu agilidad mental y
        tu vocabulario completando el famoso rosco <br /><br />
      </p>
      <section>
        <p>
        </p>
        <GameModeComponent></GameModeComponent>
      </section>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default GameMode;
