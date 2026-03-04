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
        ¡Prepárate para el desafío definitivo! Pon a prueba tu agilidad mental y
        tu vocabulario completando el famoso Rosco
      </p>
      <section>
        <p>
          Aquí puedes empezar a añadir el contenido principal de tu aplicación.
        </p>
        <GameModeComponent></GameModeComponent>
      </section>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default GameMode;
