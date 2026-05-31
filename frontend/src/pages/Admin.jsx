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
      <h2>Panel de administración</h2>
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

      <FooterComponent />
    </main>
  );
}

function Badge({ children, muted }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold",
      background: muted ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
      opacity: muted ? 0.7 : 1,
    }}>
      {children}
    </span>
  );
}

const cardStyle = {
  background: "rgba(0,0,0,0.45)",
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