import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { getMyAchievements } from "../services/users";
import "../components/ProfileComponent.css";

const ACHIEVEMENTS = [
  { code: "FIRST_GAME",        name: "Primera partida",        description: "Completa tu primera partida" },
  { code: "NEWBIE",            name: "Novato",                 description: "Completa 5 partidas" },
  { code: "SENIOR",            name: "Senior",                 description: "Completa 25 partidas" },
  { code: "ADDICTED",          name: "Adicto",                 description: "Completa 50 partidas" },
  { code: "LORD_OF_THE_WORDS", name: "Señor de las palabras",  description: "Completa 200 partidas" },
  { code: "PERFECT_GAME",      name: "Partida perfecta",       description: "Completa el rosco sin ningún fallo (26/26)" },
  { code: "SHARPSHOOTER",      name: "Tirador de élite",       description: "Consigue más de 2000 puntos en una partida" },
  { code: "SPEED_DEMON",       name: "Velocista",              description: "Completa el rosco en menos de 3 minutos" },
  { code: "POLYGLOT",          name: "Políglota",              description: "Juega en los 3 idiomas disponibles" },
  { code: "EXPLORER",          name: "Explorador",             description: "Juega en 3 categorías diferentes" },
  { code: "CONTRIBUTOR",       name: "Colaborador",            description: "Añade tu primera pregunta personalizada" },
  { code: "EDITOR",            name: "Editor",                 description: "Añade 5 preguntas personalizadas" },
  { code: "DICTIONARY_KING",   name: "Rey del diccionario",    description: "Ten la puntuación más alta del ranking global (revocable)" },
];

export default function Achievements() {
  const [unlockedMap, setUnlockedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyAchievements()
      .then((data) => {
        const map = {};
        data.forEach((a) => {
          if (!a.revokedAt) map[a.achievement] = a.unlockedAt;
        });
        setUnlockedMap(map);
      })
      .catch(() => setError("No se pudieron cargar los logros."))
      .finally(() => setLoading(false));
  }, []);

  const desbloqueados = Object.keys(unlockedMap).length;

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando logros...</p>;
  if (error)   return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>;

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />
      <h2><span className='flechaSelección'>➥</span> MIS LOGROS</h2>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
        {desbloqueados} / {ACHIEVEMENTS.length} desbloqueados
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "1.2rem",
        maxWidth: "800px",
        margin: "0 auto 2rem",
      }}>
        {ACHIEVEMENTS.map((a) => (
          <AchievementCard
            key={a.code}
            achievement={a}
            unlockedAt={unlockedMap[a.code] ?? null}
          />
        ))}
      </div>

      <button className="btn-volver-perfil" onClick={() => navigate("/profile")}>
        Volver al perfil
      </button>
      <FooterComponent />
    </main>
  );
}

function AchievementCard({ achievement, unlockedAt }) {
  const [hovered, setHovered] = useState(false);
  const unlocked = !!unlockedAt;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${unlocked ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "12px",
        padding: "1rem 0.5rem",
        cursor: "default",
        transition: "transform 0.15s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <img
        src={`/achievements/${achievement.code}.png`}
        alt={achievement.name}
        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
        style={{
          width: "72px",
          height: "72px",
          objectFit: "contain",
          filter: unlocked ? "none" : "grayscale(1) brightness(0.3)",
          display: "block",
          margin: "0 auto 0.5rem",
        }}
      />
      {/* Placeholder si la imagen no existe aún */}
      <div style={{
        display: "none",
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background: unlocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 0.5rem",
        fontSize: "1.6rem",
      }}>
        🏆
      </div>

      <p style={{
        margin: 0,
        fontSize: "0.75rem",
        fontWeight: "bold",
        opacity: unlocked ? 1 : 0.35,
      }}>
        {achievement.name}
      </p>

      {hovered && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a2e",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          padding: "0.5rem 0.75rem",
          fontSize: "0.75rem",
          width: "160px",
          zIndex: 10,
          pointerEvents: "none",
        }}>
          {unlocked
            ? `✓ Desbloqueado el ${new Date(unlockedAt).toLocaleDateString("es-ES")}`
            : achievement.description}
        </div>
      )}
    </div>
  );
}
