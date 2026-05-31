import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import GameModeComponent from "../components/GameModeComponent";

const GameMode = () => {
  const navigate = useNavigate();
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent></HeaderComponent>
      <h2><span className='flechaSelección'>➥</span> MODOS DE JUEGO</h2>
      <GameModeComponent></GameModeComponent>
      <button onClick={() => navigate("/home")} style={btnBack}>
        Volver al menú
      </button>
      <FooterComponent></FooterComponent>
    </main>
  );
};

const btnBack = {
  background: "transparent", color: "#fff",
  border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px",
  padding: "0.6rem 1.4rem", cursor: "pointer", fontSize: "1rem",
  marginTop: "1rem", marginBottom: "2rem",
};

export default GameMode;
