import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import { register } from "../services/auth";
import API_URL from "../services/api";
import googleLogo from "../assets/google-logo.webp";
import githubLogo from "../assets/github-logo.webp";

const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
};

const handleGithubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
};

export default function RegisterComponent() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await register(username, email, password);

            console.log("REGISTER RESPONSE:", result);

            if (!result.ok) {
                alert(result.data.message);
                return;
            }

            alert("Usuario registrado correctamente");

            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Error conectando con el servidor");
        }

    };

    const handleGuest = () => {
        alert("Continuar como invitado...");

        navigate("/gamemode");
    };

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

                <div className="buttons-container">
                    <button type="submit" className="customButton btn-login">
                        Registrarse
                    </button>

                    <button
                        type="button"
                        className="customButton btn-guest"
                        onClick={handleGuest}
                    >
                        Invitado
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
                            <span>Google</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="customButton btn-github"
                        onClick={handleGithubLogin}
                    >
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
