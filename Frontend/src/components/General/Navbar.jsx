import FireIcon from "../../assets/Fire.png";
import CoinIcon from "../../assets/Coin.png";
import UserIcon from "../../assets/User.png";

import { useEffect, useState } from "react";
import { getDataUser } from "../../services/auth";

import "./Navbar.css";

export default function Navbar() {
    const [userName, setUserName] = useState("USERNAME");
    const [userLevel, setUserLevel] = useState(1);
    const [userXP, setUserXP] = useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [userCombo, setUserCombo] = useState(0);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getDataUser();

                setUserName(user.username);
                setUserLevel(user.level);
                setUserXP(user.xp);
                setUserCoins(user.coins);
                setUserCombo(user.combo);

            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
            }
        }

        loadUser();
    }, []);

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
                <div className="level-bar">
                    <div
                        className="level-bar-fill"
                        style={{
                            width: `${Math.min((userXP / 100) * 100, 100)}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* FOTO DO PERFIL */}
            <div className="profile-image">
                <img src={UserIcon} alt="User Icon" />
            </div>
        </nav>
    );
}
