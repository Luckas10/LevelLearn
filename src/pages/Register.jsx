import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erro ao cadastrar");
      }

      setMessage("Usuário criado! Faça login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrar</h2>

      <input
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Cadastrar</button>

      <p>
        Já tem conta? <a href="/login">Entrar</a>
      </p>

      {message && <p style={{ color: message.includes("Erro") ? "red" : "green" }}>{message}</p>}
    </form>
  );
}
