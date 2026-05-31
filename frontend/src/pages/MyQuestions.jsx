import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMyQuestions } from "../services/questions";
import "../components/MyQuestionsComponent.css";

const DIFICULTAD = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

const ESTADO = {
  approved: "Aprobada",
  pending: "Pendiente",
  rejected: "Rechazada",
};

const ESTADO_COLOR = {
  approved: "#7eff7e",
  pending: "#ffd740",
  rejected: "#ff6b6b",
};

export default function MyQuestions() {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyQuestions()
      .then(setPreguntas)
      .catch(() =>
        setError("No se pudieron cargar tus preguntas.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mq-loading">Cargando...</p>;
  }

  if (error) {
    return <p className="mq-error">{error}</p>;
  }

  return (
    <main className="mq-container">
      <HeaderComponent />

      <h2>Mis preguntas</h2>

      <p className="mq-count">
        {preguntas.length} pregunta
        {preguntas.length !== 1 ? "s" : ""}
      </p>

      {preguntas.length === 0 ? (
        <p>Todavía no has creado ninguna pregunta.</p>
      ) : (
        <div className="mq-list">
          {preguntas.map((p) => (
            <div key={p.id} className="mq-card">
              <div className="mq-badges">
                <span className="badge">{p.letter}</span>
                <span className="badge">{p.language}</span>
                <span className="badge">
                  {DIFICULTAD[p.difficulty]}
                </span>

                {p.isPersonal && (
                  <span className="badge badge-personal">
                    Personal
                  </span>
                )}

                <span
                  className="badge"
                  style={{
                    color:
                      ESTADO_COLOR[p.status] ?? "#fff",
                  }}
                >
                  {ESTADO[p.status] ?? p.status}
                </span>
              </div>

              <p className="mq-question">{p.question}</p>

              <p className="mq-answer">
                Respuesta:{" "}
                <span className="mq-answer-text">
                  {p.answer}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn-back"
        onClick={() => navigate("/profile")}
      >
        Volver al perfil
      </button>

      <FooterComponent />
    </main>
  );
}