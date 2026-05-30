import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMe, getMyStats } from "../services/users";
import { getMyQuestions } from "../services/questions";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const [userData, statsData] = await Promise.all([getMe(), getMyStats()]);
        setUser(userData);
        setStats(statsData);
      } catch (err) {
        setError("No se pudo cargar el perfil.");
        return;
      } finally {
        setLoading(false);
      }

      // Carga secundaria — no bloquea el perfil si falla
      try {
        const preguntasData = await getMyQuestions();
        setPreguntas(preguntasData);
      } catch {
        // silencioso: el botón simplemente no aparece
      }
    }
    cargarPerfil();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando perfil...</p>;
  if (error)   return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />

      <h2>MI PERFIL</h2>

      <section style={{ marginBottom: "2rem" }}>
        <p><strong>Usuario:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Miembro desde:</strong> {new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
      </section>

      <h3>Estadísticas</h3>
      <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Partidas jugadas"   value={stats.totalGames} />
        <StatCard label="Mejor puntuación"   value={stats.bestScore} />
        <StatCard label="Puntuación media"   value={stats.avgScore} />
        <StatCard label="Aciertos totales"   value={stats.totalCorrect} />
        <StatCard label="Fallos totales"     value={stats.totalWrong} />
        <StatCard label="Partidas perfectas" value={stats.perfectGames} />
        {stats.hardestLetter && (
          <StatCard label="Letra más fallada" value={stats.hardestLetter} />
        )}
      </section>

      {stats.byCategory.length > 0 && (
        <>
          <h3>Por Categoría</h3>
          <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
            <table style={{ margin: "0 auto 2rem", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Partidas</th>
                  <th style={thStyle}>Media</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCategory.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td style={tdStyle}>{cat.name}</td>
                    <td style={tdStyle}>{cat.games}</td>
                    <td style={tdStyle}>{cat.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/nueva-pregunta")} style={btnPrimary}>
          Crear pregunta
        </button>
        {preguntas.length > 0 && (
          <button onClick={() => navigate("/mis-preguntas")} style={btnSecondary}>
            Mis preguntas ({preguntas.length})
          </button>
        )}
        <button onClick={() => navigate("/home")} style={btnSecondary}>
          Volver al menú
        </button>
      </div>

      <FooterComponent />
    </main>
  );
}

function StatCard({ label, value }) {
    return (
      <div style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", padding: "1rem 1.5rem", minWidth:
  "130px" }}>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>{label}</p>
        <p style={{ margin: "0.3rem 0 0", fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
      </div>
    );
  }

const thStyle = { padding: "8px 16px", borderBottom: "2px solid #fff", color: "#fff", textTransform: "uppercase" };
const tdStyle = { padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "#fff" };
const btnPrimary = {
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.4rem",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
};

const btnSecondary = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: "8px",
  padding: "0.6rem 1.4rem",
  cursor: "pointer",
  fontSize: "1rem",
};