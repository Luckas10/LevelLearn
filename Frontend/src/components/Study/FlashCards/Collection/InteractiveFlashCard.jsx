import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function InteractiveFlashCard({
  id,
  card,
  onEdit,
  onDelete,
  readOnly = false,
  children,
  ...props
}) {


  const { className: parentClassName = "", style: parentStyle = {}, ...restProps } = props;

  const [frontBg, setFrontBg] = useState("#151838");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // refs separados
  const menuButtonRef = useRef(null);
  const menuOptionsRef = useRef(null);

  // fechar ao clicar fora (agora totalmente certo)
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target) &&

        menuOptionsRef.current &&
        !menuOptionsRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMouseMove = (e) => {
    if (menuOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setFrontBg(
      `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(60, 51, 185, 0.4), rgba(21,24,56,1) 70%)`
    );
  };

  const handleMouseLeave = () => {
    if (menuOpen) return;
    setFrontBg("#151838");
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const combinedClassName = `${parentClassName} interactive-card interactive-card-appear`.trim();

  return (
    <div style={{ position: "relative" }}>
      <div
        {...restProps}
        className={combinedClassName}
        style={parentStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {!readOnly && (
          <button
            className="cardMenuBtn"
            ref={menuButtonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        )}

        {/* Card 3D */}
        <div
          className={`interactive-card-inner ${isFlipped ? "flipped" : ""}`}
          onClick={handleFlipCard}
        >
          {/* Frente */}
          <div
            className="interactive-card-face interactive-card-front"
            style={{ background: frontBg }}
          >
            <p style={{ fontSize: "1.1rem", padding: "1rem", wordBreak: "break-word" }}>
              {card.question}
            </p>
            <p style={{ fontSize: "0.9rem" }}>Clique para ver o verso</p>
          </div>

          {/* Verso */}
          <div className="interactive-card-face interactive-card-back">
            <p style={{ fontSize: "1.1rem", padding: "1rem", wordBreak: "break-word" }}>
              {card.answer}
            </p>
            <p style={{ fontSize: "0.9rem" }}>Clique para ver a frente</p>
          </div>
        </div>
      </div>

      {!readOnly && menuOpen && (
        <div className="cardMenuOptions" ref={menuOptionsRef}>
          <button onClick={() => onEdit(id)}>
            <FontAwesomeIcon icon={faPen} /> Editar
          </button>
          <button onClick={() => onDelete(id)}>
            <FontAwesomeIcon icon={faTrash} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
