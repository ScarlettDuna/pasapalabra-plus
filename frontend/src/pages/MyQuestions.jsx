import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMyQuestions } from "../services/questions";

const DIFICULTAD = { easy: "Fácil", medium: "Media", hard: "Difícil" };
const ESTADO = { approved: "Aprobada", pending: "Pendiente", rejected: "Rechazada" };
const ESTADO_COLOR = { approved: "#7eff7e", pending: "#ffd740", rejected: "#ff6b6b" };

export default function MyQuestions() {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyQuestions()
      .then(setPreguntas)
      .catch(() => setError("No se pudieron cargar tus preguntas."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />
      <h2>Mis preguntas</h2>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>{preguntas.length} pregunta{preguntas.length !== 1 ? "s" : ""}</p>

      {preguntas.length === 0 ? (
        <p>Todavía no has creado ninguna pregunta.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "700px", margin: "0 auto 2rem" }}>
          {preguntas.map((p) => (
            <div key={p.id} style={cardStyle}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={badgeStyle}>{p.letter}</span>
                <span style={badgeStyle}>{p.language}</span>
                <span style={badgeStyle}>{DIFICULTAD[p.difficulty]}</span>
                {p.isPersonal && <span style={{ ...badgeStyle, background: "rgba(100,100,255,0.2)", color: "#aaaaff" }}>Personal</span>}
                <span style={{ ...badgeStyle, color: ESTADO_COLOR[p.status] ?? "#fff" }}>
                  {ESTADO[p.status] ?? p.status}
                </span>
              </div>
              <p style={{ margin: "0.3rem 0", fontWeight: "bold", textAlign: "left" }}>{p.question}</p>
              <p style={{ margin: "0.3rem 0", opacity: 0.8, textAlign: "left" }}>
                Respuesta: <span style={{ color: "#7eff7e" }}>{p.answer}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/profile")} style={btnBack}>
        Volver al perfil
      </button>
      <FooterComponent />
    </main>
  );
}

const cardStyle = {
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "1rem 1.25rem",
};

const badgeStyle = {
  padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold",
  background: "rgba(255,255,255,0.15)", color: "#fff",
};

const btnBack = {
  background: "transparent", color: "#fff",
  border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px",
  padding: "0.6rem 1.4rem", cursor: "pointer", fontSize: "1rem",
  marginBottom: "2rem",
};