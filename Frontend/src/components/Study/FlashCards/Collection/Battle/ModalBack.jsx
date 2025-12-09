import LLModal from "../../../../General/LLModal";

export function ModalBack({ show, backText, onCorrect, onWrong }) {
    return (
        <LLModal show={show}>
            <p style={{
                fontSize: "1.8rem",
                marginBottom: "2rem"
            }}>
                {backText}
            </p>

            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                <button className="modal-btn correct" onClick={onCorrect}>✔️</button>
                <button className="modal-btn wrong" onClick={onWrong}>❌</button>
            </div>
        </LLModal>
    );
}
