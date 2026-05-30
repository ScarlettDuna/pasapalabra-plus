import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMe, getMyStats } from "../services/users";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const [userData, statsData] = await Promise.all([getMe(), getMyStats()]);
        setUser(userData);
        setStats(statsData);
      } catch (err) {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
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
        </>
      )}

      <button onClick={() => navigate("/home")} style={{ marginBottom: "2rem" }}>
        Volver al menú
      </button>
      <button onClick={() => navigate("/nueva-pregunta")} style={{ marginBottom: "1rem", marginRight: "1rem" }}>
        Crear Pregunta
      </button>

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