import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Campfire } from "../components/Pomodore/Campfire"; 
import "./StudyPomodore.css";

export function StudyPomodore() {
  const [time, setTime] = useState(25 * 60); // 25 minutos
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  const progress = ((25 * 60 - time) / (25 * 60)) * 100;

  const handleStart = () => setIsRunning(!isRunning);
  const handleReset = (newTime) => {
    setTime(newTime);
    setIsRunning(false);
  };

  return (
    <div className="studyPomodore-page">
      <Sidebar />
      <section className="studyPomodore">
        <Navbar />
        <div className="pomodoretimer-container">
          
          {/* 🕒 Div do Timer */}
          <div className="pomodore-timer">
            <div className="timer-circle">
              <svg className="progress-ring" width="220" height="220">
                <circle
                  className="progress-ring__circle"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="transparent"
                  r="100"
                  cx="110"
                  cy="110"
                  style={{
                    strokeDasharray: 2 * Math.PI * 100,
                    strokeDashoffset: 2 * Math.PI * 100 * (1 - progress / 100),
                    transition: "stroke-dashoffset 0.5s linear",
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="timer-text">
                {minutes}:{seconds}
              </div>

              {/* 🔥 Fogueira animada */}
              <div className="campfire-wrapper">
                <Campfire />
              </div>
            </div>
          </div>

          {/* 🎯 Div dos Botões */}
          <div className="pomodore-buttons">
            <div className="timer-buttons">
              <button onClick={handleStart} className="btn start">
                {isRunning ? "PAUSAR" : "COMEÇAR"}
              </button>
              <button onClick={() => handleReset(5 * 60)} className="btn">
                PAUSA CURTA
              </button>
              <button onClick={() => handleReset(15 * 60)} className="btn">
                PAUSA LONGA
              </button>
              <button className="btn">MISSÕES</button>
              <button className="btn">CONFIGURAÇÕES</button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
