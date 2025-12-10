import { useState, useEffect } from "react";
import { getDataUser } from "../services/auth";
import api from "../services/api";

import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import CharacterModal from "../components/Dashboard/CharacterModal";

import "./Home.css";

export function Home() {
    // personagem atual (URL da imagem de frente)
    const [currentCharacter, setCurrentCharacter] = useState("/StoreItems/Gato.png");
    const [currentAvatarId, setCurrentAvatarId] = useState(null);

    // inventário de avatares (vem de /shop/me)
    const [inventory, setInventory] = useState([]);

    const [userXP, setUserXP] = useState(0);
    const [userXPRequired, setUserXPRequired] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [userCombo, setUserCombo] = useState(0);
    const [userBestStreak, setUserBestStreak] = useState(0);
    const [userStudyTime, setUserStudyTime] = useState(0); // minutos
    const [userLevel, setUserLevel] = useState(1);

    // ==== MISSÕES DIÁRIAS ====
    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(true);

    // ===== Helpers de avatar =====
    function getGlowForItem(name = "") {
        const lower = name.toLowerCase();
        if (lower.includes("gato")) return "#5368ff";
        if (lower.includes("raposa")) return "#dddddd";
        if (lower.includes("dragão") || lower.includes("dragao")) return "#00ff00";
        if (lower.includes("fênix") || lower.includes("fenix")) return "#fff70f";
        if (lower.includes("ouriço") || lower.includes("ourico")) return "#c5970d";
        if (lower.includes("cobra")) return "#9a0b93";
        return "#3B45F2";
    }

    // ===== Carregar usuário (/users/me) =====
    async function loadUser() {
        try {
            const user = await getDataUser();

            setUserXP(user.xp ?? 0);
            setUserXPRequired(user.xp_required ?? 0);
            setUserCoins(user.coins ?? 0);
            setUserCombo(user.combo ?? 0);
            setUserBestStreak(user.best_streak ?? 0);
            setUserStudyTime(user.study_time ?? 0);
            setUserLevel(user.level ?? 1);

            setCurrentAvatarId(user.current_avatar_id ?? null);
            setCurrentCharacter(
                user.current_avatar_front_path || "/StoreItems/Gato.png"
            );
        } catch (err) {
            console.error("Erro ao carregar dados do usuário:", err);
        }
    }

    // ===== Carregar inventário (/shop/me) =====
    async function loadInventory() {
        try {
            const { data } = await api.get("/shop/me");
            setInventory(data || []);
        } catch (err) {
            console.error("Erro ao carregar inventário:", err);
            setInventory([]);
        }
    }

    // ===== Missões diárias =====
    async function loadMissions() {
        try {
            setMissionsLoading(true);
            const { data } = await api.get("/daily-missions/today");
            setMissions(data || []);
        } catch (err) {
            console.error("Erro ao carregar missões diárias:", err);
            setMissions([]);
        } finally {
            setMissionsLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
        loadInventory();
        loadMissions();
    }, []);

    // coletar recompensa de uma missão
    async function handleClaimMission(mission) {
        if (!mission.completed || mission.claimed) return;

        try {
            await api.post(`/daily-missions/${mission.code}/claim`);
            await Promise.all([loadUser(), loadMissions()]);
        } catch (err) {
            console.error("Erro ao coletar missão:", err);
        }
    }

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

    // ===== Modal de personagens =====
    const [showModal, setShowModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // caminho padrão da imagem do Gato
    const GATO_FRONT = "/StoreItems/Gato.png";

    // tenta encontrar o Gato no inventário (ele foi seedado e associado ao user)
    const gatoItem = (inventory || []).find(
        (item) => item.image_front_path === GATO_FRONT
    );

    // Gato sempre aparece no modal
    const baseGato = {
        id: gatoItem?.id ?? null,
        name: gatoItem?.name || "Gato",
        img: GATO_FRONT,
        glow: getGlowForItem(gatoItem?.name || "Gato"),
    };

    // demais avatares comprados (exceto o Gato, pra não duplicar)
    const inventoryCharacters = (inventory || [])
        .filter((item) => item.id !== gatoItem?.id)
        .map((item) => ({
            id: item.id,
            name: item.name,
            img: item.image_front_path,
            glow: getGlowForItem(item.name),
        }));

    // lista final: Gato + todos os outros
    const characters = [baseGato, ...inventoryCharacters];

    const currentCharData =
        characters.find((c) => c.img === currentCharacter) || characters[0];
    const currentGlow = currentCharData?.glow || "#3B45F2";

    function openCharacterModal() {
        if (!characters || characters.length === 0) return;

        const found = characters.find((c) => c.img === currentCharacter);
        setSelectedCharacter(found || characters[0]);
        setShowModal(true);
    }

    function closeCharacterModal() {
        setShowModal(false);
    }

    // confirma o personagem escolhido e salva no backend
    async function handleConfirmCharacter() {
        if (!selectedCharacter) {
            setShowModal(false);
            return;
        }

        try {
            if (selectedCharacter.id) {
                // qualquer avatar com id, inclusive o Gato
                const { data: updatedUser } = await api.post(
                    `/users/me/avatar/${selectedCharacter.id}`
                );

                setCurrentAvatarId(updatedUser.current_avatar_id ?? null);
                setCurrentCharacter(
                    updatedUser.current_avatar_front_path || GATO_FRONT
                );
            } else {
                // fallback absoluto (se por algum bug não tiver id)
                setCurrentAvatarId(null);
                setCurrentCharacter(GATO_FRONT);
            }
        } catch (err) {
            console.error("Erro ao atualizar avatar:", err);
        } finally {
            setShowModal(false);
        }
    }

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
                                        style={{
                                            width: `${levelProgress * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* FOCO / ESTUDO */}
                            <div className="status-pill">
                                <span className="label">
                                    Tempo de estudo
                                </span>
                                <span className="value">{studyLabel}</span>
                                <div
                                    className="bar"
                                    title={`Meta diária: ${dailyGoalMinutes} min`}
                                >
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${focusProgress * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MISSÕES DIÁRIAS */}
                    <div className="card missions-card">
                        <div className="card-title">Missões Diárias</div>

                        {missionsLoading ? (
                            <p className="missions-empty">
                                Carregando missões...
                            </p>
                        ) : missions.length === 0 ? (
                            <p className="missions-empty">
                                Nenhuma missão para hoje. 🎉
                            </p>
                        ) : (
                            <ul className="missions-list">
                                {missions.map((mission) => {
                                    const progressRatio = mission.target
                                        ? Math.min(
                                              mission.progress /
                                                  mission.target,
                                              1
                                          )
                                        : 0;

                                    const isCompleted = mission.completed;
                                    const isClaimed = mission.claimed ?? false;

                                    let buttonLabel = "Em progresso";
                                    if (isClaimed) buttonLabel = "Coletado";
                                    else if (isCompleted)
                                        buttonLabel = `Coletar (+${mission.xp_reward} XP, +${mission.coins_reward} moedas)`;

                                    return (
                                        <li
                                            key={mission.code}
                                            className={
                                                isClaimed
                                                    ? "mission-claimed"
                                                    : ""
                                            }
                                        >
                                            <div className="mission-info">
                                                <span className="mission-title">
                                                    {mission.title}
                                                </span>
                                                <small className="mission-desc">
                                                    {mission.description}
                                                </small>

                                                <div className="mission-progress">
                                                    <span className="mission-progress-text">
                                                        {mission.progress} /{" "}
                                                        {mission.target}
                                                    </span>
                                                    <div className="bar">
                                                        <div
                                                            className="bar-fill"
                                                            style={{
                                                                width: `${
                                                                    progressRatio *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                className={`chip ${
                                                    isCompleted && !isClaimed
                                                        ? ""
                                                        : "chip-outline"
                                                }`}
                                                disabled={
                                                    !isCompleted || isClaimed
                                                }
                                                onClick={() =>
                                                    handleClaimMission(mission)
                                                }
                                            >
                                                {buttonLabel}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* PERSONAGEM */}
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
                            <span className="badge">LVL {userLevel}</span>

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
                            <button
                                className="btn-ghost"
                                onClick={openCharacterModal}
                            >
                                Ver Inventário
                            </button>
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
