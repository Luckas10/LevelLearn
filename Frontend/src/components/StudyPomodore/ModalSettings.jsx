import { useRef, useEffect } from "react";
import "./ModalSettings.css";

export function ModalSettings({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open) {
      // abre invisível, aplica animação depois
      dialog.showModal();
      dialog.classList.add("showing");

      requestAnimationFrame(() => {
        dialog.classList.add("visible");
      });
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

  return (
    <dialog ref={dialogRef} className="settings-dialog" onCancel={onClose}>
      <h2 className="modal-title">CONFIGURAÇÕES</h2>

      {/* DURAÇÃO */}
      <p className="section-title">DURAÇÃO (EM MINUTOS)</p>

      <div className="duration-grid">
        <div className="duration-block">
          <label>FOCO</label>
          <input type="number" defaultValue="25" />
        </div>
        <div className="duration-block">
          <label>PAUSA CURTA</label>
          <input type="number" defaultValue="5" />
        </div>
        <div className="duration-block">
          <label>PAUSA LONGA</label>
          <input type="number" defaultValue="15" />
        </div>
      </div>

      {/* AUTOMÁTICO */}
      <p className="section-title">POMODORO AUTOMÁTICO</p>

      <div className="auto-container">
        <span>Intervalo para pausa longa</span>
        <input type="number" defaultValue="4" />
      </div>

      <div className="auto-container">
        <span>Repetições</span>
        <input type="number" defaultValue="15" />
      </div>

      <label className="switch-row">
        Habilitar automático
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </label>

      <hr className="divider" />

      {/* ALARME */}
      <p className="section-title">ALARME</p>

      <label className="switch-row">
        Permitir alarme
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </label>

      <div className="select-container">
        <label>Escolha seu alarme</label>
        <select>
          <option>ALARME 1</option>
          <option>ALARME 2</option>
          <option>ALARME 3</option>
          <option>ALARME 4</option>
          <option>ALARME 5</option>
        </select>
      </div>

      <button className="close-btn" onClick={onClose}>
        Fechar
      </button>
    </dialog>
  );
}
