import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Dashboard() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error("Token inválido ou expirado");
        const data = await res.json();
        setUser(data.username || "usuário");
      })
      .catch(() => navigate("/login"));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo, {user}!</h2>
      <p>Você está logado 🎉</p>
      <button className="logout-button" onClick={logout}>Sair</button>
    </div>
  );
}
