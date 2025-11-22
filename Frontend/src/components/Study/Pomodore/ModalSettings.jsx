import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPencil } from "@fortawesome/free-solid-svg-icons";
import "./ModalSettings.css";

export function ModalSettings({ open, onClose, settings, onSave }) {
  const dialogRef = useRef(null);

  // estados locais (edição antes de salvar)
  const [localSettings, setLocalSettings] = useState(settings);

  // 🔥 Carregar configurações salvas no localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      setLocalSettings(JSON.parse(saved));
    }
  }, []);

  // sincroniza ao abrir
  useEffect(() => {
    if (open) setLocalSettings((prev) => {
      // se o estado atual já foi carregado do localStorage, ele prevalece
      return prev || settings;
    });
  }, [open, settings]);

  // abrir/fechar modal com animação
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      dialog.classList.add("showing");

      requestAnimationFrame(() => {
        dialog.classList.add("visible");
      });

      // clicar fora do modal fecha sem salvar
      const handleClickOutside = (event) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
          event.clientX < dialogDimensions.left ||
          event.clientX > dialogDimensions.right ||
          event.clientY < dialogDimensions.top ||
          event.clientY > dialogDimensions.bottom
        ) {
          handleCloseWithoutSaving();
        }
      };

      dialog.addEventListener("click", handleClickOutside);

      return () => dialog.removeEventListener("click", handleClickOutside);

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

  const handleCloseWithoutSaving = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(localSettings);

    // 🔥 SALVAR EM LOCALSTORAGE
    localStorage.setItem("pomodoroSettings", JSON.stringify(localSettings));

    onClose();
  };

  const updateField = (field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <dialog ref={dialogRef} className="settings-dialog" onCancel={handleCloseWithoutSaving}>
      
      {/* Botão X */}
      <button className="close-x" onClick={handleCloseWithoutSaving}>
        <FontAwesomeIcon size="sm" icon={faX} />
      </button>

      <h2 className="modal-title">CONFIGURAÇÕES</h2>

      {/* DURAÇÃO */}
      <p className="section-title">DURAÇÃO (EM MINUTOS)</p>

      <div className="duration-grid">
        <div className="duration-block">
          <label>FOCO</label>
          <input
            type="number"
            min="1"
            value={localSettings.pomodoro}
            onChange={(e) => updateField("pomodoro", Number(e.target.value))}
          />
        </div>

        <div className="duration-block">
          <label>PAUSA CURTA</label>
          <input
            type="number"
            min="1"
            value={localSettings.short}
            onChange={(e) => updateField("short", Number(e.target.value))}
          />
        </div>

        <div className="duration-block">
          <label>PAUSA LONGA</label>
          <input
            type="number"
            min="1"
            value={localSettings.long}
            onChange={(e) => updateField("long", Number(e.target.value))}
          />
        </div>
      </div>

      {/* AUTOMÁTICO */}
      <p className="section-title">POMODORO AUTOMÁTICO</p>

      <div className="auto-container">
        <span>Intervalo para pausa longa</span>
        <input
          type="number"
          min="1"
          value={localSettings.autoLongBreakInterval}
          onChange={(e) =>
            updateField("autoLongBreakInterval", Number(e.target.value))
          }
        />
      </div>

      <div className="auto-container">
        <span>Repetições</span>
        <input
          type="number"
          min="1"
          value={localSettings.autoRepeats}
          onChange={(e) => updateField("autoRepeats", Number(e.target.value))}
        />
      </div>

      <label className="switch-row">
        Habilitar automático
        <label className="switch">
          <input
            type="checkbox"
            checked={localSettings.autoEnabled}
            onChange={(e) => updateField("autoEnabled", e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </label>

      <hr className="divider" />

      {/* ALARME */}
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

      <div className="select-container">
        <label>Escolha seu alarme</label>
        <select
          value={localSettings.alarmSound}
          onChange={(e) => updateField("alarmSound", e.target.value)}
        >
          <option>ALARME 1</option>
          <option>ALARME 2</option>
          <option>ALARME 3</option>
          <option>ALARME 4</option>
          <option>ALARME 5</option>
        </select>
      </div>

      {/* BOTÃO DE SALVAR */}
      <button className="close-btn" onClick={handleSave}>
        Salvar
      </button>

    </dialog>
  );
}
