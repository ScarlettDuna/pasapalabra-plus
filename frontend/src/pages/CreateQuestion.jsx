import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { createQuestion } from "../services/questions";
import { getCategories } from "../services/categories";
import "../components/CreateQuestionComponent.css";

const LETRAS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

const IDIOMAS = [
  { label: "Español", code: "ES" },
  { label: "Inglés", code: "EN" },
  { label: "Français", code: "FR" }
];

const DIFICULTADES = [
  { label: "Fácil", value: "easy" },
  { label: "Media", value: "medium" },
  { label: "Difícil", value: "hard" }
];

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
        setForm((f) => ({
          ...f,
          categoryId: data[0]?.id ?? "",
        }));
      } catch {
        setCategorias([]);
      }
    }

    cargarCategorias();
  }, [form.language]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      <main className="cq-container">
        <HeaderComponent />

        <h2>¡Pregunta creada!</h2>

        <p>
          {form.isPersonal
            ? "Ya puedes usarla en tus partidas."
            : "Está pendiente de revisión y será visible cuando se apruebe."}
        </p>

        <button
          className="btn-crear-pregunta"
          onClick={() => {
            setForm({
              language: "ES",
              categoryId: "",
              letter: "A",
              difficulty: "easy",
              question: "",
              answer: "",
              isPersonal: true,
            });
            setError(null);
            setExito(false);
          }}
        >
          Crear otra
        </button>

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

  return (
    <main className="cq-container">
      <HeaderComponent />

      <h2>Nueva Pregunta</h2>

      <form onSubmit={handleSubmit} className="cq-form">

        <label>
          Idioma
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="cq-input"
          >
            {IDIOMAS.map((i) => (
              <option key={i.code} value={i.code}>
                {i.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoría
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="cq-input"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Letra
          <select
            name="letter"
            value={form.letter}
            onChange={handleChange}
            className="cq-input"
          >
            {LETRAS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dificultad
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="cq-input"
          >
            {DIFICULTADES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Pregunta
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            rows={3}
            className="cq-input"
            placeholder="Empieza por A: ..."
          />
        </label>

        <label>
          Respuesta
          <input
            name="answer"
            value={form.answer}
            onChange={handleChange}
            className="cq-input"
            placeholder="Respuesta correcta"
          />
        </label>

        <label className="cq-checkbox">
          <input
            type="checkbox"
            name="isPersonal"
            checked={form.isPersonal}
            onChange={handleChange}
          />
          Pregunta personal (solo para mis partidas)
        </label>

        <p className="cq-help">
          {form.isPersonal
            ? "Disponible solo en tus partidas."
            : "Pasará revisión antes de ser pública."}
        </p>

        {error && <p className="cq-error">{error}</p>}

        <button
          type="submit"
          disabled={enviando || !form.categoryId}
          className="btn-crear-pregunta"
        >
          {enviando ? "Enviando..." : "Crear pregunta"}
        </button>

      </form>

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