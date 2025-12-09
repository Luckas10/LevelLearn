import LLModal from "../../../../General/LLModal";

export function ModalTitle({ show, title }) {
    return (
        <LLModal show={show}>
            <h1 style={{
                fontSize: "2.2rem",
                fontWeight: "700",
                marginBottom: "0.5rem"
            }}>
                {title}
            </h1>
        </LLModal>
    );
}
