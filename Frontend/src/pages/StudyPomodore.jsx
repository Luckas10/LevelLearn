import { useState, useEffect } from "react";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import { Campfire } from "../components/Study/Pomodore/Campfire";
import { ModalSettings } from "../components/Study/Pomodore/ModalSettings";
import { ModalToDoList } from "../components/Study/Pomodore/ModalToDoList";

import Swal from "sweetalert2";

import "./StudyPomodore.css";

import Sword from "../assets/Pomodore/sword.svg";
import Pomodore from "../assets/Pomodore/pomodore.svg";
import TimerCurto from "../assets/Pomodore/timercurto.svg";
import TimerLongo from "../assets/Pomodore/timerlongo.svg";
import Settings from "../assets/Pomodore/settings.svg";
import Missions from "../assets/Pomodore/missions.svg";

import LightPomodore from "../assets/Pomodore/light-pomodore.svg";
import LightTimerCurto from "../assets/Pomodore/light-timercurto.svg";
import LightTimerLongo from "../assets/Pomodore/light-timerlongo.svg";
import LightSettings from "../assets/Pomodore/light-settings.svg";
import LightMissions from "../assets/Pomodore/light-missions.svg";

const alarmMap = {
  "ALARME 1": "/alarms/alarme1.mp3",
  "ALARME 2": "/alarms/alarme2.mp3",
  "ALARME 3": "/alarms/alarme3.mp3",
  "ALARME 4": "/alarms/alarme4.mp3",
  "ALARME 5": "/alarms/alarme5.mp3",
};

