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
      <FooterComponent />
    </main>
  );
}