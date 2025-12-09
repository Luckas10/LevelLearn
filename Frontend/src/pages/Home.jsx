import { useState, useEffect } from "react";
import { getDataUser } from "../services/auth";
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

    const [userXP, setUserXP] = useState(0);
    const [userXPRequired, setUserXPRequired] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [userCombo, setUserCombo] = useState(0);
    const [userBestStreak, setUserBestStreak] = useState(0);
    const [userStudyTime, setUserStudyTime] = useState(0); // minutos

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getDataUser();

                setUserXP(user.xp ?? 0);
                setUserXPRequired(user.xp_required ?? 0);
                setUserCoins(user.coins ?? 0);
                setUserCombo(user.combo ?? 0);
                setUserBestStreak(user.best_streak ?? 0);
                setUserStudyTime(user.study_time ?? 0);
            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
            }
        }

        loadUser();
    }, []);

    // ==== PROGRESSOS NUMÉRICOS ====

    // XP: progresso até o próximo level
    const levelProgress = (() => {
        const xp = userXP || 0;
        const required = userXPRequired || 0;

        if (xp <= 0 && required <= 0) return 0;
        if (required <= 0) return 1;

        const progress = xp / (xp + required);
        return Math.min(Math.max(progress, 0), 1);
    })();

    // Foco / estudo: meta diária de 120 min
    const dailyGoalMinutes = 120;
    const focusProgress = Math.min(
        (userStudyTime || 0) / dailyGoalMinutes,
        1
    );

    // formatar tempo de estudo em "Xh Ym"
    const studyHours = Math.floor(userStudyTime / 60);
    const studyMinutesRest = userStudyTime % 60;
    const studyLabel =
        userStudyTime <= 0
            ? "Nenhum minuto ainda"
            : `${studyHours}h ${studyMinutesRest}min`;

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
                            {/* SEQUÊNCIA */}
                            <div className="status-pill">
                                <span className="label">Sequência</span>
                                <span className="value">{userCombo} dias</span>
                            </div>

                            {/* MOEDAS */}
                            <div className="status-pill">
                                <span className="label">Moedas</span>
                                <span className="value">{userCoins}</span>
                            </div>

                            {/* XP */}
                            <div className="status-pill">
                                <span className="label">XP</span>
                                <span className="value">{userXP}</span>
                                <div
                                    className="bar"
                                    title={
                                        userXPRequired <= 0
                                            ? `XP: ${userXP} (pronto para o próximo nível!)`
                                            : `XP até o próximo nível: faltam ${userXPRequired}`
                                    }
                                >
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${levelProgress * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* FOCO / ESTUDO */}
                            <div className="status-pill">
                                <span className="label">Tempo de estudo</span>
                                <span className="value">{studyLabel}</span>
                                <div
                                    className="bar"
                                    title={`Meta diária: ${dailyGoalMinutes} min`}
                                >
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${focusProgress * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card missions-card">
                        <div className="card-title">Missões Diárias</div>

                        <ul className="missions-list">
                            <li>
                                <span>Estudar 25 min (Pomodoro)</span>
                                <button className="chip chip-outline">
                                    Iniciar
                                </button>
                            </li>
                            <li>
                                <span>Responder 10 flashcards</span>
                                <button className="chip">Continuar</button>
                            </li>
                            <li>
                                <span>Concluir 1 quiz</span>
                                <button className="chip chip-outline">
                                    Fazer
                                </button>
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
                            {/* depois trocar por level real */}
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
