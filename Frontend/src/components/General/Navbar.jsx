import FireIcon from "../../assets/Fire.png";
import CoinIcon from "../../assets/Coin.png";
import UserIcon from "../../assets/User.png";

import { useEffect, useState } from "react";
import { getDataUser } from "../../services/auth";

import "./Navbar.css";

export default function Navbar({ reloadFlag = 0 }) {   // 👈 recebe o sinal
    const [userName, setUserName] = useState("USERNAME");
    const [userLevel, setUserLevel] = useState(1);
    const [userXP, setUserXP] = useState(0);
    const [userXPRequired, setUserXPRequired] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [userCombo, setUserCombo] = useState(0);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getDataUser();

                setUserName(user.username);
                setUserLevel(user.level);
                setUserXP(user.xp);
                setUserXPRequired(user.xp_required ?? 0);
                setUserCoins(user.coins);
                setUserCombo(user.combo);
            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
            }
        }

        loadUser();
    }, [reloadFlag]); // 👈 sempre que reloadFlag mudar, recarrega

    // progresso baseado no XP que falta
    const levelProgress = (() => {
        const xp = userXP || 0;
        const required = userXPRequired || 0;

        if (xp <= 0 && required <= 0) return 0;
        if (required <= 0) return 1; // já passou ou está pronto pro próximo

        const progress = xp / (xp + required);
        return Math.min(Math.max(progress, 0), 1);
    })();

    // texto do tooltip da barra de XP
    const xpTooltip = (() => {
        const xp = userXP || 0;
        const required = userXPRequired || 0;

        if (required <= 0) {
            return `XP: ${xp} (pronto para o próximo nível!)`;
        }

        const totalNextLevel = xp + required; // XP total necessário para o próximo nível
        return `XP: ${xp} / ${totalNextLevel} (faltam ${required} XP)`;
    })();

    return (
        <nav className="navbar">
            {/* COMBO / STREAK */}
            <div className="offensive">
                <img src={FireIcon} alt="Fire Icon" />
                <span>{userCombo}</span>
            </div>

            {/* COINS */}
            <div className="coins">
                <img src={CoinIcon} alt="Coin Icon" />
                <span>{userCoins}</span>
            </div>

            {/* LEVEL + XP BAR */}
            <div className="level">
                <span>LVL {userLevel}</span>
                <div
                    className="level-bar"
                    title={xpTooltip}
                >
                    <div
                        className="level-bar-fill"
                        style={{
                            width: `${levelProgress * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* FOTO DO PERFIL */}
            <div className="profile-image">
                <img src={UserIcon} alt="User Icon" />
            </div>
        </nav>
    );
}
