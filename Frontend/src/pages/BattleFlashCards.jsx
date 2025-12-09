import { useEffect, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";

import { ModalTitle } from "../components/Study/FlashCards/Collection/Battle/ModalTitle";
import { ModalFront } from "../components/Study/FlashCards/Collection/Battle/ModalFront";
import { ModalBack } from "../components/Study/FlashCards/Collection/Battle/ModalBack";

import bgBattle from "../assets/Battle/Cenario-noite-desktop.png";
import gatoBattle from "../assets/Battle/Gato-tras-battle.svg";
import monstroBattle from "../assets/Battle/Monstro-quimica-battle.svg";

import "./BattleFlashCards.css";

export function BattleFlashCards() {
    // ====== HP CONTROLADO ======
    const [playerHp, setPlayerHp] = useState(100);
    const [enemyHp, setEnemyHp] = useState(100);

    // mensagem dinâmica do ataque
    const [attackMessage, setAttackMessage] = useState("");

    // quem está levando o ataque no momento: "player" | "enemy" | null
    const [attackedTarget, setAttackedTarget] = useState(null);

    // ====== MODAIS FLUXO ======
    const [step, setStep] = useState("title");
    // title → front → back → attack → next

    const cards = [
        { front: "O que é estequiometria?", back: "Relação entre reagentes e produtos." },
        { front: "O que é mol?", back: "6.02 × 10^23 partículas." },
    ];

    const [index, setIndex] = useState(0);
    const card = cards[index];

    // "poderes" só pra deixar a mensagem mais legal
    const playerPowers = [
        "Raio da Estequiometria",
        "Explosão de Conhecimento",
        "Chama da Sabedoria",
        "Orbe Quântico"
    ];

    const enemyPowers = [
        "Névoa da Confusão",
        "Poção da Dúvida",
        "Explosão de Erros",
        "Ácido da Distração"
    ];

    useEffect(() => {
        if (step === "title") {
            const timer = setTimeout(() => setStep("front"), 1800);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleFlip = () => setStep("back");

    const handleAnswer = (correct) => {
        const damage = 20;

        // escolhe um poder aleatório
        const powers = correct ? playerPowers : enemyPowers;
        const randomPower = powers[Math.floor(Math.random() * powers.length)];

        // define quem está tomando o hit (pra animar o boneco)
        setAttackedTarget(correct ? "enemy" : "player");

        // calcula novos HPs com base na resposta
        const newEnemyHp = correct ? Math.max(enemyHp - damage, 0) : enemyHp;
        const newPlayerHp = correct ? playerHp : Math.max(playerHp - damage, 0);

        setEnemyHp(newEnemyHp);
        setPlayerHp(newPlayerHp);

        if (correct) {
            setAttackMessage(`Você atacou o vilão com ${randomPower}!`);
        } else {
            setAttackMessage(`O vilão te atacou com ${randomPower}!`);
        }

        setStep("attack");

        // deixa mais tempo na tela do poder (2.2s)
        setTimeout(() => {
            // verifica fim de batalha
            if (newEnemyHp <= 0) {
                alert("Você derrotou o vilão! 🏆");
                return;
            }
            if (newPlayerHp <= 0) {
                alert("Você foi derrotado... 💀");
                return;
            }

            // limpa o alvo atacado pra parar a tremida
            setAttackedTarget(null);

            // se ainda tiver cartas, vai pra próxima
            if (index + 1 < cards.length) {
                setIndex((i) => i + 1);
                setStep("front");
            } else {
                alert("Terminou o deck!");
            }
        }, 2200);
    };

    return (
        <div className="blf-page">
            <Sidebar />

            <section className="blf-section">
                <Navbar />

                <div
                    className="blf-content"
                    style={{ backgroundImage: `url(${bgBattle})` }}
                >
                    {/* Título da batalha */}
                    <div className="blf-battle-header">
                        <div className="blf-battle-title">
                            Química - Estequiometria <span className="blf-divider" />
                            <span className="blf-difficulty">Hard</span>
                        </div>
                    </div>

                    {/* ====== A R E N A ====== */}
                    <div className="blf-arena">
                        {/* Player */}
                        <div className="blf-actor blf-player">
                            <div className="blf-hp-wrap blf-hp-left">
                                <div className="blf-hp-rail">
                                    <div
                                        className="blf-hp-green"
                                        style={{ width: `${playerHp}%` }}
                                    />
                                </div>
                                <span className="blf-hp-num">{playerHp}/100</span>
                            </div>

                            <img
                                src={gatoBattle}
                                alt="gato"
                                className={
                                    "blf-sprite blf-sprite-player" +
                                    (attackedTarget === "player" ? " blf-hit" : "")
                                }
                            />
                        </div>

                        {/* Inimigo */}
                        <div className="blf-actor blf-enemy">
                            <div className="blf-hp-wrap blf-hp-right">
                                <div className="blf-hp-rail">
                                    <div
                                        className="blf-hp-green"
                                        style={{ width: `${enemyHp}%` }}
                                    />
                                </div>
                                <span className="blf-hp-num">{enemyHp}/100</span>
                            </div>

                            <img
                                src={monstroBattle}
                                alt="monstro"
                                className={
                                    "blf-sprite blf-sprite-enemy" +
                                    (attackedTarget === "enemy" ? " blf-hit" : "")
                                }
                            />
                        </div>
                    </div>

                    {/* Caixa de ação só no ataque, com animação do texto */}
                    {step === "attack" && (
                        <div className="blf-action-box blf-action-animate">
                            {attackMessage}
                        </div>
                    )}
                </div>
            </section>

            {/* ====== MODAIS ====== */}
            <ModalTitle show={step === "title"} title="Química - Estequiometria" />

            <ModalFront
                show={step === "front"}
                frontText={card.front}
                onFlip={handleFlip}
            />

            <ModalBack
                show={step === "back"}
                backText={card.back}
                onCorrect={() => handleAnswer(true)}
                onWrong={() => handleAnswer(false)}
            />
        </div>
    );
}
