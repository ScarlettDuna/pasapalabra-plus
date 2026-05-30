import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import { login } from "../services/auth";
import { saveTokens } from "../services/token";
import API_URL from "../services/api";
import googleLogo from "../assets/google-logo.webp";
import githubLogo from "../assets/github-logo.webp";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await login(email, password);

            console.log("LOGIN RESPONSE:", result);

            if (!result.ok) {
                alert(result.data.message);
                return;
            }

            const token = result.data.token;
            const refreshToken = result.data.refreshToken;

            saveTokens(token, refreshToken);

            alert("Login correcto");
            navigate("/gamemode");
        } catch (error) {
            console.error(error);
            alert("Error conectando con el servidor");
        }
    };

    const handleGuest = () => {
        alert("Entrando como invitado...");
        navigate("/gamemode");
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    const handleGithubLogin = () => {
        window.location.href = `${API_URL}/auth/github`;
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
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

                <div className="buttons-container">
                    <button type="submit" className="customButton btn-login">
                        INICIAR SESIÓN
                    </button>

                    <button
                        type="button"
                        className="customButton btn-guest"
                        onClick={handleGuest}
                    >
                        INVITADO
                    </button>
                </div>

                <div className="social-buttons">
                    <button
                        type="button"
                        className="customButton btn-google"
                        onClick={handleGoogleLogin}
                    >
                        <span className="social-button-content">
                            <img className="social-button-icon" src={googleLogo} alt="" />
                            <span>ENTRAR CON GOOGLE</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="customButton btn-github"
                        onClick={handleGithubLogin}
                    >
                        <span className="social-button-content">
                            <img className="social-button-icon" src={githubLogo} alt="" />
                            <span>ENTRAR CON GITHUB</span>
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
