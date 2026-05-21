import { useState, useEffect } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import API_URL, { apiFetch } from "../services/api";

const IDIOMAS = [
  { label: "Español", code: "ES" },
  { label: "Inglés", code: "EN" },
  { label: "Français", code: "FR" },
];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

async function getRanking(language, categoryId) {
  let url = `${API_URL}/ranking?language=${language}`;
  if (categoryId) url += `&category=${categoryId}`;

  const res = await apiFetch(url);
  if (!res || !res.ok) throw new Error("No se pudo cargar el ranking");
  return res.json();
}

export default function Ranking() {
  const [language, setLanguage] = useState("ES");
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarRanking() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRanking(language);
        setRanking(data);
      } catch (err) {
        setError("No se pudo cargar el ranking.");
      } finally {
        setLoading(false);
      }
    }
    cargarRanking();
  }, [language]);

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />
      <h2>RANKING</h2>

      <div style={{ marginBottom: "20px" }}>
        {IDIOMAS.map((idioma) => (
          <button
            key={idioma.code}
            onClick={() => setLanguage(idioma.code)}
            className={language === idioma.code ? "btn-idioma activo" : "btn-idioma"}
            style={{ margin: "0 8px" }}
          >
            {idioma.label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando ranking...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && ranking.length === 0 && (
        <p>Aún no hay partidas registradas en este idioma.</p>
      )}

      {!loading && !error && ranking.length > 0 && (
        <table style={{ margin: "0 auto", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Jugador</th>
              <th style={thStyle}>Puntuación</th>
              <th style={thStyle}>Aciertos</th>
              <th style={thStyle}>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((entry) => (
              <tr key={entry.position}>
                <td style={tdStyle}>{entry.position}</td>
                <td style={tdStyle}>{entry.playerName}</td>
                <td style={tdStyle}>{entry.score}</td>
                <td style={tdStyle}>{entry.correct} / 26</td>
                <td style={tdStyle}>{formatDuration(entry.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <FooterComponent />
    </main>
  );
}

const thStyle = {
  padding: "10px 20px",
  borderBottom: "2px solid #fff",
  color: "#fff",
  textTransform: "uppercase",
};

const tdStyle = {
  padding: "10px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
};