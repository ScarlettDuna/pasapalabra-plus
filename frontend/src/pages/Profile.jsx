import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMe, getMyStats } from "../services/users";
import { getMyQuestions } from "../services/questions";
import "../components/ProfileComponent.css";

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
        const [userData, statsData] = await Promise.all([
          getMe(),
          getMyStats(),
        ]);

        setUser(userData);
        setStats(statsData);
      } catch (err) {
        setError("No se pudo cargar el perfil.");
        return;
      } finally {
        setLoading(false);
      }

      try {
        const preguntasData = await getMyQuestions();
        setPreguntas(preguntasData);
      } catch {
        // silencioso
      }
    }

    cargarPerfil();
  }, []);

  if (loading) {
    return <p className="profile-loading">Cargando perfil...</p>;
  }

  if (error) {
    return <p className="profile-error">{error}</p>;
  }

  return (
    <main className="profile-container">
      <HeaderComponent />

      <h2>
        <span className="flechaSelección">➥</span> MI PERFIL
      </h2>

      <section className="profile-info">
        <p>
          <strong>Usuario:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Miembro desde:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString("es-ES")}
        </p>
      </section>

      <h3>Estadísticas</h3>

      <section className="stats-container">
        <StatCard
          label="Partidas jugadas"
          value={stats.totalGames}
        />
        <StatCard
          label="Mejor puntuación"
          value={stats.bestScore}
        />
        <StatCard
          label="Puntuación media"
          value={stats.avgScore}
        />
        <StatCard
          label="Aciertos totales"
          value={stats.totalCorrect}
        />
        <StatCard
          label="Fallos totales"
          value={stats.totalWrong}
        />
        <StatCard
          label="Partidas perfectas"
          value={stats.perfectGames}
        />

        {stats.hardestLetter && (
          <StatCard
            label="Letra más fallada"
            value={stats.hardestLetter}
          />
        )}
      </section>

      {stats.byCategory.length > 0 && (
        <>
          <h3>Por Categoría</h3>

          <div className="table-container">
            <table className="profile-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Partidas</th>
                  <th>Media</th>
                </tr>
              </thead>

              <tbody>
                {stats.byCategory.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td>{cat.name}</td>
                    <td>{cat.games}</td>
                    <td>{cat.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="profile-actions">
        <button
          className="btn-primary"
          onClick={() => navigate("/nueva-pregunta")}
        >
          Crear pregunta
        </button>

        {preguntas.length > 0 && (
          <button
            className="btn-secondary"
            onClick={() => navigate("/mis-preguntas")}
          >
            Mis preguntas ({preguntas.length})
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={() => navigate("/home")}
        >
          Volver al menú
        </button>
      </div>

      <FooterComponent />
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}