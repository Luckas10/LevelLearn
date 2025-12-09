// BattleCardModal.jsx
import { useState, useEffect } from "react";
import "../../../../../pages/BattleFlashCards.css";

export function BattleCardModal({ show, frontText, backText, onAnswer }) {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (show) {
            setIsFlipped(false);
        }
    }, [show]);

    if (!show) return null;

    const toggleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div className="blf-card-overlay">
            {/* CARTA */}
            <div className="battle-card battle-card-appear" onClick={toggleFlip}>
                <div className={`battle-card-inner ${isFlipped ? "flipped" : ""}`}>
                    <div className="battle-card-front">
                        <p className="battle-card-text">
                            {frontText}
                        </p>
                        <span className="battle-card-hint-inside">
                            Clique para virar
                        </span>
                    </div>

                    <div className="battle-card-back">
                        <p className="battle-card-text">
                            {backText}
                        </p>
                    </div>
                </div>
            </div>

            {/* AÇÕES */}
            <div className="blf-card-actions">
                <p className="blf-card-question">Você acertou?</p>

                <div className="blf-card-buttons">
                    <button
                        className="modal-btn correct"
                        onClick={() => onAnswer(true)}
                    >
                        ✔️
                    </button>
                    <button
                        className="modal-btn wrong"
                        onClick={() => onAnswer(false)}
                    >
                        ❌
                    </button>
                </div>
            </div>
        </div>
    );
}
