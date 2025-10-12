import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.append("grant_type", "password");

    try {
      const res = await fetch("http://127.0.0.1:8000/auth", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erro no login");
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Entrar</button>
      <p style={{ color: "red" }}>{message}</p>
      <p>
        Não tem conta? <a href="/register">Cadastre-se</a>
      </p>
    </form>
  );
}
