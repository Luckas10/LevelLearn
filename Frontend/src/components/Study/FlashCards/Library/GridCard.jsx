import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getCollectionById } from "../../../../services/collection";
import { getCards, createCards, getCardsByDeckId } from "../../../../services/cards";
import { deleteCards } from "../../../../services/cards";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import InteractiveFlashCard from "../Collection/InteractiveFlashCard";

export default function GridCard({ onSave }) {
    const [flashcards, setFlashCards] = useState([]);
    const [front, setFront] = useState("")
    const [back, setBack] = useState("")
    const [deckId, setDeckId] = useState(0)
    const dialogRef = useRef(null);
    const [open, setOpen] = useState(false);
    const { id } = useParams();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleCloseWithoutSaving = () => {
        setOpen(false);
    };

    // ---------- CARREGAR CARDS ----------

    const loadCards = async () => {
        const data = await getCardsByDeckId(deckId);
        setFlashCards(data)
    }

    useEffect(() => {
        if (deckId) loadCards();
    }, [deckId]);

    // ---------- CARREGAR O ID DA COLEÇÃO ATUAL ----------

    const loadCollections = async () => {
        const data = await getCollectionById(id);
        setDeckId(data.id);
    };

    useEffect(() => {
        loadCollections();
    }, [id]);


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

    // ---------- SALVAR CARD CRIADO ----------

    const handleSave = async () => {
        if (!front.trim()) {
            alert("Coloque a mensagem da frente do flashcard.");
            return;
        }

        if (!back.trim()) {
            alert("Coloque o verso do card.");
            return;
        }

        const newCard = {
            question: front,
            answer: back,
            deck_id: deckId
        };

        try {
            await createCards(newCard);
            await loadCards();
            closeModal()

            setTimeout(async () => {
                await Swal.fire({
                    icon: "success",
                    title: "Flashcard criado com sucesso!",
                    text: "Você criou um flashcard.",
                    timer: 1800,
                    showConfirmButton: false,
                });
            }, 220);

            setFront("");
            setBack("");
            closeModal();

            if (onSave) onSave();
        } catch {
            alert("Erro ao criar card");
        }
    };

    const handleDeleteCard = async (id) => {
        await deleteCards(id);
        loadCards(); // atualizar lista após excluir
    };

    return (
        <div className="createCardContainer">
            <h1 style={{ fontSize: "2.5rem" }}>FLASHCARDS</h1>
            <div className="cards">
                <div className="createdCards">
                    {flashcards.map((card, i) => (
                        <InteractiveFlashCard
                            className="flashCardContainer"
                            key={i}
                            id={card.id}
                            onDelete={handleDeleteCard}
                        >
                            <p style={{ fontSize: "1.5rem", padding: "1rem", wordBreak: "break-word" }}>{card.question}</p>
                            <p style={{ fontSize: "0.9rem" }}>Clique para ver o verso</p>
                        </InteractiveFlashCard>
                    ))}
                </div>
            </div>
        </div>
    )
}
