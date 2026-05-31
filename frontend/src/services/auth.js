import API_URL from "./api";
import { getRefreshToken, clearTokens } from "./token";

// LOGIN
export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    return { ok: res.ok, data }
}

// REGISTER
export async function register(username, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    return { ok: res.ok, data }
}

// Log out
export async function logoutUser() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        }).catch(() => { });
    }
    clearTokens();
}