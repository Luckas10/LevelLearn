import "./LLModal.css";

export default function LLModal({ show, children }) {
    if (!show) return null;

    return (
        <div className="llm-overlay">
            <div className="llm-modal animate-modal">
                {children}
            </div>
        </div>
    );
}
