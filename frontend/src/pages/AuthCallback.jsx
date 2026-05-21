import { useEffect } from "react";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens } from "../services/token";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      saveTokens(token, refreshToken);
      // replace: true evita que el usuario pueda volver atrás con el botón del navegador
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return <p style={{ textAlign: "center", marginTop: "2rem" }}>Iniciando sesión...</p>;
}