import LLModal from "../../../../General/LLModal";

export function ModalFront({ show, frontText, onFlip }) {
    return (
        <LLModal show={show}>
            <p style={{
                fontSize: "1.8rem",
                marginBottom: "2rem"
            }}>
                {frontText}
            </p>

            <button 
                className="modal-btn"
                onClick={onFlip}
            >
                CLIQUE PARA VER O VERSO
            </button>
        </LLModal>
    );
}
