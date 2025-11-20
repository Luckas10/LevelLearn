// src/services/auth.js
import api from "./api";

// FastAPI com OAuth2PasswordRequestForm espera "username" (vamos enviar o e-mail nele)
export async function loginWithPassword({ email, password }) {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    // Se seu auth estiver em /auth/token (pelo OAuth2PasswordBearer)
    const { data } = await api.post("/auth", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    // espera { access_token, token_type }
    return data;
}

export async function registerUser({ username, email, password }) {
    const { data } = await api.post("/users", {
        username: username,
        email: email,
        password: password,
    });
    return data;
}

export async function getDataUser() {
    const { data } = await api.get("/users/me");
    return data; // ex.: { id, username, email, ... }
}