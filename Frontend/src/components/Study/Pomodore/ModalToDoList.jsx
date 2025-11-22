import { useRef, useEffect, useState } from "react";
import "./ModalToDoList.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPencil } from "@fortawesome/free-solid-svg-icons";

export function ModalToDoList({ open, onClose }) {
  const dialogRef = useRef(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("todolist-data");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("todolist-data", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

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

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: task, done: false }]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev
        .map(t => (t.id === id ? { ...t, done: !t.done } : t))
        .sort((a, b) => a.done - b.done)
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = () => {
    if (!editingText.trim()) return;

    setTasks(prev =>
      prev
        .map(t => (t.id === editingId ? { ...t, text: editingText } : t))
        .sort((a, b) => a.done - b.done)
    );

    setEditingId(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "done") return t.done;
    if (filter === "active") return !t.done;
    return true;
  });

  return (
    <dialog ref={dialogRef} className="todolist-dialog" onCancel={onClose}>
      <button className="close-x" onClick={handleCloseWithoutSaving}>
        <FontAwesomeIcon size="sm" icon={faX} />
      </button>

      <h2 className="modal-title">TAREFAS</h2>

      <div className="todo-input-row">
        <input
          type="text"
          placeholder="Digite sua tarefa..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>+</button>
      </div>

      <div className="todo-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Pendentes
        </button>
        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          Concluídos
        </button>
      </div>

      <ul className="todo-list">
        {filteredTasks.map((t) => (
          <li key={t.id} className="todo-item">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
              />
              <span className="checkmark"></span>
            </label>

            {editingId === t.id ? (
              <input
                className="rename-input"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={saveEditing}
                onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                autoFocus
              />
            ) : (
              <span
                className={`todo-text ${t.done ? "done" : ""}`}
                onDoubleClick={() => startEditing(t)}
              >
                {t.text}
              </span>
            )}

            <div className="actions">
              {editingId !== t.id && (
                <button className="rename-btn" onClick={() => startEditing(t)}>
                  <FontAwesomeIcon size="sm" icon={faPencil} />
                </button>
              )}

              <button className="delete-btn" onClick={() => removeTask(t.id)}>
                <FontAwesomeIcon size="sm" icon={faX} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button className="close-btn" onClick={onClose}>Fechar</button>
    </dialog>
  );
}
