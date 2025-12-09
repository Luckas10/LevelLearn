import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { updateCollection } from "../../../services/collection";

export default function EditCollection({ open, onClose, initialData, onSave }) {
    const dialogRef = useRef(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cover, setCover] = useState(null);

    const covers = [
        "/CoverImages/fisica.svg",
        "/CoverImages/matematica.svg",
        "/CoverImages/portugues.svg",
        "/CoverImages/historia.svg",
        "/CoverImages/edfisica.svg",
        "/CoverImages/ingles.svg",
        "/CoverImages/geografia.svg",
        "/CoverImages/quimica.svg",
        "/CoverImages/biologia.svg",
    ];

    const handleCloseWithoutSaving = () => {
        setName("");
        setDescription("");
        setCover(null);
        onClose();
    };

    // ----------- ANIMAÇÃO IGUAL AO CREATE COLLECTION ------------
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

    // ----------- PREENCHE CAMPOS AO ABRIR ------------
    useEffect(() => {
        if (open && initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setCover(initialData.cover_name || "");
        }
    }, [open, initialData]);

    const handleSave = async () => {
        if (!name || !cover) {
            Swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Nome, descrição e capa são obrigatórios!",
            });
            return;
        }

        try {
            await updateCollection(initialData.id, {
                name,
                description,
                cover_name: cover,
            });

            Swal.fire({
                icon: "success",
                title: "Coleção editada!",
                text: "Sua coleção foi editada.",
                timer: 1600,
                showConfirmButton: false,
            });

            if (onSave) onSave();
            onClose();
        } catch (err) {
            console.error("Erro ao editar:", err);
        }
    };

    return (
        <dialog className="createCollectionModal" ref={dialogRef}>
            <div className="collectionModalContent">

                <p style={{ fontWeight: "bold", fontSize: "larger" }}>
                    EDITAR COLEÇÃO
                </p>

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
    );
}
