import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { updateCards } from "../../../../services/cards";

export default function EditFlashCard({ open, onClose, flashcard, onSave }) {
    const dialogRef = useRef(null);

    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    // ----------- Preencher inputs quando abrir ----------- //
    useEffect(() => {
        if (open && flashcard) {
            setFront(flashcard.question || "");
            setBack(flashcard.answer || "");
        }
    }, [open, flashcard]);

    // ----------- Controle do modal (igual CreateCollection) ----------- //
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
                    onClose();
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

    // ----------- SALVAR EDIÇÃO ----------- //
    const handleSave = async () => {
        if (!front.trim()) {
            alert("A frente não pode estar vazia.");
            return;
        }
        if (!back.trim()) {
            alert("O verso não pode estar vazio.");
            return;
        }

        try {
            await updateCards(flashcard.id, {
                question: front,
                answer: back
            });

            Swal.fire({
                icon: "success",
                title: "Flashcard atualizado!",
                text: "O flashcard foi editado com sucesso.",
                timer: 1800,
                showConfirmButton: false,
            });

            if (onSave) onSave();
            onClose();

        } catch (err) {
            alert("Erro ao editar o flashcard.");
            console.error(err);
        }
    };

    return (
        <dialog ref={dialogRef} className="createCardModal">
            <div className="cardModalContent">
                <p style={{ fontWeight: "bold", fontSize: "larger" }}>
                    EDITAR FLASHCARD
                </p>

                <input
                    className="cardModalInput"
                    type="text"
                    placeholder="Frente:"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />

                <input
                    className="cardModalInput"
                    type="text"
                    placeholder="Verso:"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                />

                <button className="cardsButtonSave" onClick={handleSave}>
                    SALVAR
                </button>
            </div>
        </dialog>
    );
}
