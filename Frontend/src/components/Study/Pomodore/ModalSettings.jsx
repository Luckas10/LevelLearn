import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import "./ModalSettings.css";

const alarmMap = {
  "ALARME 1": "/alarms/alarme1.mp3",
  "ALARME 2": "/alarms/alarme2.mp3",
  "ALARME 3": "/alarms/alarme3.mp3",
  "ALARME 4": "/alarms/alarme4.mp3",
  "ALARME 5": "/alarms/alarme5.mp3",
};

export function ModalSettings({ open, onClose, settings, onSave }) {
  const dialogRef = useRef(null);
  const audioRef = useRef(null);
  const [localSettings, setLocalSettings] = useState(settings);
  const [testAudio, setTestAudio] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      setLocalSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (open) {
      setLocalSettings((prev) => prev || settings);
    }
  }, [open, settings]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      dialog.classList.add("showing");

      requestAnimationFrame(() => {
        dialog.classList.add("visible");
      });

      const handleClickOutside = (event) => {
        const rect = dialog.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          handleCloseWithoutSaving();
        }
      };

      dialog.addEventListener("click", handleClickOutside);
      return () =>
        dialog.removeEventListener("click", handleClickOutside);
    } else {
      if (dialog.open) {
        dialog.classList.remove("visible");
        setTimeout(() => {
          dialog.classList.remove("showing");
          dialog.close();
        }, 200);
      }
    }
  }, [open]);

  useEffect(() => {
    const path = alarmMap[localSettings.alarmSound];
    if (!path) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(path);
    audio.load();

    audioRef.current = audio;
    setTestAudio(audio);
  }, [localSettings.alarmSound]);

  const handleCloseWithoutSaving = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  const handleSave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const sanitized = {
      ...localSettings,
      pomodoro: Number(localSettings.pomodoro) || 1,
      short: Number(localSettings.short) || 1,
      long: Number(localSettings.long) || 1,
      autoLongBreakInterval:
        Number(localSettings.autoLongBreakInterval) || 1,
      autoRepeats: Number(localSettings.autoRepeats) || 1,
    };

    onSave(sanitized);
    localStorage.setItem("pomodoroSettings", JSON.stringify(sanitized));
    onClose();
  };

  const updateField = (field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field) => (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    updateField(field, digitsOnly === "" ? "" : Number(digitsOnly));
  };

  const handlePasteAsDigits = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");

    if (!/^\d+$/.test(paste)) {
      e.preventDefault();
    }
  };

  const preventDecimalKeys = (e) => {
    if (e.key === "." || e.key === "," || e.key === "e") {
      e.preventDefault();
    }
  };

  const handleTestAlarm = () => {
    if (!localSettings.alarmEnabled) {
      alert("Habilite o alarme para testar.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch(() => {
        console.warn("Autoplay bloqueado pelo navegador.");
      });
    }
  };

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="settings-dialog"
      onCancel={handleCloseWithoutSaving}
    >
      <button className="close-x" onClick={handleCloseWithoutSaving}>
        <FontAwesomeIcon size="sm" icon={faX} />
      </button>

      <h2 className="modal-title">CONFIGURAÇÕES</h2>

      <p className="section-title">DURAÇÃO (EM MINUTOS)</p>

      <div className="duration-grid">
        <div className="duration-block">
          <label>FOCO</label>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={localSettings.pomodoro}
            onChange={handleNumberChange("pomodoro")}
            onKeyDown={preventDecimalKeys}
            onPaste={handlePasteAsDigits}
          />
        </div>

        <div className="duration-block">
          <label>PAUSA CURTA</label>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={localSettings.short}
            onChange={handleNumberChange("short")}
            onKeyDown={preventDecimalKeys}
            onPaste={handlePasteAsDigits}
          />
        </div>

        <div className="duration-block">
          <label>PAUSA LONGA</label>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={localSettings.long}
            onChange={handleNumberChange("long")}
            onKeyDown={preventDecimalKeys}
            onPaste={handlePasteAsDigits}
          />
        </div>
      </div>

      <p className="section-title">POMODORO AUTOMÁTICO</p>

      <div className="auto-container">
        <span>Intervalo para pausa longa</span>
        <input
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={localSettings.autoLongBreakInterval}
          onChange={handleNumberChange("autoLongBreakInterval")}
          onKeyDown={preventDecimalKeys}
          onPaste={handlePasteAsDigits}
        />
      </div>

      <div className="auto-container">
        <span>Repetições</span>
        <input
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={localSettings.autoRepeats}
          onChange={handleNumberChange("autoRepeats")}
          onKeyDown={preventDecimalKeys}
          onPaste={handlePasteAsDigits}
        />
      </div>

      <label className="switch-row">
        Habilitar automático
        <label className="switch">
          <input
            type="checkbox"
            checked={localSettings.autoEnabled}
            onChange={(e) =>
              updateField("autoEnabled", e.target.checked)
            }
          />
          <span className="slider"></span>
        </label>
      </label>

      <hr className="divider" />

      <p className="section-title">ALARME</p>

      <label className="switch-row">
        Permitir alarme
        <label className="switch">
          <input
            type="checkbox"
            checked={localSettings.alarmEnabled}
            onChange={(e) =>
              updateField("alarmEnabled", e.target.checked)
            }
          />
          <span className="slider"></span>
        </label>
      </label>

      <label>Escolha seu alarme</label>
      <div className="select-container">
        
        <select
          value={localSettings.alarmSound}
          onChange={(e) =>
            updateField("alarmSound", e.target.value)
          }
        >
          <option>ALARME 1</option>
          <option>ALARME 2</option>
          <option>ALARME 3</option>
          <option>ALARME 4</option>
          <option>ALARME 5</option>
        </select>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="button"
            className="test-alarm-btn"
            onClick={handleTestAlarm}
          >
            <FontAwesomeIcon icon={faPlay} /> Testar Alarme
          </button>

          <button
            type="button"
            className="stop-alarm-btn"
            onClick={handleStopAlarm}
          >
            <FontAwesomeIcon icon={faStop} /> Parar
          </button>
        </div>
      </div>

      <button className="close-btn" onClick={handleSave}>
        Salvar
      </button>
    </dialog>
  );
}