export function StudyPomodore() {
  // =========================
  // THEME: ícones light/dark
  // =========================
  const [theme, setTheme] = useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "dark"
      : "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          const current = root.getAttribute("data-theme") || "dark";
          setTheme(current);
        }
      }
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const isLightTheme = theme === "light";

  const pomodoreIcon = isLightTheme ? LightPomodore : Pomodore;
  const shortIcon = isLightTheme ? LightTimerCurto : TimerCurto;
  const longIcon = isLightTheme ? LightTimerLongo : TimerLongo;
  const settingsIcon = isLightTheme ? LightSettings : Settings;
  const missionsIcon = isLightTheme ? LightMissions : Missions;
  const swordIcon = Sword; // não tem versão light

  // =========================
  // ESTADO DO TIMER
  // =========================
  const [alarmAudio, setAlarmAudio] = useState(null);

  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [mode, setMode] = useState("pomodoro");

  const [showSettings, setShowSettings] = useState(false);
  const [showToDoList, setShowToDoList] = useState(false);

  const [settings, setSettings] = useState({
    pomodoro: 25,
    short: 5,
    long: 15,
    autoLongBreakInterval: 3,
    autoRepeats: 6,
    autoEnabled: false,
    alarmEnabled: true,
    alarmSound: "ALARME 1",
  });

  const [autoActive, setAutoActive] = useState(false);
  const [pomodorosSinceLong, setPomodorosSinceLong] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Carrega config salva
  useEffect(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      setTime(parsed.pomodoro * 60);
      setInitialTime(parsed.pomodoro * 60);
    }
  }, []);

  // Carrega / troca o som de alarme
  useEffect(() => {
    const soundPath = alarmMap[settings.alarmSound];
    if (!soundPath) return;

    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }

    const audio = new Audio(soundPath);
    audio.loop = true;
    audio.load();
    setAlarmAudio(audio);
  }, [settings.alarmSound]);

  const applySettings = (newSettings) => {
    setSettings(newSettings);

    if (mode === "pomodoro") handleReset(newSettings.pomodoro * 60, "pomodoro");
    if (mode === "short") handleReset(newSettings.short * 60, "short");
    if (mode === "long") handleReset(newSettings.long * 60, "long");
  };

  // Loop do timer
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isRunning) {
      handlePeriodEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // Auto-mode
  useEffect(() => {
    if (isRunning && settings.autoEnabled && !autoActive) {
      setAutoActive(true);
      setPomodorosSinceLong(0);
      setCompletedPomodoros(0);
    }
    if (!isRunning && autoActive) {
      setAutoActive(false);
    }
  }, [isRunning, settings.autoEnabled, autoActive]);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  const progress = (time / initialTime) * 100;
  const radius = 200;
  const circumference = 2 * Math.PI * radius;

  const getGradientColors = () => {
    switch (mode) {
      case "short":
        return ["#f97316", "#fb923c"];
      case "long":
        return ["#facc15", "#fde047"];
      default:
        return ["#64b5f6", "#0d5eaf"];
    }
  };

  const [startColor, endColor] = getGradientColors();

  // 🔥 AQUI: estilo dinâmico do texto do timer no modo claro
  const timerTextStyle = isLightTheme
    ? {
        color: startColor,
        textShadow: `0 0 15px ${startColor}80`,
      }
    : {};

  const handleStart = () => {
    if (!isRunning && settings.autoEnabled) {
      setAutoActive(true);
      setPomodorosSinceLong(0);
      setCompletedPomodoros(0);
    }
    setIsRunning((r) => !r);
  };

  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
  };

  const handleReset = (newTime, newMode) => {
    stopAlarm();
    setTime(newTime);
    setInitialTime(newTime);
    setMode(newMode);
    setIsRunning(false);
    setAutoActive(false);
    setPomodorosSinceLong(0);
    setCompletedPomodoros(0);
  };

  const handlePeriodEnd = async () => {
    setIsRunning(false);

    if (settings.alarmEnabled && alarmAudio) {
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(() => {});
    }

    const titles = {
      pomodoro: "Pomodoro finalizado!",
      short: "Pausa curta finalizada!",
      long: "Pausa longa finalizada!",
    };

    const result = await Swal.fire({
      title: titles[mode],
      text: "Clique para continuar.",
      icon: "success",
      confirmButtonText: "Continuar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (result.isConfirmed) {
      stopAlarm();
      proceedNextPeriod();
    }
  };

  const proceedNextPeriod = () => {
    if (!settings.autoEnabled) {
      setMode("pomodoro");
      setTime(settings.pomodoro * 60);
      setInitialTime(settings.pomodoro * 60);
      return;
    }

    if (mode === "pomodoro") {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);

      const newPomodorosSinceLong = pomodorosSinceLong + 1;

      if (newPomodorosSinceLong >= settings.autoLongBreakInterval) {
        setMode("long");
        setTime(settings.long * 60);
        setInitialTime(settings.long * 60);
        setPomodorosSinceLong(0);
      } else {
        setMode("short");
        setTime(settings.short * 60);
        setInitialTime(settings.short * 60);
        setPomodorosSinceLong(newPomodorosSinceLong);
      }

      setIsRunning(true);
      return;
    }

    if (mode === "short" || mode === "long") {
      setMode("pomodoro");
      setTime(settings.pomodoro * 60);
      setInitialTime(settings.pomodoro * 60);
      setIsRunning(true);
    }
  };

  return (
    <div className="studyPomodore-page">
      <Sidebar />

      <div className="studyPomodore-main">
        <Navbar />

        <section className="studyPomodore">
          <div className="pomodoretimer-container">
            <div className="pomodore-timer">
              <div className="timer-circle">
                <svg className="progress-ring" viewBox="0 0 500 500">
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
                      strokeDashoffset:
                        circumference * (1 - progress / 100),
                      transition: "stroke-dashoffset 0.5s linear",
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                      filter: `drop-shadow(0 0 20px ${startColor})`,
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={startColor} />
                      <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="timer-text" style={timerTextStyle}>
                  {minutes}:{seconds}
                </div>

                <div className="campfire-wrapper">
                  <Campfire isActive={isRunning} />
                </div>
              </div>
            </div>

            <div className="pomodore-buttons">
              <div className="timer-buttons">
                <button onClick={handleStart} className="btnPomodore start">
                  <img src={swordIcon} alt="" />
                  {isRunning ? "PAUSAR" : "COMEÇAR"}
                </button>

                <button
                  onClick={() =>
                    handleReset(settings.pomodoro * 60, "pomodoro")
                  }
                  className="btnPomodore pomo"
                >
                  <img src={pomodoreIcon} alt="" />
                  POMODORO
                </button>

                <button
                  onClick={() => handleReset(settings.short * 60, "short")}
                  className="btnPomodore"
                >
                  <img src={shortIcon} alt="" />
                  PAUSA CURTA
                </button>

                <button
                  onClick={() => handleReset(settings.long * 60, "long")}
                  className="btnPomodore"
                >
                  <img src={longIcon} alt="" />
                  PAUSA LONGA
                </button>

                <button
                  className="btnPomodore"
                  onClick={() => setShowToDoList(true)}
                >
                  <img src={missionsIcon} alt="" />
                  TAREFAS
                </button>

                <button
                  className="btnPomodore"
                  onClick={() => setShowSettings(true)}
                >
                  <img src={settingsIcon} alt="" />
                  CONFIGURAÇÕES
                </button>
              </div>
            </div>
          </div>
        </section>

        <ModalSettings
          open={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSave={(newSettings) => {
            applySettings(newSettings);
            setShowSettings(false);

            if (newSettings.autoEnabled && isRunning) {
              setAutoActive(true);
              setPomodorosSinceLong(0);
              setCompletedPomodoros(0);
            } else {
              setAutoActive(false);
            }
          }}
        />

        <ModalToDoList
          open={showToDoList}
          onClose={() => setShowToDoList(false)}
        />
      </div>
    </div>
  );
}

export default StudyPomodore;
