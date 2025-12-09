import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { getCardsByDeckId } from "../../../../services/cards";

export default function InteractiveFlashCard({
  id,
  card,
  onEdit,
  onDelete,
  children,
  ...props
}) {
  const [style, setStyle] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);


  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 25;
    const rotateY = ((x - centerX) / centerX) * 25;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setStyle({
      transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: "transform 0.1s ease",
      background: `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(60, 51, 185, 0.4), rgba(21,24,56,1) 70%)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.3s ease",
      background: "#151838"
    });
  };
  
  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };
  

  return (
    <div style={{ position: "relative" }}>
      <div
        {...props}
        style={style}
        onClick={handleFlipCard}
        onMouseMove={menuOpen ? undefined : handleMouseMove}
        onMouseLeave={menuOpen ? undefined : handleMouseLeave}
      >
        <button
          className="cardMenuBtn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>

        {/* Aqui alternamos entre question / answer */}
        {!isFlipped ? (
          <>
            <p style={{
              fontSize: "1.1rem",
              padding: "1rem",
              wordBreak: "break-word",
              overflow: "hidden",
            }}>
              {card.question}
            </p>
            <p style={{ fontSize: "0.9rem" }}>Clique para ver o verso</p>
          </>
        ) : (
          <>
            <p style={{
              fontSize: "1.1rem",
              padding: "1rem",
              wordBreak: "break-word"
            }}>
              {card.answer}
            </p>
            <p style={{ fontSize: "0.9rem" }}>Clique para ver a frente</p>
          </>
        )}
      </div>

      {menuOpen && (
        <div className="cardMenuOptions">
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