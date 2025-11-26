import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { createCollection } from "../../../services/collection";
import { getDataUser } from "../../../services/auth";

// Import das imagens
import fisica from "/CoverImages/fisica.svg";
import matematica from "/CoverImages/matematica.svg";
import portugues from "/CoverImages/portugues.svg";
import edfisica from "/CoverImages/edfisica.svg";
import quimica from "/CoverImages/quimica.svg";
import historia from "/CoverImages/historia.svg";
import geografia from "/CoverImages/geografia.svg";
import ingles from "/CoverImages/ingles.svg";
import biologia from "/CoverImages/biologia.svg";

export default function StudyCreateCollection({ onSave }) {
  const [userId, setUserId] = useState(0);
  const dialogRef = useRef(null);

  // Estados dos inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);

  // Controle do modal com animação
  const [open, setOpen] = useState(false);

  const covers = [
    fisica, matematica, portugues, historia,
    edfisica, ingles, geografia, quimica, biologia
  ];

  // ---------- ABRIR E FECHAR ----------
  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const handleCloseWithoutSaving = () => {
    setName("");
    setDescription("");
    setCover(null);
    setOpen(false);
  };

  // ---------- CARREGAR USER ----------
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getDataUser();
        setUserId(user.id);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    }
    loadUser();
  }, []);

  // ---------- USEEFFECT DO MODAL COM ANIMAÇÃO ----------
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

  // ---------- SALVAR ----------
  const handleSave = async () => {
    if (!name || !cover) {
      alert("Dê um nome e escolha uma capa.");
      return;
    }

    const newCollection = {
      name,
      description,
      cover_name: cover,
      owner_id: userId
    };

    try {
      await createCollection(newCollection);
      alert("Coleção criada com sucesso!");

      setName("");
      setDescription("");
      setCover(null);
      closeModal();

      if (onSave) onSave();
    } catch {
      alert("Erro ao criar coleção");
    }
  };

  return (
    <div className="studyCreateCollection">
      <button className="createCollectionButton" onClick={openModal}>
        <FontAwesomeIcon size="lg" icon={faPlus} />
        <p>CRIAR COLEÇÃO</p>
      </button>

      <dialog className="createCollectionModal" ref={dialogRef}>
        <div className="collectionModalContent">
          <p style={{ fontWeight: "bold", fontSize: "larger" }}>CRIAR COLEÇÃO</p>

          <input
            className="collectionInput"
            type="text"
            placeholder="Nome:"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="collectionInput"
            type="text"
            placeholder="Descrição:"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <p style={{ fontSize: "larger" }}>CAPA DA COLEÇÃO:</p>

          <div className="collectionCoverOptions">
            {covers.map((img, i) => (
              <div
                key={i}
                className={`collectionCoverOption ${cover === img ? "selectedCover" : ""}`}
                onClick={() => setCover(img)}
              >
                <img src={img} style={{ width: "8.5rem", height: "8.5rem" }} />
              </div>
            ))}
          </div>

          <button className="collectionButtonSave" onClick={handleSave}>
            SALVAR
          </button>
        </div>
      </dialog>
    </div>
  );
}
