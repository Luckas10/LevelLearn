// BattleFlashCards.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendSessionResult } from "../services/flashcards";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { ModalTitle } from "../components/Study/FlashCards/Collection/Battle/ModalTitle";
import { BattleCardModal } from "../components/Study/FlashCards/Collection/Battle/BattleCardModal";

import bgBattle from "../assets/Battle/Cenario-noite-desktop.png";
import gatoBattle from "../assets/Battle/Gato-tras-battle.svg";
import monstroBattle from "../assets/Battle/Monstro-quimica-battle.svg";

import "./BattleFlashCards.css";

import { getCardsByDeckId } from "../services/cards";
import { getDeckById } from "../services/deck";

export function BattleFlashCards() {
    const { id } = useParams();
    const navigate = useNavigate();

    // ====== HP CONTROLADO ======
    const [playerHp, setPlayerHp] = useState(100);
    const [enemyHp, setEnemyHp] = useState(100);

    // mensagem dinâmica do ataque
    const [attackMessage, setAttackMessage] = useState("");

    // quem está levando o ataque no momento: "player" | "enemy" | null
    const [attackedTarget, setAttackedTarget] = useState(null);

    // ====== MODAIS FLUXO ======
    const [step, setStep] = useState("title"); // title → front → back → attack

    // ====== CARTAS REAIS DO DECK ======
    const [cards, setCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [loadingCards, setLoadingCards] = useState(true);
    const [cardsError, setCardsError] = useState(null);

    // ====== INFO DO DECK ======
    const [deck, setDeck] = useState(null);
    const [loadingDeck, setLoadingDeck] = useState(true);

    // ====== ESTATÍSTICAS DA BATALHA ======
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [battleStart, setBattleStart] = useState(null);

    // ====== MODAL DE RESULTADO ======
    const [showResultModal, setShowResultModal] = useState(false);
    const [result, setResult] = useState(null);
    const resultDialogRef = useRef(null);

    const card = cards[index] || null;

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

    // helper pra formatar tempo mm:ss
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const mm = String(minutes).padStart(2, "0");
        const ss = String(seconds).padStart(2, "0");
        return `${mm}:${ss}`;
    };

    const handleResultClose = () => {
        if (!result) return;

        if (result.outcome === "win") {
            handleBackToCollection();
        } else {
            handleRetry();
        }
    };


    useEffect(() => {
        const dialog = resultDialogRef.current;
        if (!dialog) return;

        if (showResultModal) {
            dialog.showModal();
            dialog.classList.add("showing");

            requestAnimationFrame(() => {
                dialog.classList.add("visible");
            });
        } else {
            if (dialog.open) {
                dialog.classList.remove("visible");
                setTimeout(() => {
                    dialog.classList.remove("showing");
                    dialog.close();
                }, 200);
            }
        }
    }, [showResultModal]);


    // carrega as cartas do deck selecionado
    useEffect(() => {
        async function loadCards() {
            try {
                setLoadingCards(true);
                setCardsError(null);

                const data = await getCardsByDeckId(id);
                setCards(data || []);
                setIndex(0);
                setStep("title");
                setCorrectCount(0);
                setWrongCount(0);
                setPlayerHp(100);
                setEnemyHp(100);
                setBattleStart(Date.now());
                setShowResultModal(false);
                setResult(null);
            } catch (err) {
                console.error("Erro ao carregar cartas do deck:", err);
                setCardsError("Não foi possível carregar as cartas deste deck.");
            } finally {
                setLoadingCards(false);
            }
        }

        if (id) {
            loadCards();
        }
    }, [id]);

    // carrega os dados do deck (nome, descrição, etc.)
    useEffect(() => {
        async function loadDeck() {
            try {
                setLoadingDeck(true);
                const data = await getDeckById(id);
                setDeck(data);
            } catch (err) {
                console.error("Erro ao carregar deck:", err);
            } finally {
                setLoadingDeck(false);
            }
        }

        if (id) {
            loadDeck();
        }
    }, [id]);

    // animação inicial do título
    useEffect(() => {
        if (step === "title") {
            const timer = setTimeout(() => setStep("front"), 1800);
            return () => clearTimeout(timer);
        }
    }, [step]);


    const handleAnswer = (correct) => {
        if (!card || showResultModal) return;

        const totalCards = cards.length || 1;

        // dano arredondado em inteiros
        const enemyDamage = Math.ceil(100 / totalCards);

        const allowedErrors = Math.max(1, Math.floor(totalCards / 3));
        const playerDamage = Math.ceil(100 / (allowedErrors + 1));

        // atualiza contadores locais e depois estado
        let nextCorrect = correctCount;
        let nextWrong = wrongCount;
        if (correct) nextCorrect += 1;
        else nextWrong += 1;

        setCorrectCount(nextCorrect);
        setWrongCount(nextWrong);

        const powers = correct ? playerPowers : enemyPowers;
        const randomPower = powers[Math.floor(Math.random() * powers.length)];

        setAttackedTarget(correct ? "enemy" : "player");

        let newEnemyHp = enemyHp;
        let newPlayerHp = playerHp;

        const isLastCard = index === totalCards - 1;

        if (correct) {
            newEnemyHp = enemyHp - enemyDamage;

            // vilão só "morre" de fato na última carta
            if (!isLastCard && newEnemyHp <= 0) {
                newEnemyHp = 5;
            }
        } else {
            newPlayerHp = playerHp - playerDamage;
        }

        newEnemyHp = Math.max(Math.round(newEnemyHp), 0);
        newPlayerHp = Math.max(Math.round(newPlayerHp), 0);

        setEnemyHp(newEnemyHp);
        setPlayerHp(newPlayerHp);

        if (correct) {
            setAttackMessage(`Você atacou o vilão com ${randomPower}!`);
        } else {
            setAttackMessage(`O vilão te atacou com ${randomPower}!`);
        }

        setStep("attack");

        const finishBattle = async (outcome) => {
            const timeMs = battleStart ? Date.now() - battleStart : 0;

            // calcula tempo em minutos com casa decimal (ex.: 0.09)
            const elapsed_minutes = Number((timeMs / 60000).toFixed(2));
            const total = cards.length || 0;
            const deck_id = deck?.id ?? Number(id);

            // valores que vamos mostrar no modal
            let xpGain = 0;
            let coinsGain = 0;
            let level = null;
            let xpTotal = null;
            let coinsTotal = null;
            let streak = null;
            let bestStreak = null;

            // chama a API se tiver deck_id
            if (deck_id) {
                try {
                    const resp = await sendSessionResult({
                        deck_id,
                        correct: nextCorrect,
                        total,
                        elapsed_minutes,
                    });

                    // resp vem exatamente assim:
                    // {
                    //   "xp_gain": 30,
                    //   "coins_gain": 24,
                    //   "xp_total": 110,
                    //   "coins_total": 91,
                    //   "level": 2,
                    //   "study_time": 0.09,
                    //   "streak": 1,
                    //   "best_streak": 1
                    // }

                    xpGain = resp.xp_gain ?? 0;
                    coinsGain = resp.coins_gain ?? 0;
                    level = resp.level ?? null;
                    xpTotal = resp.xp_total ?? null;
                    coinsTotal = resp.coins_total ?? null;
                    streak = resp.streak ?? null;
                    bestStreak = resp.best_streak ?? null;
                } catch (err) {
                    console.error(
                        "Erro ao enviar resultado da sessão de flashcards:",
                        err
                    );
                    // se quiser, dá pra manter um fallback local aqui:
                    // xpGain = nextCorrect * 10;
                    // coinsGain = nextCorrect * 5;
                }
            }

            // monta o objeto de resultado usando SEMPRE
            // o que veio do backend (ou 0 / fallback)
            if (outcome === "win") {
                setResult({
                    outcome: "win",
                    timeMs,
                    correct: nextCorrect,
                    wrong: nextWrong,
                    xp: xpGain,
                    coins: coinsGain,
                    level,
                    xpTotal,
                    coinsTotal,
                    streak,
                    bestStreak,
                    elapsed_minutes,
                });
            } else {
                setResult({
                    outcome: "lose",
                    timeMs,
                    correct: nextCorrect,
                    wrong: nextWrong,
                    xp: xpGain,        // se perdeu, provavelmente 0 – mas vem do backend
                    coins: coinsGain,
                    level,
                    xpTotal,
                    coinsTotal,
                    streak,
                    bestStreak,
                    elapsed_minutes,
                });
            }

            setShowResultModal(true);
        };



        setTimeout(() => {
            // derrota imediata se o player morrer
            if (newPlayerHp <= 0) {
                finishBattle("lose");
                return;
            }

            // última carta: decide vitória/derrota
            if (isLastCard) {
                if (newEnemyHp <= 0) {
                    finishBattle("win");
                } else {
                    finishBattle("lose");
                }
                return;
            }

            // segue a batalha
            setAttackedTarget(null);

            if (index + 1 < totalCards) {
                setIndex((i) => i + 1);
                setStep("front");
            } else {
                // fallback teórico
                finishBattle("lose");
            }
        }, 2200);
    };

    const battleTitle = deck?.name || "Batalha de Flashcards";

    const handleRetry = () => {
        setPlayerHp(100);
        setEnemyHp(100);
        setIndex(0);
        setStep("title");
        setAttackMessage("");
        setAttackedTarget(null);
        setCorrectCount(0);
        setWrongCount(0);
        setBattleStart(Date.now());
        setShowResultModal(false);
        setResult(null);
    };

    const handleBackToCollection = () => {
        // volta pra tela anterior (que provavelmente é a CollectionSelected)
        navigate(-1);
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
                    {/* Título da batalha usando o nome do deck */}
                    <div className="blf-battle-header">
                        <div className="blf-battle-title">
                            {loadingDeck ? "Carregando deck..." : battleTitle}
                        </div>
                    </div>

                    {/* Mensagens de loading/erro de cartas */}
                    {loadingCards && (
                        <div className="blf-loading-cards">
                            Carregando cartas do deck...
                        </div>
                    )}

                    {cardsError && !loadingCards && (
                        <div className="blf-error-cards">
                            {cardsError}
                        </div>
                    )}

                    {!loadingCards && cards.length === 0 && !cardsError && (
                        <div className="blf-empty-cards">
                            Este deck ainda não tem cartas para batalhar. 😢
                        </div>
                    )}

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

                    {step === "attack" && (
                        <div className="blf-action-box blf-action-animate">
                            {attackMessage}
                        </div>
                    )}
                </div>
            </section>

            {/* ====== MODAIS ====== */}
            <ModalTitle
                show={step === "title" && cards.length > 0 && !showResultModal}
                title={battleTitle}
            />

            <BattleCardModal
                show={step === "front" && !!card && !showResultModal}
                frontText={card ? card.question : ""}
                backText={card ? card.answer : ""}
                onAnswer={handleAnswer}
            />

            {/* ====== MODAL DE RESULTADO ====== */}
            {result && (
                <dialog
                    ref={resultDialogRef}
                    className="settings-dialog battle-result-dialog"
                    onCancel={handleResultClose}
                >
                    <button className="close-x" onClick={handleResultClose}>
                        <FontAwesomeIcon size="sm" icon={faX} />
                    </button>

                    {result.outcome === "win" ? (
                        <>
                            <h2 className="modal-title">VITÓRIA! 🏆</h2>
                            <p className="blf-result-text">
                                Você derrotou o vilão estudando o deck{" "}
                                <strong>{battleTitle}</strong>.
                            </p>

                            <ul className="blf-result-stats">
                                <li>
                                    Tempo de batalha: <strong>{formatTime(result.timeMs)}</strong>
                                </li>
                                <li>
                                    Questões acertadas: <strong>{result.correct}</strong>
                                </li>
                                <li>
                                    Questões erradas: <strong>{result.wrong}</strong>
                                </li>
                                <li>
                                    XP recebido: <strong>{result.xp}</strong>
                                </li>
                                <li>
                                    Moedas recebidas: <strong>{result.coins}</strong>
                                </li>

                                {result.level && (
                                    <li>
                                        Nível atual: <strong>{result.level}</strong>
                                    </li>
                                )}

                                {result.xpTotal != null && (
                                    <li>
                                        XP total: <strong>{result.xpTotal}</strong>
                                    </li>
                                )}

                                {result.coinsTotal != null && (
                                    <li>
                                        Moedas totais: <strong>{result.coinsTotal}</strong>
                                    </li>
                                )}

                                {result.streak != null && (
                                    <li>
                                        Dias seguidos: <strong>{result.streak}</strong>
                                        {result.bestStreak != null && (
                                            <> (recorde: <strong>{result.bestStreak}</strong>)</>
                                        )}
                                    </li>
                                )}
                            </ul>


                            <div className="blf-result-actions">
                                <button
                                    className="close-btn"
                                    onClick={handleRetry}
                                >
                                    Praticar mais uma vez
                                </button>

                                <button
                                    className="close-btn"
                                    onClick={handleBackToCollection}
                                >
                                    Sair para a coleção
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="modal-title">DERROTA... 💀</h2>
                            <p className="blf-result-text">
                                Você não conseguiu causar dano suficiente ao vilão em{" "}
                                <strong>{battleTitle}</strong>.
                            </p>

                            <ul className="blf-result-stats">
                                <li>
                                    Tempo de batalha:{" "}
                                    <strong>{formatTime(result.timeMs)}</strong>
                                </li>
                                <li>
                                    Questões acertadas:{" "}
                                    <strong>{result.correct}</strong>
                                </li>
                                <li>
                                    Questões erradas:{" "}
                                    <strong>{result.wrong}</strong>
                                </li>
                            </ul>

                            <div className="blf-result-actions">
                                <button
                                    className="close-btn"
                                    onClick={handleRetry}
                                >
                                    Praticar mais uma vez
                                </button>

                                <button
                                    className="close-btn"
                                    onClick={handleBackToCollection}
                                >
                                    Sair para a coleção
                                </button>
                            </div>
                        </>
                    )}
                </dialog>
            )}

        </div>
    );
}
