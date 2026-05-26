import React from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import RoscoComponent from "../components/RoscoComponent";
import { useLocation } from "react-router-dom";

const Game = () => {
  const location = useLocation();
  const questions = location.state.questions;
  const gameId = location.state.gameId;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent></HeaderComponent>
      <RoscoComponent questions={questions} gameId={gameId}/>
    </main>
  );
};

export default Game;
