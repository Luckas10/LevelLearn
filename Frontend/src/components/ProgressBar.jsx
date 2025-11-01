import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({ value = 0, size = "md" }) {
  const safeValue = Math.min(100, Math.max(0, value));

  const sizeMap = {
    xxs: "4px",
    xs: "8px",
    sm: "12px",
    md: "20px",
    lg: "28px",
    xl: "40px",
    xxl: "55px",
    mega: "70px",
  };

  // se for número, usa direto; senão pega do mapa
  const height = typeof size === "number" ? `${size}px` : sizeMap[size] || sizeMap.md;

  return (
    <div className="progress-container" style={{ height }}>
      <div
        className="progress-bar"
        style={{
          width: `${safeValue}%`,
        }}
      ></div>
    </div>
  );
}
