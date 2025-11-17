import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Campfire } from "../components/StudyPomodore/Campfire";
import { ModalSettings } from "../components/StudyPomodore/ModalSettings";

import "./StudyPomodore.css";

// Imagens dos botões
import Sword from "../assets/Pomodore/sword.svg";
import Pomodore from "../assets/Pomodore/pomodore.svg";
import TimerCurto from "../assets/Pomodore/timercurto.svg";
import TimerLongo from "../assets/Pomodore/timerlongo.svg";
import Settings from "../assets/Pomodore/settings.svg";
import Missions from "../assets/Pomodore/missions.svg";

export function StudyPomodore() {
  const [time, setTime] = useState(25 * 60); // tempo atual em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [mode, setMode] = useState("pomodoro"); // "pomodoro" | "short" | "long"

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      if (mode === "short" || mode === "long") {
        setMode("pomodoro");
        setTime(25 * 60);
        setInitialTime(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, mode]);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  // progresso começa cheio e vai até 0
  const progress = (time / initialTime) * 100;
  const radius = 200;
  const circumference = 2 * Math.PI * radius;

  // 🎨 Gradiente de acordo com o modo
  const getGradientColors = () => {
    switch (mode) {
      case "short":
        return ["#f97316", "#fb923c"]; // laranja
      case "long":
        return ["#facc15", "#fde047"]; // amarelo
      default:
        return ["#4f46e5", "#8b5cf6"]; // roxo padrão (pomodoro)
    }
  };

  const [startColor, endColor] = getGradientColors();

  const handleStart = () => setIsRunning(!isRunning);

  const handleReset = (newTime, newMode) => {
    setTime(newTime);
    setInitialTime(newTime);
    setMode(newMode);
    setIsRunning(false);
  };

  return (
    <div className="studyPomodore-page">
      <Sidebar />
      <section className="studyPomodore">

        <Navbar />
        <div className="pomodoretimer-container">
          
          {/* Timer */}
          <div className="pomodore-timer">
            <div className="timer-circle">
              <svg className="progress-ring" width="500" height="500">
                <circle
                  className="progress-ring__circle"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="transparent"
                  r={radius}
                  cx="250"
                  cy="250"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference * (1 - progress / 100),
                    transition: "stroke-dashoffset 0.5s linear",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={startColor} />
                    <stop offset="100%" stopColor={endColor} />
                  </linearGradient>
                </defs>
              </svg>

              <div className="timer-text">
                {minutes}:{seconds}
              </div>

              {/* Fogueira */}
              <div className="campfire-wrapper">
                <Campfire />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="pomodore-buttons">
            <div className="timer-buttons">
              <button onClick={handleStart} className="btnPomodore start">
                <img src={Sword} alt="" />
                {isRunning ? "PAUSAR" : "COMEÇAR"}
              </button>
              <button onClick={() => handleReset(25 * 60, "pomodoro")}
                className="btnPomodore pomo">
                <img src={Pomodore} alt="" />
                POMODORO
              </button>

              <button onClick={() => handleReset(5 * 60, "short")}
                className="btnPomodore">
                <img src={TimerCurto} alt="" />
                PAUSA CURTA
              </button>

              <button onClick={() => handleReset(15 * 60, "long")}
                className="btnPomodore">
                <img src={TimerLongo} alt="" />
                PAUSA LONGA
              </button>

              <button className="btnPomodore">
                <img src={Missions} alt="" />
                MISSÕES
              </button>

              <button className="btnPomodore" onClick={() => setShowSettings(true)}>
                <img src={Settings} alt="" />
                CONFIGURAÇÕES
              </button>

            </div>
          </div>
        </div>

        <ModalSettings open={showSettings} onClose={() => setShowSettings(false)} />
      </section>
    </div>
  );
}
