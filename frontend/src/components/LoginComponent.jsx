import React, { useState } from "react";
import "./LoginComponent.css";
import { login } from "../services/auth";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(email, password);

            console.log("LOGIN RESPONSE:", data);

            if (!data.ok) {
                alert("Credenciales incorrectas");
                return;
            }

            alert("Login correcto");
        } catch (error) {
            console.error(error);
            alert("Error conectando con el servidor");
        }
    };

    const handleGuest = () => {
        alert("Entrando como invitado...");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                    Iniciar sesión
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