import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getPendingQuestions, approveQuestion, rejectQuestion } from "../services/admin";

const DIFICULTAD = { easy: "Fácil", medium: "Media", hard: "Difícil" };

export default function Admin() {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPendingQuestions()
      .then(setPreguntas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(id) {
    try {
      await approveQuestion(id);
      setPreguntas((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await rejectQuestion(id);
      setPreguntas((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>;

  if (error === "403") return (
    <main style={{ textAlign: "center", padding: "2rem" }}>
      <HeaderComponent />
      <h2>Acceso restringido</h2>
      <p>Esta página es solo para administradores.</p>
      <button onClick={() => navigate("/home")}>Volver al menú</button>
    </main>
  );

  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />
      <h2><span className='flechaSelección'>➥</span> PANEL DE ADMINISTRACIÓN</h2>
      <p style={{ opacity: 0.7 }}>Preguntas pendientes de revisión: {preguntas.length}</p>

      {preguntas.length === 0 && (
        <p style={{ marginTop: "2rem" }}>No hay preguntas pendientes. ¡Todo al día!</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "700px", margin: "2rem auto" }}>
        {preguntas.map((p) => (
          <div key={p.id} style={cardStyle}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <Badge>{p.letter}</Badge>
              <Badge>{p.language}</Badge>
              <Badge>{DIFICULTAD[p.difficulty]}</Badge>
              <Badge accent>{p.category?.name ?? "Categoría desconocida"}</Badge>
              <Badge muted>por {p.creator?.username ?? "desconocido"}</Badge>
            </div>

            <p style={{ margin: "0.3rem 0", fontWeight: "bold" }}>{p.question}</p>
            <p style={{ margin: "0.3rem 0", opacity: 0.8 }}>
              Respuesta: <span style={{ color: "#7eff7e" }}>{p.answer}</span>
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
              <button onClick={() => handleApprove(p.id)} style={btnApprove}>Aprobar</button>
              <button onClick={() => handleReject(p.id)} style={btnReject}>Rechazar</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-volver-menu" onClick={() => navigate("/home")} style={{ width: "fit-content", margin: "1rem auto" }}>
        Volver al menú
      </button>
      <FooterComponent />
    </main>
  );
}

function Badge({ children, muted, accent }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold",
      background: accent ? "rgba(255,200,0,0.2)" : muted ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
      color: accent ? "#ffd740" : "#fff",
      opacity: muted ? 0.7 : 1,
    }}>
      {children}
    </span>
  );
}

const cardStyle = {
  background: "rgba(0, 0, 0, 0.6)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "1rem 1.25rem",
  textAlign: "left",
};

const btnApprove = {
  background: "#2e7d32", color: "#fff", border: "none",
  borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer",
};

const btnReject = {
  background: "#b71c1c", color: "#fff", border: "none",
  borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer",
};

const btnBack = {
  background: "transparent", color: "#fff",
  border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px",
  padding: "0.6rem 1.4rem", cursor: "pointer", fontSize: "1rem",
  marginTop: "1.5rem", marginBottom: "2rem",
};