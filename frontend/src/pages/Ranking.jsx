import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import RankingComponent from "../components/RankingComponent";

export default function Ranking() {
  const navigate = useNavigate();
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent/>
      <h2><span className='flechaSelección'>➥</span> RANKING</h2>
      <RankingComponent/>
      <button onClick={() => navigate("/home")} style={btnBack}>
        Volver al menú
      </button>
      <FooterComponent />
    </main>
  );
}

const btnBack = {
  background: "transparent", color: "#fff",
  border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px",
  padding: "0.6rem 1.4rem", cursor: "pointer", fontSize: "1rem",
  marginTop: "1.5rem", marginBottom: "2rem",
};