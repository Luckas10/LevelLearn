import { useState } from "react";

export default function InteractiveCard({image}) {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // posição do mouse na div
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 20; // inclinação vertical
    const rotateY = ((x - centerX) / centerX) * 20; // inclinação horizontal

    setStyle({
        transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
        transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
        transform: "rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.3s ease",
    });
  };

  return (
    <div
      className="collectionContainer"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
        <img src={image} className="cardImg"/>
    </div>
  );
}