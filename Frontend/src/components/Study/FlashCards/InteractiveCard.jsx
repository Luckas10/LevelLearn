import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function InteractiveCard({ 
  title, 
  className = "", 
  to, 
  image, 
  children, 
  onEdit,
  onDelete,
  ...props 
}) {

  const [style, setStyle] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div style={{ position: "relative" }}>
      <NavLink style={{ textDecoration: "none" }} to={to}>
        <div
          className={`interactiveCardBase ${className}`}
          {...props}
          style={style}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Botão dos 3 pontinhos */}
          <button
            className="cardMenuBtn"
            onClick={(e) => {
              e.preventDefault(); 
              setMenuOpen(!menuOpen);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          {/* Conteúdo do card */}
          {image && (
            <div className="cardContent">
              <img src={image} className="cardImg" />
              <div className="cardContentTitle">
                <h1>{title}</h1>
                <h2>Biologia</h2>
              </div>
            </div>
          )}

          {children}
        </div>
      </NavLink>

      {/* MENU (Editar / Excluir) */}
      {menuOpen && (
        <div className="cardMenuOptions">
          <button onClick={() => onEdit?.()}>
            <FontAwesomeIcon icon={faPen} /> Editar
          </button>

          <button onClick={() => onDelete?.()}>
            <FontAwesomeIcon icon={faTrash} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
