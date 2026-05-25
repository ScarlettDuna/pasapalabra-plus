import React from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import RoscoComponent from "../components/RoscoComponent";
import { useLocation } from "react-router-dom"; 

const Game = () => {
  const location = useLocation();
  const questions = location.state.questions;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent></HeaderComponent>
      <h2>ROSCO</h2>
      <p>Instrucciones del juego:</p>
      <section>
        <p></p>
      </section>
      <RoscoComponent questions={questions}/>
      <FooterComponent></FooterComponent>
    </main>
  );
};

export default Game;
