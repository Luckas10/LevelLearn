import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import Gato from "../assets/Animals/Gato.png";
import "./Home.css";

export function Home() {
    return (
        <div className="home-page">
            <Sidebar />

            <section className="home-section">
                <Navbar />

                <div className="dashboard">
                    {/* STATUS */}
                    <div className="card status-card">
                        <div className="card-title">Seus Status</div>

                        <div className="status-grid">
                            <div className="status-pill">
                                <span className="label">Foco</span>
                                <span className="value">82%</span>
                                <div className="bar">
                                    <div className="bar-fill" style={{ width: "82%" }} />
                                </div>
                            </div>

                            <div className="status-pill">
                                <span className="label">Moedas</span>
                                <span className="value">1.240</span>
                                <div className="bar">
                                    <div className="bar-fill" style={{ width: "55%" }} />
                                </div>
                            </div>

                            <div className="status-pill">
                                <span className="label">XP</span>
                                <span className="value">3.450</span>
                                <div className="bar">
                                    <div className="bar-fill" style={{ width: "68%" }} />
                                </div>
                            </div>

                            <div className="status-pill">
                                <span className="label">Sequência</span>
                                <span className="value">7 dias</span>
                                <div className="bar">
                                    <div className="bar-fill" style={{ width: "70%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MISSÕES */}
                    <div className="card missions-card">
                        <div className="card-title">Missões Diárias</div>

                        <ul className="missions-list">
                            <li>
                                <span>Estudar 25 min (Pomodoro)</span>
                                <button className="chip chip-outline">Iniciar</button>
                            </li>
                            <li>
                                <span>Responder 10 flashcards</span>
                                <button className="chip">Continuar</button>
                            </li>
                            <li>
                                <span>Concluir 1 quiz</span>
                                <button className="chip chip-outline">Fazer</button>
                            </li>
                            <li>
                                <span>Revisão de ontem</span>
                                <button className="chip">Abrir</button>
                            </li>
                        </ul>
                    </div>

                    {/* PERSONAGEM */}
                    <div className="card character-card">
                        <div className="card-title">Seu Personagem</div>

                        <div className="character-wrap" aria-label="Personagem do usuário">
                            <div className="glow" />
                            <img className="character-img" src={Gato} alt="Gato personagem" />
                            <div className="floating-shadow" />
                            <span className="badge">LVL 12</span>

                            {/* adereços orbitando */}
                            <i className="orb orb-1" />
                            <i className="orb orb-2" />
                            <i className="orb orb-3" />
                        </div>

                        <div className="character-actions">
                            <button className="btn-primary">Personalizar</button>
                            <button className="btn-ghost">Ver Inventário</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
