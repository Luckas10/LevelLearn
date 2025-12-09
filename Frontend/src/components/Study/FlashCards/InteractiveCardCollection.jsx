import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function InteractiveCardCollection({
  id,
  title,
  to,
  image,
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
          {...props}
          style={style}
          onMouseMove={menuOpen ? undefined : handleMouseMove}
          onMouseLeave={menuOpen ? undefined : handleMouseLeave}
        >
          <button
            className="cardMenuBtn"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);

              if (!menuOpen) {
                setStyle({ transform: "none" });
              }
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          <div className="cardContent">
            <img src={image} className="cardImg" />
            <div className="cardContentTitle">
              <h1>{title}</h1>
            </div>
          </div>
        </div>
      </NavLink>

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
