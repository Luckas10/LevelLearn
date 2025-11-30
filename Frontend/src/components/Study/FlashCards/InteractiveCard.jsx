import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function InteractiveCard({ className = "", to, image, children, ...props }) {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 25;
    const rotateY = ((x - centerX) / centerX) * 25;

    // posição do highlight
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
    <NavLink style={{textDecoration: "none"}} to={to}>
      <div
        className={`interactiveCardBase ${className}`} {...props}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Se imagem existir, mostra ela */}
        {image && <img src={image} className="cardImg" />}

        {/* Se tiver children, mostra dentro do card */}
        {children}
      </div>
    </NavLink>
  );
}
