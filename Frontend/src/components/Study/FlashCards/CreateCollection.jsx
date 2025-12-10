import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { createCollection, updateCollection } from "../../../services/collection";
import { getDataUser } from "../../../services/auth";

import fisica from "/CoverImages/fisica.svg";
import matematica from "/CoverImages/matematica.svg";
import portugues from "/CoverImages/portugues.svg";
import edfisica from "/CoverImages/edfisica.svg";
import quimica from "/CoverImages/quimica.svg";
import historia from "/CoverImages/historia.svg";
import geografia from "/CoverImages/geografia.svg";
import ingles from "/CoverImages/ingles.svg";
import biologia from "/CoverImages/biologia.svg";

export default function StudyCreateCollection({ onSave, editMode = false, initialData = null }) {
  const [userId, setUserId] = useState(0);
  const dialogRef = useRef(null);
  const coversContainerRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);

  const [subject, setSubject] = useState("");
  const [monsterImage, setMonsterImage] = useState("");

  const [open, setOpen] = useState(false);

  const covers = [
    {
      img: fisica,
      title: "Física",
      subject: "Física",
      monster: "/Monsters/Monstro-fisica.svg",
    },
    {
      img: matematica,
      title: "Matemática",
      subject: "Matemática",
      monster: "/Monsters/Monstro-matematica.svg",
    },
    {
      img: portugues,
      title: "Português",
      subject: "Português",
      monster: "/Monsters/Monstro-portugues.svg",
    },
    {
      img: historia,
      title: "História",
      subject: "História",
      monster: "/Monsters/Monstro-historia.svg",
    },
    {
      img: edfisica,
      title: "Ed. Física",
      subject: "Ed. Física",
      monster: "/Monsters/Monstro-edfisica.svg",
    },
    {
      img: ingles,
      title: "Inglês",
      subject: "Inglês",
      monster: "/Monsters/Monstro-ingles.svg",
    },
    {
      img: geografia,
      title: "Geografia",
      subject: "Geografia",
      monster: "/Monsters/Monstro-geografia.svg",
    },
    {
      img: quimica,
      title: "Química",
      subject: "Química",
      monster: "/Monsters/Monstro-quimica.svg",
    },
    {
      img: biologia,
      title: "Biologia",
      subject: "Biologia",
      monster: "/Monsters/Monstro-biologia.svg",
    },
  ];


  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const handleCloseWithoutSaving = () => {
    setName("");
    setDescription("");
    setCover(null);
    setOpen(false);
  };

  // ---------- PREENCHE OS INPUTS AUTOMATICAMENTE QUANDO FOR EDITAR --------------

  useEffect(() => {
    if (editMode && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setCover(initialData.cover_name || null);

      // NOVOS CAMPOS
      setSubject(initialData.subject || "");
      setMonsterImage(initialData.monster_image_path || "");
    }
  }, [editMode, initialData]);


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

  // ---------- SCROLL HORIZONTAL PELO MOUSE ----------

  useEffect(() => {
    const el = coversContainerRef.current;
    if (!el) return;

    const handleWheel = (event) => {
      if (event.deltaY === 0) return;

      event.preventDefault();

      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // ---------- ABRIR E FECHAR MODAL ----------

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

  const handleSave = async () => {
    if (!name || !cover) {
      await Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "É necessário preencher nome, descrição e selecionar uma capa para a coleção.",
        confirmButtonText: "Ok",
        target: dialogRef.current,
      });
      return;
    }

    const newCollection = {
      name,
      description,
      cover_name: cover,
      subject,                // NOVO
      monster_image_path: monsterImage, // NOVO
      owner_id: userId,       // backend ignora, usa o token, mas pode deixar
    };


    try {
      if (editMode) {
        // atualizar
        await updateCollection(initialData.id, newCollection);
      } else {
        // criar
        await createCollection(newCollection);
      }

      closeModal();

      setTimeout(async () => {
        await Swal.fire({
          icon: "success",
          title: "Coleção editada com sucesso!",
          timer: 1800,
          showConfirmButton: false,
        });
      }, 220);

      setName("");
      setDescription("");
      setCover(null);

      if (onSave) onSave();
    } catch (err) {
      console.error("Erro ao editar coleção:", err);
    }
  };

  useEffect(() => {
    if (editMode) {
      setOpen(true);
    }
  }, [editMode]);


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
            maxLength="30"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="collectionInput"
            type="text"
            placeholder="Descrição:"
            maxLength="200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <p style={{ fontSize: "larger" }}>CAPA DA COLEÇÃO:</p>

          <div className="collectionCoverOptions" ref={coversContainerRef}>
            {covers.map((c, i) => (
              <div
                key={i}
                className={`collectionCoverOption ${cover === c.img ? "selectedCover" : ""}`}
                onClick={() => {
                  setCover(c.img);
                  setSubject(c.subject);           // nome da matéria
                  setMonsterImage(c.monster);      // caminho do monstro
                }}

              >
                <img
                  src={c.img}
                  style={{ width: "8.5rem", height: "8.5rem" }}
                  alt={c.title}
                />
                <h1 style={{ fontSize: "1rem" }}>{c.title}</h1>
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
