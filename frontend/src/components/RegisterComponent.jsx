import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import { register } from "../services/auth";

export default function RegisterComponent() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await register(username, email, password);

            console.log("REGISTER RESPONSE:", data);

            if (!data.ok) {
                alert("Error al registrarse");
                return;
            }

            alert("Usuario registrado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error conectando con el servidor");
        }

        navigate("/gamemode");
    };

    const handleGuest = () => {
        alert("Continuar como invitado...");

        navigate("/gamemode");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    className="customInput"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />

                <input
                    type="text"
                    placeholder="Correo Electrónico"
                    className="customInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="customInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />

                <button type="submit" className="customButton btn-login">
                    Registrarse
                </button>

                <button
                    type="button"
                    className="customButton btn-guest"
                    onClick={handleGuest}
                >
                    Continuar como invitado
                </button>
            </form>
        </div>
    );
}
