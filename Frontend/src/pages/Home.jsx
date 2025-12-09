import { useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import CharacterModal from "../components/Dashboard/CharacterModal";

import Gato from "../assets/Animals/Gato.png";
import Cobra from "../assets/Animals/Cobra.png";
import Dragao from "../assets/Animals/Dragao.png";
import Fenix from "../assets/Animals/Fenix.png";
import Ourico from "../assets/Animals/Ourico.png";
import Raposa from "../assets/Animals/Raposa.png";

import "./Home.css";

export function Home() {
    const [currentCharacter, setCurrentCharacter] = useState(Gato);

    const [showModal, setShowModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState({
        id: 1,
        name: "Gato",
        img: Gato,
    });

    const characters = [
        { id: 1, name: "Gato", img: Gato, glow: "#5368ff" },
        { id: 2, name: "Raposa", img: Raposa, glow: "#dddddd" },
        { id: 3, name: "Dragão", img: Dragao, glow: "#00ff00" },
        { id: 4, name: "Fênix", img: Fenix, glow: "#fff70f" },
        { id: 5, name: "Ouriço", img: Ourico, glow: "#c5970d" },
        { id: 6, name: "Cobra", img: Cobra, glow: "#9a0b93" },
        { id: 8, name: "Raposa 2", img: Raposa, glow: "#dddddd" },
        { id: 9, name: "Dragão 2", img: Dragao, glow: "#00ff00" },
        { id: 10, name: "Fênix 2", img: Fenix, glow: "#fff70f" },
        { id: 11, name: "Ouriço 2", img: Ourico, glow: "#c5970d" },
        { id: 12, name: "Cobra 2", img: Cobra, glow: "#9a0b93" },
        { id: 13, name: "Raposa 3", img: Raposa, glow: "#dddddd" },
        { id: 14, name: "Dragão 3", img: Dragao, glow: "#00ff00" },
        { id: 15, name: "Fênix 3", img: Fenix, glow: "#fff70f" },
        { id: 16, name: "Ouriço 3", img: Ourico, glow: "#c5970d" },
    ];

    const currentCharData = characters.find((c) => c.img === currentCharacter);
    const currentGlow = currentCharData?.glow || "#3B45F2";

    function openCharacterModal() {
        const found = characters.find((c) => c.img === currentCharacter);
        setSelectedCharacter(found || characters[0]);
        setShowModal(true);
    }

    function closeCharacterModal() {
        setShowModal(false);
    }

    function handleConfirmCharacter() {
        if (selectedCharacter) {
            setCurrentCharacter(selectedCharacter.img);
        }
        setShowModal(false);
    }

    return (
        <div className="home-page">
            <Sidebar />

            <section className="home-section">
                <Navbar />

                <div className="dashboard">
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

                    <div className="card character-card">
                        <div className="card-title">Seu Personagem</div>

                        <div
                            className="character-wrap"
                            aria-label="Personagem do usuário"
                            style={{ "--char-glow": currentGlow }}
                        >
                            <div className="glow" />
                            <img
                                className="character-img"
                                src={currentCharacter}
                                alt="Personagem atual"
                            />
                            <div className="floating-shadow" />
                            <span className="badge">LVL 12</span>

                            <i className="orb orb-1" />
                            <i className="orb orb-2" />
                            <i className="orb orb-3" />
                        </div>

                        <div className="character-actions">
                            <button
                                className="btn-primary"
                                onClick={openCharacterModal}
                            >
                                Personalizar
                            </button>
                            <button className="btn-ghost">Ver Inventário</button>
                        </div>
                    </div>
                </div>

                <CharacterModal
                    open={showModal}
                    current={currentCharacter}
                    selected={selectedCharacter}
                    characters={characters}
                    onSelect={setSelectedCharacter}
                    onClose={closeCharacterModal}
                    onConfirm={handleConfirmCharacter}
                />
            </section>
        </div>
    );
}

export default Home;
