import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { createQuestion } from "../services/questions";
import { getCategories } from "../services/categories";

const LETRAS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const IDIOMAS = [{ label: "Español", code: "ES" }, { label: "Inglés", code: "EN" }, { label: "Français", code: "FR" }];
const DIFICULTADES = [{ label: "Fácil", value: "easy" }, { label: "Media", value: "medium" }, { label: "Difícil", value: "hard" }];

export default function CreateQuestion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    language: "ES",
    categoryId: "",
    letter: "A",
    difficulty: "easy",
    question: "",
    answer: "",
    isPersonal: true,
  });
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const data = await getCategories(form.language);
        setCategorias(data);
        setForm((f) => ({ ...f, categoryId: data[0]?.id ?? "" }));
      } catch {
        setCategorias([]);
      }
    }
    cargarCategorias();
  }, [form.language]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await createQuestion({
        ...form,
        categoryId: Number(form.categoryId),
      });
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <main style={{ padding: "20px", textAlign: "center" }}>
        <HeaderComponent />
        <h2>¡Pregunta creada!</h2>
        <p>{form.isPersonal ? "Ya puedes usarla en tus partidas." : "Está pendiente de revisión y será visible para todos cuando se apruebe."}</p>
        <button onClick={() => setExito(false)} style={{ marginRight: "1rem" }}>Crear otra</button>
        <button onClick={() => navigate("/profile")}>Volver al perfil</button>
        <FooterComponent />
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <HeaderComponent />
      <h2>Nueva Pregunta</h2>

      <form onSubmit={handleSubmit} style={{ display: "inline-flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "500px", textAlign:
"left" }}>

        <label>
          Idioma
          <select name="language" value={form.language} onChange={handleChange} style={selectStyle}>
            {IDIOMAS.map((i) => <option key={i.code} value={i.code}>{i.label}</option>)}
          </select>
        </label>

        <label>
          Categoría
          <select name="categoryId" value={form.categoryId} onChange={handleChange} style={selectStyle}>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label>
          Letra
          <select name="letter" value={form.letter} onChange={handleChange} style={selectStyle}>
            {LETRAS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label>
          Dificultad
          <select name="difficulty" value={form.difficulty} onChange={handleChange} style={selectStyle}>
            {DIFICULTADES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </label>

        <label>
          Pregunta
          <textarea name="question" value={form.question} onChange={handleChange} required rows={3}
            placeholder="Empieza por A: ..."
            style={{ ...selectStyle, resize: "vertical" }} />
        </label>

        <label>
          Respuesta
          <input name="answer" value={form.answer} onChange={handleChange} required
            placeholder="Respuesta correcta"
            style={selectStyle} />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input type="checkbox" name="isPersonal" checked={form.isPersonal} onChange={handleChange} />
          Pregunta personal (solo para mis partidas)
        </label>
        <p style={{ margin: "-0.5rem 0 0", fontSize: "0.8rem", opacity: 0.6 }}>
          {form.isPersonal ? "Disponible solo en tus partidas, sin revisión." : "Irá a revisión y, si se aprueba, estará disponible para todos."}
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={enviando || !form.categoryId}>
          {enviando ? "Enviando..." : "Crear pregunta"}
        </button>

      </form>

      <FooterComponent />
    </main>
  );
}

const selectStyle = {
  display: "block",
  width: "100%",
  marginTop: "0.3rem",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(0,0,0,0.4)",
  color: "#fff",
  fontSize: "1rem",
};