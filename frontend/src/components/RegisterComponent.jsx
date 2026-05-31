import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import { register, login } from "../services/auth";
import { saveTokens } from "../services/token";
import API_URL from "../services/api";
import googleLogo from "../assets/google-logo.webp";
import githubLogo from "../assets/github-logo.webp";

export default function RegisterComponent() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const result = await register(username, email, password);

            if (!result.ok) {
                setError(result.data.message);
                return;
            }
            // Auto-login tras registro
            const loginResult = await login(email, password);
            if (loginResult.ok) {
                saveTokens(loginResult.data.token, loginResult.data.refreshToken);
                navigate("/gamemode");
            } else {
                navigate("/login");
            }
        } catch {
            setError("Error conectando con el servidor");
        } finally {
            setLoading(false);
        }

    };

    const handleGuest = () => { navigate("/gamemode"); };
    const handleGoogleLogin = () => { window.location.href = `${API_URL}/auth/google`; };
    const handleGithubLogin = () => { window.location.href = `${API_URL}/auth/github`; };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    className="customInput"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Correo Electrónico"
                    className="customInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="customInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p style={{ color: "#ff6b6b", fontSize: "0.875rem", margin: "0" }}>{error}</p>}

                <div className="buttons-container">
                    <button type="submit" className="customButton btn-login" disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                    <button type="button" className="customButton btn-guest" onClick={handleGuest}>
                        Invitado
                    </button>
                </div>

                <div className="social-buttons">
                    <button type="button" className="customButton btn-google" onClick={handleGoogleLogin}>
                        <span className="social-button-content">
                            <img className="social-button-icon" src={googleLogo} alt="" />
                            <span>Google</span>
                        </span>
                    </button>
                    <button type="button" className="customButton btn-github" onClick={handleGithubLogin}>
                        <span className="social-button-content">
                            <img className="social-button-icon" src={githubLogo} alt="" />
                            <span>Github</span>
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
