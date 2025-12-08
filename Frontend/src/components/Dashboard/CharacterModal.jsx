export default function CharacterModal({
    open,
    current,
    selected,
    characters,
    onSelect,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div
            className="character-modal-backdrop"
            role="dialog"
            aria-modal="true"
        >
            <div className="character-modal">
                <header className="character-modal-header">
                    <span className="character-modal-title">PERSONAGEM ATUAL</span>

                    <button
                        className="character-modal-close"
                        aria-label="Fechar"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <div className="character-modal-current">
                    <img
                        src={current}
                        alt="Personagem atual"
                        className="character-modal-current-img"
                    />
                </div>

                <div className="character-modal-grid-wrapper">
                    <div className="character-modal-grid">
                        {characters.map((ch) => {
                            const isSelected = selected && selected.id === ch.id;

                            // 0.6 ≈ 0x99 de alpha, então "#RRGGBB99"
                            const glowHexWithAlpha = ch.glow ? `${ch.glow}99` : "#ffffff99";

                            return (
                                <button
                                    key={ch.id}
                                    type="button"
                                    className={
                                        "character-option" +
                                        (isSelected ? " character-option--selected" : "")
                                    }
                                    onClick={() => onSelect(ch)}
                                    style={
                                        isSelected
                                            ? { filter: `drop-shadow(0 0 20px ${glowHexWithAlpha})` }
                                            : undefined
                                    }
                                >
                                    <img
                                        src={ch.img}
                                        alt={ch.name}
                                        className="character-option-img"
                                    />
                                </button>
                            );
                        })}

                    </div>
                </div>

                <footer className="character-modal-footer">
                    <button
                        type="button"
                        className="character-modal-primary-btn"
                        onClick={onConfirm}
                    >
                        Personalizar
                    </button>
                </footer>
            </div>
        </div>
    );
}
