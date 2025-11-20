import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import "./BattleFlashCards.css";

// Fundo e sprites (USAR OS SVGs da imagem 3)
import bgBattle from "../assets/Battle/Cenario-noite-desktop.png";
import gatoBattle from "../assets/Battle/Gato-tras-battle.svg";
import monstroBattle from "../assets/Battle/Monstro-quimica-battle.svg";

export function BattleFlashCards() {
    const playerHp = 69;
    const enemyHp = 85;

    return (
        <div className="blf-page">
            <Sidebar />
            <section className="blf-section">
                <Navbar />

                <div className="blf-content" style={{ backgroundImage: `url(${bgBattle})` }}>
                    {/* Título */}
                    <div className="blf-battle-header">
                        <div className="blf-battle-title">
                            Química - Estequiometria <span className="blf-divider" />
                            <span className="blf-difficulty">Hard</span>
                        </div>
                    </div>

                    {/* Arena */}
                    <div className="blf-arena">
                        {/* Player */}
                        <div className="blf-actor blf-player">
                            <div className="blf-hp-wrap blf-hp-left">
                                <div className="blf-hp-rail">
                                    <div className="blf-hp-green" style={{ width: `${playerHp}%` }} />
                                </div>
                                <span className="blf-hp-num">{playerHp}/100</span>
                            </div>

                            <img src={gatoBattle} alt="gato" className="blf-sprite blf-sprite-player" />
                        </div>

                        {/* Inimigo */}
                        <div className="blf-actor blf-enemy">
                            <div className="blf-hp-wrap blf-hp-right">
                                <div className="blf-hp-rail">
                                    <div className="blf-hp-green" style={{ width: `${enemyHp}%` }} />
                                </div>
                                <span className="blf-hp-num">{enemyHp}/100</span>
                            </div>

                            <img src={monstroBattle} alt="monstro" className="blf-sprite blf-sprite-enemy" />
                        </div>
                    </div>

                    {/* Caixa de ação */}
                    <div className="blf-action-box">VOCÊ ATACA O VILÃO COM SABEDORIA!</div>
                </div>
            </section>
        </div>
    );
}
